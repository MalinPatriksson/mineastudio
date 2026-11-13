import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, CalendarDays, Check, Download, ExternalLink, MessageSquareText, Utensils, UsersRound, X } from "lucide-react";
import { OrganizerShareLink } from "@/components/organizer-share-link";
import { SiteHeader } from "@/components/site-header";
import { getOrganizerSession } from "@/lib/organizer-auth";
import { getOrganizerInvitation, invitationStatusLabel } from "@/lib/organizer-data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Gästlista", robots: { index: false, follow: false } };

const formatEventDate = (date: string) => new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00`));
const formatResponseDate = (date: string) => new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Europe/Stockholm" }).format(new Date(date));
const publicOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mineastudio.vercel.app";

export default async function GuestListPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getOrganizerSession();
  if (!session) redirect("/mina-inbjudningar");

  const { id } = await params;
  const invitation = await getOrganizerInvitation(session.userId, id);
  if (!invitation) notFound();
  const shareUrl = `${publicOrigin}/i/${invitation.publicToken}`;

  return (
    <main className={`organizer-page organizer-detail organizer-detail--${invitation.categorySlug}`}>
      <SiteHeader quiet />
      <section className="organizer-detail-hero">
        <div className="organizer-detail-art" style={{ backgroundImage: `url(${invitation.templateArtwork})` }} />
        <div className="organizer-detail-heading">
          <Link href="/mina-inbjudningar"><ArrowLeft /> Alla inbjudningar</Link>
          <div className="organizer-detail-kicker"><span>{invitation.templateName}</span><span className={`organizer-status organizer-status--${invitation.status}`}><i />{invitationStatusLabel[invitation.status] ?? invitation.status}</span></div>
          <h1>{invitation.title}</h1>
          <p><CalendarDays /> {formatEventDate(invitation.eventDate)}</p>
          <OrganizerShareLink url={shareUrl} />
          <a className="organizer-view-invitation" href={shareUrl} target="_blank" rel="noreferrer">Visa inbjudan <ExternalLink /></a>
        </div>
      </section>

      <section className="guest-management">
        <div className="guest-management-head">
          <div><p className="eyebrow">Gästhantering</p><h2>Svaren,<br /><em>tydligt samlade.</em></h2></div>
          <a className="button organizer-export" href={`/api/mina-inbjudningar/${invitation.id}/csv`}><Download /> Exportera CSV</a>
        </div>

        <div className="guest-summary">
          <article><span><UsersRound /></span><strong>{invitation.metrics.attendingPeople}</strong><p>personer kommer</p><small>från {invitation.metrics.attendingParties} sällskap</small></article>
          <article><span><X /></span><strong>{invitation.metrics.declinedResponses}</strong><p>har tackat nej</p><small>registrerade nejsvar</small></article>
          <article><span><MessageSquareText /></span><strong>{invitation.metrics.respondingParties}</strong><p>svarande sällskap</p><small>totalt mottagna svar</small></article>
        </div>

        <div className="guest-list-note">
          <Check /> <span><strong>Sällskap och personer räknas separat.</strong> Vi visar inget antal “ej svarat” eftersom ingen förhandsregistrerad gästlista finns.</span>
        </div>

        {invitation.responses.length === 0 ? (
          <div className="guest-empty">
            <MessageSquareText />
            <h3>Inga svar ännu</h3>
            <p>När den första gästen svarar visas uppgifterna här direkt.</p>
          </div>
        ) : (
          <div className="guest-table-wrap">
            <table className="guest-table">
              <thead><tr><th>Gäst</th><th>Svar</th><th>Sällskap</th><th>Allergier & kost</th><th>Meddelande</th><th>Registrerat</th></tr></thead>
              <tbody>
                {invitation.responses.map((response) => (
                  <tr key={response.id}>
                    <td data-label="Gäst"><strong>{response.guestName}</strong></td>
                    <td data-label="Svar"><span className={`guest-attendance guest-attendance--${response.attendance}`}>{response.attendance === "yes" ? <Check /> : <X />}{response.attendance === "yes" ? "Kommer" : "Tackat nej"}</span></td>
                    <td data-label="Sällskap">{response.attendance === "yes" ? <><UsersRound /> {response.partySize} {response.partySize === 1 ? "person" : "personer"}</> : <span className="guest-muted">—</span>}</td>
                    <td data-label="Allergier & kost">{response.allergies ? <><Utensils /> {response.allergies}</> : <span className="guest-muted">Inget angivet</span>}</td>
                    <td data-label="Meddelande">{response.message ? <q>{response.message}</q> : <span className="guest-muted">Inget meddelande</span>}</td>
                    <td data-label="Registrerat"><time dateTime={response.respondedAt}>{formatResponseDate(response.respondedAt)}</time></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

