import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { InvitationStudio, type StudioConfiguration } from "@/components/invitation-studio";
import { templateById } from "@/lib/invitations";
import { getOrganizerSession } from "@/lib/organizer-auth";
import { getOrganizerInvitation } from "@/lib/organizer-data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Redigera inbjudan", robots: { index: false, follow: false } };

export default async function EditInvitationPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getOrganizerSession();
  if (!session) redirect("/mina-inbjudningar");

  const { id } = await params;
  const invitation = await getOrganizerInvitation(session.userId, id);
  if (!invitation) notFound();

  const template = templateById[invitation.templateId];
  if (!template) notFound();

  const initialConfiguration: StudioConfiguration = {
    data: { ...template.defaultData, ...invitation.data },
    enabled: invitation.enabled,
    animation: invitation.animation,
    colorway: invitation.colorway,
    rsvpMode: invitation.rsvpMode,
    rsvpQuestions: invitation.rsvpQuestions,
  };

  return <InvitationStudio template={template} invitationId={invitation.id} initialConfiguration={initialConfiguration} />;
}
