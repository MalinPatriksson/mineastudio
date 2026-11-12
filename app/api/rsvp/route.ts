import { createHash, randomBytes } from "node:crypto";
import { z } from "zod";
import { getSupabaseAdmin, isRsvpBackendConfigured } from "@/lib/supabase-server";

export const runtime = "nodejs";

const responseSchema = z.object({
  invitationToken: z.string().min(20).max(128),
  editToken: z.string().min(32).max(128).optional(),
  guestName: z.string().trim().min(2).max(100),
  attendance: z.enum(["yes", "no"]),
  partySize: z.number().int().min(1).max(20).optional(),
  allergies: z.string().trim().max(500).optional(),
  message: z.string().trim().max(1000).optional(),
  website: z.string().max(0).optional(),
});

const manageSchema = z.object({
  invitationToken: z.string().min(20).max(128),
  editToken: z.string().min(32).max(128),
});

const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");

function unavailable() {
  return Response.json({ error: "OSA-tjänsten är inte konfigurerad ännu." }, { status: 503 });
}

export async function PUT(request: Request) {
  if (!isRsvpBackendConfigured) return unavailable();
  const parsed = manageSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Ogiltig ändringslänk." }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { data: invitation } = await supabase.from("invitations").select("id, status, expires_at").eq("public_token", parsed.data.invitationToken).maybeSingle();
  if (!invitation || invitation.status !== "published" || (invitation.expires_at && new Date(invitation.expires_at).getTime() < Date.now())) {
    return Response.json({ error: "Inbjudan är inte tillgänglig." }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("rsvp_responses")
    .select("guest_name, attendance, party_size, allergies, message, updated_at")
    .eq("invitation_id", invitation.id)
    .eq("manage_token_hash", tokenHash(parsed.data.editToken))
    .maybeSingle();

  if (error || !data) return Response.json({ error: "Svaret kunde inte hittas." }, { status: 404 });
  return Response.json({ response: data });
}

export async function POST(request: Request) {
  if (!isRsvpBackendConfigured) return unavailable();

  const parsed = responseSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Kontrollera att alla uppgifter är korrekt ifyllda." }, { status: 400 });
  if (parsed.data.website) return Response.json({ error: "Svaret kunde inte skickas." }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { data: invitation, error: invitationError } = await supabase
    .from("invitations")
    .select("id, status, expires_at, rsvp_mode, rsvp_ask_party_size, rsvp_ask_allergies, rsvp_ask_message")
    .eq("public_token", parsed.data.invitationToken)
    .maybeSingle();

  if (invitationError || !invitation || invitation.status !== "published" || invitation.rsvp_mode !== "form") {
    return Response.json({ error: "Inbjudan tar inte emot OSA-svar." }, { status: 404 });
  }
  if (invitation.expires_at && new Date(invitation.expires_at).getTime() < Date.now()) {
    return Response.json({ error: "OSA-perioden har avslutats." }, { status: 410 });
  }

  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const fingerprint = createHash("sha256")
    .update(`${forwardedFor}|${request.headers.get("user-agent") ?? "unknown"}|${process.env.RSVP_RATE_LIMIT_SALT}`)
    .digest("hex");
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("rsvp_responses")
    .select("id", { count: "exact", head: true })
    .eq("request_fingerprint_hash", fingerprint)
    .gte("updated_at", since);
  if ((count ?? 0) >= 5) return Response.json({ error: "För många försök. Vänta en stund och försök igen." }, { status: 429 });

  const editToken = parsed.data.editToken ?? randomBytes(32).toString("base64url");
  const manageTokenHash = tokenHash(editToken);
  const responseData = {
    guest_name: parsed.data.guestName,
    attendance: parsed.data.attendance,
    party_size: invitation.rsvp_ask_party_size && parsed.data.attendance === "yes" ? (parsed.data.partySize ?? 1) : 1,
    allergies: invitation.rsvp_ask_allergies ? (parsed.data.allergies || null) : null,
    message: invitation.rsvp_ask_message ? (parsed.data.message || null) : null,
    request_fingerprint_hash: fingerprint,
    updated_at: new Date().toISOString(),
  };

  if (parsed.data.editToken) {
    const { data: updated, error } = await supabase
      .from("rsvp_responses")
      .update(responseData)
      .eq("invitation_id", invitation.id)
      .eq("manage_token_hash", manageTokenHash)
      .select("id")
      .maybeSingle();
    if (error || !updated) return Response.json({ error: "Ändringslänken är ogiltig eller har gått ut." }, { status: 403 });
  } else {
    const { error } = await supabase.from("rsvp_responses").insert({
      invitation_id: invitation.id,
      manage_token_hash: manageTokenHash,
      ...responseData,
    });
    if (error) return Response.json({ error: "Svaret kunde inte sparas. Försök igen." }, { status: 500 });
  }

  return Response.json({
    ok: true,
    editToken,
    editUrl: `/i/${parsed.data.invitationToken}#rsvp=${editToken}`,
    message: parsed.data.editToken ? "Ditt svar har uppdaterats." : "Tack! Ditt svar är registrerat.",
  });
}

