import Link from "next/link";
import { notFound } from "next/navigation";
import { InvitationRenderer } from "@/components/invitation-renderer";
import { defaultRsvpQuestions, templateById } from "@/lib/invitations";
import { getPublishedInvitation } from "@/lib/public-invitations";

export const metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function PublishedInvitationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const demoTemplate = templateById[slug];
  const published = demoTemplate ? null : await getPublishedInvitation(slug);
  const template = demoTemplate ?? (published ? templateById[published.templateId] : undefined);
  if (!template) notFound();

  const data = published ? { ...template.defaultData, ...published.data } : template.defaultData;
  const enabled = published?.enabled ?? template.recommended;
  const animation = published?.animation ?? "soft";
  const colorway = published?.colorway ?? "signature";
  const rsvpMode = published?.rsvpMode ?? "form";
  const rsvpQuestions = published?.rsvpQuestions ?? defaultRsvpQuestions;

  return <main className={`published-page published-page--${template.palette}`}>
    {demoTemplate && <div className="published-demo"><span>Publicerad demovy · OSA-svar sparas inte</span><Link href={`/studio/${template.id}`}>Redigera inbjudan</Link></div>}
    <div className="published-shell"><InvitationRenderer template={template} data={data} enabled={enabled} animation={animation} colorway={colorway} envelope demoMark={Boolean(demoTemplate)} invitationToken={published ? slug : undefined} rsvpMode={rsvpMode} rsvpQuestions={rsvpQuestions} /></div>
    <p className="published-brand">Skapad med <Link href="/">Minea Studio</Link></p>
  </main>;
}

export function generateStaticParams() {
  return Object.keys(templateById).map((slug) => ({ slug }));
}
