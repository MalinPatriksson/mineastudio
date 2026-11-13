import { createHash } from "node:crypto";
import { z } from "zod";
import { invitationRetentionDays } from "@/lib/config";
import { templateById } from "@/lib/invitations";
import type { InvitationData } from "@/lib/invitations";
import { getSupabaseAdmin, isRsvpBackendConfigured } from "@/lib/supabase-server";

export const runtime = "nodejs";

const invitationDataSchema = z.object({
  name: z.string().trim().min(1).max(32),
  // The platform request limit is the outer guard. Existing editor sessions may
  // still contain an original data URL; newly selected photos are compressed client-side.
  photoUrl: z.string().optional(),
  photoPositionX: z.number().min(0).max(100).optional(),
  photoPositionY: z.number().min(0).max(100).optional(),
  photoShape: z.enum(["organic", "arch", "circle"]).optional(),
  photoFrame: z.enum(["clean", "fade", "floral"]).optional(),
  age: z.string().max(3).optional(),
  date: z.iso.date(),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.union([z.string().regex(/^\d{2}:\d{2}$/), z.literal("")]).optional(),
  address: z.string().trim().min(2).max(180),
  kicker: z.string().max(48),
  subtitle: z.string().max(48),
  greeting: z.string().max(150),
  footerText: z.string().max(120),
  countdownLabel: z.string().max(80),
  rsvpHint: z.string().max(80),
  rsvpLabel: z.string().max(80),
  mapHint: z.string().max(80),
  mapLabel: z.string().max(80),
  calendarHint: z.string().max(80),
  calendarLabel: z.string().max(80),
  phone: z.string().trim().min(5).max(30),
  rsvpDate: z.union([z.iso.date(), z.literal("")]),
});

const purchaseSchema = z.object({
  checkoutReference: z.uuid(),
  email: z.email().trim().max(254),
  templateId: z.string().min(2).max(64),
  data: invitationDataSchema,
  enabled: z.array(z.enum(["rsvp", "map", "calendar", "countdown", "greeting"])).max(5),
  animation: z.enum(["none", "soft", "playful"]),
  colorway: z.enum(["signature", "soft", "deep", "beige", "boy"]),
  rsvpMode: z.enum(["form", "sms", "none"]),
  rsvpQuestions: z.object({ partySize: z.boolean(), allergies: z.boolean(), message: z.boolean() }),
  website: z.string().max(0).optional(),
});

function publicOrigin(request: Request) {
  return process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
}

async function findOrCreateBuyer(email: string) {
  const supabase = getSupabaseAdmin();
  const normalizedEmail = email.toLowerCase();
  const { data: usersPage, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listError) throw new Error("Köparen kunde inte kontrolleras.");

  const existing = usersPage.users.find((user) => user.email?.toLowerCase() === normalizedEmail);
  if (existing) return existing;

  const { data, error } = await supabase.auth.admin.createUser({
    email: normalizedEmail,
    email_confirm: true,
    user_metadata: { source: "minea_test_purchase" },
  });
  if (error || !data.user) throw new Error("Kundkontot kunde inte skapas.");
  return data.user;
}

export async function POST(request: Request) {
  if (!isRsvpBackendConfigured) return Response.json({ error: "Köpet är inte konfigurerat ännu." }, { status: 503 });
  const parsed = purchaseSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const field = parsed.error.issues[0]?.path.join(".");
    const error = field === "email"
      ? "Kontrollera att mejladressen är korrekt."
      : "Kontrollera datum, tider och obligatoriska uppgifter i inbjudan.";
    return Response.json({ error, field }, { status: 400 });
  }
  if (parsed.data.website) return Response.json({ error: "Köpet kunde inte genomföras." }, { status: 400 });

  const template = templateById[parsed.data.templateId];
  if (!template) return Response.json({ error: "Designen kunde inte hittas." }, { status: 404 });

  const supabase = getSupabaseAdmin();
  const { data: existingPurchase } = await supabase
    .from("invitations")
    .select("id, public_token")
    .eq("checkout_reference", parsed.data.checkoutReference)
    .maybeSingle();
  if (existingPurchase) {
    return Response.json({
      ok: true,
      invitationId: existingPurchase.id,
      invitationUrl: `${publicOrigin(request)}/i/${existingPurchase.public_token}`,
      dashboardUrl: `${publicOrigin(request)}/mina-inbjudningar`,
      loginEmailSent: true,
    });
  }

  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const fingerprint = createHash("sha256")
    .update(`${forwardedFor}|${request.headers.get("user-agent") ?? "unknown"}|${process.env.RSVP_RATE_LIMIT_SALT}`)
    .digest("hex");
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error: rateError } = await supabase
    .from("purchase_requests")
    .select("id", { count: "exact", head: true })
    .eq("fingerprint_hash", fingerprint)
    .gte("created_at", since);
  if (rateError) return Response.json({ error: "Testköpet väntar på databaskonfiguration." }, { status: 503 });
  if ((count ?? 0) >= 5) return Response.json({ error: "För många testköp. Vänta en stund och försök igen." }, { status: 429 });

  const buyer = await findOrCreateBuyer(parsed.data.email).catch(() => null);
  if (!buyer) return Response.json({ error: "Köpet kunde inte kopplas till din mejladress." }, { status: 500 });

  const eventDate = new Date(`${parsed.data.data.date}T12:00:00Z`);
  eventDate.setUTCDate(eventDate.getUTCDate() + invitationRetentionDays);
  const now = new Date().toISOString();
  const { data: invitation, error: insertError } = await supabase
    .from("invitations")
    .insert({
      owner_id: buyer.id,
      checkout_reference: parsed.data.checkoutReference,
      template_id: template.id,
      title: parsed.data.data.name,
      event_date: parsed.data.data.date,
      invitation_data: parsed.data.data as InvitationData,
      enabled_features: parsed.data.enabled,
      animation: parsed.data.animation,
      colorway: parsed.data.colorway,
      rsvp_mode: parsed.data.rsvpMode,
      rsvp_ask_party_size: parsed.data.rsvpQuestions.partySize,
      rsvp_ask_allergies: parsed.data.rsvpQuestions.allergies,
      rsvp_ask_message: parsed.data.rsvpQuestions.message,
      status: "published",
      purchased_at: now,
      expires_at: eventDate.toISOString(),
      updated_at: now,
    })
    .select("id, public_token")
    .single();

  if (insertError || !invitation) return Response.json({ error: "Inbjudan kunde inte publiceras. Försök igen." }, { status: 500 });
  await supabase.from("purchase_requests").insert({ fingerprint_hash: fingerprint });

  const origin = publicOrigin(request);
  const { error: emailError } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: { shouldCreateUser: false, emailRedirectTo: `${origin}/auth/bekrafta` },
  });

  return Response.json({
    ok: true,
    invitationId: invitation.id,
    invitationUrl: `${origin}/i/${invitation.public_token}`,
    dashboardUrl: `${origin}/mina-inbjudningar`,
    loginEmailSent: !emailError,
  });
}

