import "server-only";

import type { InvitationData } from "@/lib/invitations";
import { templateById } from "@/lib/invitations";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export type GuestResponse = {
  id: string;
  guestName: string;
  attendance: "yes" | "no";
  partySize: number;
  allergies: string | null;
  message: string | null;
  respondedAt: string;
};

export type OrganizerInvitation = {
  id: string;
  publicToken: string;
  templateId: string;
  templateName: string;
  templateArtwork: string;
  categorySlug: string;
  title: string;
  eventDate: string;
  status: string;
  purchasedAt: string | null;
  data: Partial<InvitationData>;
  responses: GuestResponse[];
  metrics: {
    respondingParties: number;
    attendingParties: number;
    attendingPeople: number;
    declinedResponses: number;
  };
};

type InvitationRow = {
  id: string;
  public_token: string;
  template_id: string;
  title: string;
  event_date: string;
  status: string;
  purchased_at: string | null;
  invitation_data: Partial<InvitationData> | null;
};

type ResponseRow = {
  id: string;
  invitation_id: string;
  guest_name: string;
  attendance: "yes" | "no";
  party_size: number;
  allergies: string | null;
  message: string | null;
  updated_at: string;
};

function normalizeInvitation(row: InvitationRow, responseRows: ResponseRow[]): OrganizerInvitation {
  const template = templateById[row.template_id];
  const responses = responseRows
    .filter((response) => response.invitation_id === row.id)
    .map((response) => ({
      id: response.id,
      guestName: response.guest_name,
      attendance: response.attendance,
      partySize: response.party_size,
      allergies: response.allergies,
      message: response.message,
      respondedAt: response.updated_at,
    }));

  return {
    id: row.id,
    publicToken: row.public_token,
    templateId: row.template_id,
    templateName: template?.name ?? row.template_id,
    templateArtwork: template?.artwork ?? "/art/sandlofte-world.png",
    categorySlug: template?.categorySlug ?? "brollop",
    title: row.title,
    eventDate: row.event_date,
    status: row.status,
    purchasedAt: row.purchased_at,
    data: row.invitation_data ?? {},
    responses,
    metrics: {
      respondingParties: responses.length,
      attendingParties: responses.filter((response) => response.attendance === "yes").length,
      attendingPeople: responses
        .filter((response) => response.attendance === "yes")
        .reduce((total, response) => total + response.partySize, 0),
      declinedResponses: responses.filter((response) => response.attendance === "no").length,
    },
  };
}

export async function getOrganizerInvitations(ownerId: string) {
  const supabase = getSupabaseAdmin();
  const { data: invitationRows, error } = await supabase
    .from("invitations")
    .select("id, public_token, template_id, title, event_date, status, purchased_at, invitation_data")
    .eq("owner_id", ownerId)
    .not("purchased_at", "is", null)
    .order("event_date", { ascending: false });

  if (error) throw new Error("Inbjudningarna kunde inte hämtas.");
  const rows = (invitationRows ?? []) as InvitationRow[];
  if (rows.length === 0) return [];

  const { data: responseRows, error: responseError } = await supabase
    .from("rsvp_responses")
    .select("id, invitation_id, guest_name, attendance, party_size, allergies, message, updated_at")
    .in("invitation_id", rows.map((row) => row.id))
    .order("updated_at", { ascending: false });

  if (responseError) throw new Error("Gästsvaren kunde inte hämtas.");
  return rows.map((row) => normalizeInvitation(row, (responseRows ?? []) as ResponseRow[]));
}

export async function getOrganizerInvitation(ownerId: string, invitationId: string) {
  const invitations = await getOrganizerInvitations(ownerId);
  return invitations.find((invitation) => invitation.id === invitationId) ?? null;
}

export const invitationStatusLabel: Record<string, string> = {
  draft: "Utkast",
  pending_payment: "Väntar på betalning",
  published: "Publicerad",
  expired: "Avslutad",
  cancelled: "Avbruten",
};

