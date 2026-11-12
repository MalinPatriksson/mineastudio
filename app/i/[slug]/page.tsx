import Link from "next/link";
import { notFound } from "next/navigation";
import { InvitationRenderer } from "@/components/invitation-renderer";
import { templateById } from "@/lib/invitations";

export const metadata = { robots: { index: false, follow: false } };

export default async function PublishedInvitationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = templateById[slug];
  if (!template) notFound();
  return <main className={`published-page published-page--${template.palette}`}><div className="published-demo"><span>Publicerad demovy · vattenmärkt före köp</span><Link href={`/studio/${template.id}`}>Redigera inbjudan</Link></div><div className="published-shell"><InvitationRenderer template={template} data={template.defaultData} enabled={template.recommended} animation="soft" envelope /></div><p className="published-brand">Skapad med <Link href="/">Minea Studio</Link></p></main>;
}

export function generateStaticParams() {
  return Object.keys(templateById).map((slug) => ({ slug }));
}
