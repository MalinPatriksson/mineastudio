import { invitationRetentionDays } from "@/lib/config";
import type { InvitationData } from "@/lib/invitations";
import { invitationConfigurationSchema, invitationValidationMessage } from "@/lib/invitation-validation";
import { getOrganizerSession } from "@/lib/organizer-auth";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getOrganizerSession();
  if (!session) return Response.json({ error: "Din inloggning har gått ut. Begär en ny säker länk." }, { status: 401 });

  const parsed = invitationConfigurationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({
      error: invitationValidationMessage(parsed.error.issues[0]?.path.join(".")),
    }, { status: 400 });
  }

  const { id } = await context.params;
  const supabase = getSupabaseAdmin();
  const { data: existing, error: existingError } = await supabase
    .from("invitations")
    .select("invitation_data")
    .eq("id", id)
    .eq("owner_id", session.userId)
    .not("purchased_at", "is", null)
    .maybeSingle();

  if (existingError) return Response.json({ error: "Inbjudan kunde inte hämtas." }, { status: 500 });
  if (!existing) return Response.json({ error: "Inbjudan kunde inte hittas." }, { status: 404 });

  const previousData = existing.invitation_data as InvitationData;
  const editableData: InvitationData = {
    ...previousData,
    date: parsed.data.data.date,
    startTime: parsed.data.data.startTime,
    endTime: parsed.data.data.endTime,
    address: parsed.data.data.address,
    greeting: parsed.data.data.greeting,
    phone: parsed.data.data.phone,
    rsvpDate: parsed.data.data.rsvpDate,
  };
  const expiresAt = new Date(`${parsed.data.data.date}T12:00:00Z`);
  expiresAt.setUTCDate(expiresAt.getUTCDate() + invitationRetentionDays);

  const { data: invitation, error } = await supabase
    .from("invitations")
    .update({
      title: previousData.name,
      event_date: editableData.date,
      invitation_data: editableData,
      enabled_features: parsed.data.enabled,
      rsvp_mode: parsed.data.rsvpMode,
      rsvp_ask_party_size: parsed.data.rsvpQuestions.partySize,
      rsvp_ask_allergies: parsed.data.rsvpQuestions.allergies,
      rsvp_ask_message: parsed.data.rsvpQuestions.message,
      expires_at: expiresAt.toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("owner_id", session.userId)
    .not("purchased_at", "is", null)
    .select("id, public_token")
    .maybeSingle();

  if (error) {
    console.error("Invitation update failed", { invitationId: id, code: error.code });
    return Response.json({ error: "Ändringarna kunde inte sparas. Försök igen." }, { status: 500 });
  }
  if (!invitation) return Response.json({ error: "Inbjudan kunde inte hittas." }, { status: 404 });

  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
  return Response.json({
    ok: true,
    invitationUrl: `${origin}/i/${invitation.public_token}`,
    updatedAt: new Date().toISOString(),
  });
}
