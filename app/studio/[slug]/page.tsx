import { notFound } from "next/navigation";
import { InvitationStudio } from "@/components/invitation-studio";
import { templateById } from "@/lib/invitations";

export const metadata = { robots: { index: false, follow: false } };

export default async function StudioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = templateById[slug];
  if (!template) notFound();
  return <InvitationStudio template={template} />;
}

export function generateStaticParams() {
  return Object.keys(templateById).map((slug) => ({ slug }));
}
