import "server-only";
import type { AnimationStyle, Colorway, FeatureKey, InvitationData, RsvpMode, RsvpQuestionConfig } from "@/lib/invitations";
import { getSupabaseAdmin, isRsvpBackendConfigured } from "@/lib/supabase-server";

export type PublishedInvitation = {
  templateId: string;
  data: Partial<InvitationData>;
  enabled: FeatureKey[];
  animation: AnimationStyle;
  colorway: Colorway;
  rsvpMode: RsvpMode;
  rsvpQuestions: RsvpQuestionConfig;
};

export async function getPublishedInvitation(publicToken: string): Promise<PublishedInvitation | null> {
  if (!isRsvpBackendConfigured) return null;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("invitations")
    .select("template_id, invitation_data, enabled_features, animation, colorway, rsvp_mode, rsvp_ask_party_size, rsvp_ask_allergies, rsvp_ask_message, status, expires_at")
    .eq("public_token", publicToken)
    .maybeSingle();

  if (error || !data || data.status !== "published") return null;
  if (data.expires_at && new Date(data.expires_at).getTime() < Date.now()) return null;

  return {
    templateId: data.template_id,
    data: (data.invitation_data ?? {}) as Partial<InvitationData>,
    enabled: (data.enabled_features ?? []) as FeatureKey[],
    animation: data.animation as AnimationStyle,
    colorway: data.colorway as Colorway,
    rsvpMode: data.rsvp_mode as RsvpMode,
    rsvpQuestions: {
      partySize: Boolean(data.rsvp_ask_party_size),
      allergies: Boolean(data.rsvp_ask_allergies),
      message: Boolean(data.rsvp_ask_message),
    },
  };
}

