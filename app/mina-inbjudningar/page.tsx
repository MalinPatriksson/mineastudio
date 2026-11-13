import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, ExternalLink, Mail, MessageSquareText, PartyPopper, UsersRound } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { OrganizerLogin } from "@/components/organizer-login";
import { OrganizerShareLink } from "@/components/organizer-share-link";
import { getOrganizerSession, organizerAuthConfigured } from "@/lib/organizer-auth";
import { getOrganizerInvitations, invitationStatusLabel } from "@/lib/organizer-data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Mina inbjudningar", robots: { index: false, follow: false } };

const formatDate = (date: string) => new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date}T12:00:00`));
const publicOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mineastudio.vercel.app";

export default async function OrganizerDashboardPage() {
  const session = await getOrganizerSession();

  if (!session) {
    return (
      <main className="organizer-page organizer-page--login">
        <SiteHeader quiet />
        <section className="organizer-login-layout">
          <div className="organizer-login-copy">
            <p className="eyebrow">Mina inbjudningar</p>
            <h1>Allt för festen.<br /><em>Samlat på ett ställe.</em></h1>
            <p>Se vilka som kommer, läs gästernas hälsningar och hitta länken som du delar vidare.</p>
            <div className="organizer-login-points">
              <span><UsersRound /> Tydlig gästöversikt</span>
              <span><MessageSquareText /> Alla OSA-svar samlade</span>
              <span><Mail /> Privat åtkomst via din mejl</span>
            </div>
          </div>
          <OrganizerLogin configured={organizerAuthConfigured} />
        </section>
      </main>
    );
  }

  const invitations = await getOrganizerInvitations(session.userId);
  const totals = invitations.reduce((summary, invitation) => ({
    events: summary.events + 1,
    attending: summary.attending + invitation.metrics.attendingPeople,
    responses: summary.responses + invitation.metrics.respondingParties,
  }), { events: 0, attending: 0, responses: 0 });

  return (
    <main className="organizer-page">
      <SiteHeader quiet />
      <section className="organizer-dashboard-hero">
        <div>
          <p className="eyebrow">Din privata arrangörssida</p>
          <h1>Mina inbjudningar</h1>
          <p>Välkommen tillbaka. Här följer du svaren från första ja till sista hälsningen.</p>
        </div>
        <div className="organizer-account">
          <span>{session.email}</span>
          <form action="/api/auth/logout" method="post"><button type="submit">Logga ut</button></form>
        </div>
      </section>

      <section className="organizer-dashboard">
        {invitations.length > 0 && (
          <div className="organizer-total-strip">
            <div><PartyPopper /><span><strong>{totals.events}</strong> {totals.events === 1 ? "inbjudan" : "inbjudningar"}</span></div>
            <div><UsersRound /><span><strong>{totals.attending}</strong> personer kommer</span></div>
            <div><MessageSquareText /><span><strong>{totals.responses}</strong> svarande sällskap</span></div>
          </div>
        )}

        {invitations.length === 0 ? (
          <div className="organizer-empty">
            <span><CalendarDays /></span>
            <p className="eyebrow">Din samling är tom</p>
            <h2>Din första stund väntar.</h2>
            <p>När en inbjudan är köpt visas den här tillsammans med delningslänk och gästernas svar.</p>
            <Link className="button button-dark" href="/#kollektion">Se kollektionen <ArrowRight /></Link>
          </div>
        ) : (
          <div className="organizer-invitation-list">
            {invitations.map((invitation, index) => {
              const shareUrl = `${publicOrigin}/i/${invitation.publicToken}`;
              return (
                <article className={`organizer-invitation-card organizer-invitation-card--${invitation.categorySlug}`} key={invitation.id}>
                  <div className="organizer-card-art" style={{ backgroundImage: `url(${invitation.templateArtwork})` }}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <b>{invitation.templateName}</b>
                  </div>
                  <div className="organizer-card-body">
                    <div className="organizer-card-title">
                      <div><p>{invitation.templateName}</p><h2>{invitation.title}</h2></div>
                      <span className={`organizer-status organizer-status--${invitation.status}`}><i />{invitationStatusLabel[invitation.status] ?? invitation.status}</span>
                    </div>
                    <p className="organizer-event-date"><CalendarDays /> {formatDate(invitation.eventDate)}</p>
                    <OrganizerShareLink url={shareUrl} />
                    <div className="organizer-card-metrics">
                      <div><strong>{invitation.metrics.attendingPeople}</strong><span>personer kommer</span></div>
                      <div><strong>{invitation.metrics.declinedResponses}</strong><span>tackat nej</span></div>
                      <div><strong>{invitation.metrics.respondingParties}</strong><span>svarande sällskap</span></div>
                    </div>
                    <div className="organizer-card-actions">
                      <Link href={`/mina-inbjudningar/${invitation.id}`}>Öppna gästlistan <ArrowRight /></Link>
                      <a href={shareUrl} target="_blank" rel="noreferrer">Visa inbjudan <ExternalLink /></a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

