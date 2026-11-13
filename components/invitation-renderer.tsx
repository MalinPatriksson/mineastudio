"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CalendarPlus, ChevronRight, Clock3, MapPin, MessageCircle } from "lucide-react";
import type { AnimationStyle, Colorway, FeatureKey, InvitationData, InvitationTemplate, RsvpMode, RsvpQuestionConfig } from "@/lib/invitations";
import { defaultRsvpQuestions } from "@/lib/invitations";
import { InvitationPhoto } from "./invitation-photo";
import { RsvpForm } from "./rsvp-form";

type Props = {
  template: InvitationTemplate;
  data: InvitationData;
  enabled: FeatureKey[];
  animation: AnimationStyle;
  colorway?: Colorway;
  interactive?: boolean;
  demoMark?: boolean;
  envelope?: boolean;
  rsvpMode?: RsvpMode;
  rsvpQuestions?: RsvpQuestionConfig;
  invitationToken?: string;
  thumbnail?: boolean;
};

const sealName = (name: string) => {
  const names = name.split("&").map((part) => part.trim()).filter(Boolean);
  if (names.length > 1) return names.map((part) => part.charAt(0)).join(" & ");
  return (name.trim().split(/\s+/)[0] || "Minea").slice(0, 9);
};

const formatDate = (value: string) => {
  if (!value) return "Datum kommer";
  return new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T12:00:00`));
};

function calendarUrl(data: InvitationData) {
  const start = `${data.date.replaceAll("-", "")}T${data.startTime.replace(":", "")}00`;
  const end = `${data.date.replaceAll("-", "")}T${(data.endTime || data.startTime).replace(":", "")}00`;
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Fira ${data.name}`)}&dates=${start}/${end}&location=${encodeURIComponent(data.address)}&details=${encodeURIComponent(data.greeting)}`;
}

function rsvpMessage(name: string) {
  const title = name.trim() || "firandet";
  const isEventTitle = /kalas|bröllop|dop|namngivning|fest|mottagning|middag/i.test(title);
  return isEventTitle ? `Hej! Vi kommer gärna på ${title}!` : `Hej! Vi kommer gärna och firar ${title}!`;
}

function Countdown({ date, label }: { date: string; label: string }) {
  const days = Math.max(0, Math.ceil((new Date(`${date}T00:00:00`).getTime() - new Date("2026-11-11T00:00:00").getTime()) / 86400000));
  return <div className="invite-countdown"><span>{days}</span><small>{label}</small></div>;
}

export function InvitationRenderer({ template, data, enabled, animation, colorway = "signature", interactive = true, demoMark = true, envelope = false, rsvpMode = "sms", rsvpQuestions = defaultRsvpQuestions, invitationToken, thumbnail = false }: Props) {
  const photoIsBackground = template.layout === "cinematic" && Boolean(data.photoUrl);
  const actions = enabled.filter((feature) => ["rsvp", "map", "calendar"].includes(feature) && (feature !== "rsvp" || rsvpMode !== "none"));
  const motionEnabled = animation !== "none";
  const playful = animation === "playful";
  const densityScore = enabled.length + (data.photoUrl ? 2 : 0) + (data.greeting.length > 95 ? 1 : 0) + (data.name.length > 18 ? 1 : 0);
  const dense = densityScore >= 6;
  const extraDense = densityScore >= 8;
  const [opened, setOpened] = useState(!envelope);
  const [opening, setOpening] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [postcardFlipped, setPostcardFlipped] = useState(false);

  useEffect(() => {
    if (!invitationToken || !window.location.hash.includes("rsvp=")) return;
    const timer = window.setTimeout(() => setRsvpOpen(true), 0);
    return () => window.clearTimeout(timer);
  }, [invitationToken]);

  const openEnvelope = () => {
    if (opening) return;
    setOpening(true);
    window.setTimeout(() => setOpened(true), 1500);
  };

  return (
    <motion.article className={`invitation invitation--${template.palette} invitation--layout-${template.layout} colorway--${colorway} animation--${animation} ${thumbnail ? "invitation--thumbnail" : ""} ${postcardFlipped ? "is-postcard-flipped" : ""} ${dense ? "invitation--dense" : ""} ${extraDense ? "invitation--extra-dense" : ""} ${envelope && !opened ? "invitation--sealed" : ""}`}>
      <div className="invite-world-bg" style={{ backgroundImage: `url(${photoIsBackground ? data.photoUrl : template.artwork})`, ...(photoIsBackground ? { backgroundPosition: `${data.photoPositionX ?? 50}% ${data.photoPositionY ?? 50}%` } : {}) }} />

      <AnimatePresence>
        {!opened && (
          <motion.div className={`envelope-scene envelope-scene--${template.palette} envelope-scene--layout-${template.layout}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.025 }} transition={{ duration: .45 }}>
            <div className="envelope-atmosphere" />
            <button className={`envelope-button ${opening ? "is-opening" : ""}`} type="button" onClick={openEnvelope} aria-label="Öppna kuvertet">
              <div className="envelope-wrap">
                <div className="envelope-back" />
                <motion.div className="envelope-letter" initial={false} animate={opening ? { y: -205, scale: 1.045, opacity: 1 } : { y: 82, scale: .97, opacity: 0 }} transition={{ y: { duration: 1.12, delay: .34, ease: [0.2, .82, .2, 1] }, scale: { duration: 1.12, delay: .34 }, opacity: { duration: .24, delay: opening ? .48 : 0 } }}>
                  <span className="envelope-letter-art" style={{ backgroundImage: `url(${template.artwork})` }} />
                  <small>{data.kicker}<b>{data.name}</b><em>{data.subtitle}</em></small>
                </motion.div>
                <motion.div className="envelope-flap" animate={opening ? { rotateX: -88, opacity: 0 } : { rotateX: [0, -3, 0], opacity: 1 }} transition={opening ? { duration: .38, ease: [0.4, 0, 1, 1] } : { duration: 3, repeat: Infinity }}>
                  <span className="envelope-flap-paper" />
                </motion.div>
                <motion.div className="envelope-flap-open" initial={false} animate={opening ? { scaleY: -1, opacity: 1 } : { scaleY: 0, opacity: 0 }} transition={{ duration: .48, delay: opening ? .26 : 0, ease: [0.2, .75, .2, 1] }} aria-hidden="true" />
                <div className="envelope-front"><span className="envelope-seam envelope-seam--left" /><span className="envelope-seam envelope-seam--right" /></div>
                <span className="wax-seal wax-seal--name">{sealName(data.name)}</span>
                {[0, 1, 2, 3].map((particle) => <motion.i key={particle} className={`envelope-particle ep-${particle + 1}`} animate={opening ? { y: -90 - particle * 14, x: particle % 2 ? 32 : -30, opacity: [0, 1, 0], scale: [0, 1.2, .4] } : { opacity: 0 }} transition={{ duration: 1.1, delay: .35 + particle * .08 }}>✦</motion.i>)}
              </div>
              <motion.span className="envelope-hint" animate={{ opacity: [.62, 1, .62], y: [0, -2, 0] }} transition={{ duration: 2.2, repeat: Infinity }}>{opening ? "Öppnar…" : "Tryck för att öppna"}</motion.span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {template.layout === "storybook" && <div className="storybook-layers" aria-hidden="true"><motion.span animate={motionEnabled ? { y: playful ? [-18, 16, -18] : [-8, 8, -8] } : undefined} transition={{ duration: 7, repeat: Infinity }} /><motion.span animate={motionEnabled ? { y: playful ? [12, -20, 12] : [6, -6, 6] } : undefined} transition={{ duration: 9, repeat: Infinity }} /><i>Kapitel ett</i><b>Följ stigen</b></div>}
      {template.layout === "poster" && <div className="poster-graphics" aria-hidden="true"><span>JA!</span><i>{data.age || "WOW"}</i><b>✦ ✦ ✦</b></div>}
      {template.layout === "editorial" && <div className="editorial-rail" aria-hidden="true"><span>{data.kicker}</span><i>{formatDate(data.date)}</i></div>}
      {template.layout === "cinematic" && <div className="cinematic-sequence" aria-hidden="true"><span>01</span><span>02</span><span>03</span></div>}
      {template.layout === "celestial" && <div className="celestial-orbit" aria-hidden="true"><motion.span animate={motionEnabled ? { rotate: 360 } : undefined} transition={{ duration: playful ? 12 : 24, repeat: Infinity, ease: "linear" }}><i>✦</i><b>✧</b><em>✦</em></motion.span></div>}
      {template.layout === "vintage" && <div className="vintage-frame" aria-hidden="true"><span /><i /><b /></div>}
      {template.layout === "patisserie" && <div className="patisserie-awning" aria-hidden="true">{Array.from({ length: 7 }, (_, index) => <i key={index} />)}</div>}
      {template.layout === "deco" && <div className="deco-frame" aria-hidden="true"><span /><i /><b /></div>}
      {template.layout === "ticket" && <div className="ticket-stub" aria-hidden="true"><span>ADMIT ONE</span><i>№ 2027</i><b>✦</b></div>}
      {template.layout === "postcard" && !postcardFlipped && <div className="postcard-front"><div><p>Hälsningar från</p><h2>Citronlunden</h2><span>En kväll i solen</span></div><button type="button" onClick={() => setPostcardFlipped(true)}>Vänd vykortet <ChevronRight /></button></div>}

      <div className="invite-decoration" aria-hidden="true">
        {template.layout === "classic" && template.palette === "rose" && <>{motionEnabled && Array.from({ length: playful ? 6 : 3 }, (_, bloom) => <motion.span key={bloom} className={`background-bloom bb-${bloom + 1}`} animate={{ y: playful ? [-8, 10, -8] : [0, 0, 0], scale: playful ? [.82, 1.24, .82] : [.94, 1.08, .94], rotate: playful ? [-10, 12, -10] : [-3, 4, -3], opacity: [.18, playful ? .68 : .48, .18] }} transition={{ duration: (playful ? 3.6 : 5.5) + bloom * .45, repeat: Infinity, delay: bloom * .35 }}>✿</motion.span>)}<div className="ribbon-mark"><span /><b /><span /></div></>}
        {template.layout === "classic" && template.palette === "sand" && <><span className="sand-arch" />{motionEnabled && Array.from({ length: playful ? 6 : 4 }, (_, leaf) => <motion.span key={leaf} className={`sand-leaf sl-${leaf + 1}`} animate={{ y: playful ? [-11, 15, -11] : [-8, 11, -8], rotate: playful ? [-13, 12, -13] : [-7, 8, -7], scale: playful ? [.86, 1.14, .86] : [.96, 1.1, .96], opacity: [.28, playful ? .82 : .7, .28] }} transition={{ duration: (playful ? 3.8 : 4.7) + leaf * .38, repeat: Infinity, delay: leaf * .28 }} />)}</>}
        {template.layout === "classic" && template.palette === "midnight" && <><span className="invite-moon" />{motionEnabled && Array.from({ length: playful ? 9 : 5 }, (_, star) => <motion.span key={star} className={`gold-star gs-${star + 1}`} animate={{ y: playful ? [-4, 7, -4] : 0, opacity: [.12, 1, .12], scale: playful ? [.5, 1.7, .5] : [.65, 1.45, .65], rotate: [0, playful ? 150 : 80, 0] }} transition={{ duration: (playful ? 1.65 : 2.1) + star * .28, repeat: Infinity, delay: star * .22 }}>✦</motion.span>)}</>}
        {template.layout === "classic" && template.palette === "sky" && template.id === "olivkvist" && <>{motionEnabled && Array.from({ length: playful ? 6 : 5 }, (_, leaf) => <motion.span key={leaf} className={`olive-leaf ol-${leaf + 1}`} animate={{ y: playful ? [-8, 10, -8] : [-5, 7, -5], rotate: playful ? [-14, 15, -14] : [-8, 9, -8], scale: playful ? [.9, 1.16, .9] : [.94, 1.09, .94], opacity: [.3, playful ? .82 : .7, .3] }} transition={{ duration: (playful ? 3.5 : 4.8) + leaf * .42, repeat: Infinity, delay: leaf * .32 }}><i /><b /></motion.span>)}</>}
        {template.layout === "classic" && template.palette === "sky" && template.id !== "olivkvist" && <>{motionEnabled && <><motion.span className="invite-cloud c1" animate={{ x: playful ? [-75, 85, -75] : [-55, 65, -55], y: playful ? [-5, 8, -5] : 0 }} transition={{ duration: playful ? 8 : 12, repeat: Infinity }} /><motion.span className="invite-cloud c2" animate={{ x: playful ? [65, -75, 65] : [45, -55, 45], y: playful ? [6, -7, 6] : 0 }} transition={{ duration: playful ? 10 : 15, repeat: Infinity }} />{Array.from({ length: playful ? 7 : 3 }, (_, star) => <motion.span key={star} className={`sky-glint sg-${star + 1}`} animate={{ opacity: [.12, playful ? .9 : .48, .12], scale: playful ? [.65, 1.5, .65] : [.8, 1.15, .8], rotate: [0, playful ? 100 : 35, 0] }} transition={{ duration: (playful ? 2 : 3.8) + star * .35, repeat: Infinity, delay: star * .28 }}>✦</motion.span>)}</>}<span className="sky-star">✧</span></>}
        {template.layout === "storybook" && Array.from({ length: playful ? 9 : 5 }, (_, item) => <motion.span key={item} className={`theme-motion theme-motion--firefly tm-${item + 1}`} animate={motionEnabled ? { x: item % 2 ? [-6, 12, -6] : [8, -9, 8], y: [-8, 12, -8], opacity: [.2, 1, .2] } : undefined} transition={{ duration: (playful ? 2.3 : 4.4) + item * .3, repeat: Infinity, delay: item * .25 }} />)}
        {template.layout === "poster" && Array.from({ length: playful ? 12 : 7 }, (_, item) => <motion.span key={item} className={`theme-motion theme-motion--confetti tm-${item + 1}`} animate={motionEnabled ? { rotate: [0, 160, 320], x: item % 2 ? [-4, 10, -4] : [5, -7, 5], y: [-5, 9, -5] } : undefined} transition={{ duration: (playful ? 2 : 4) + item * .18, repeat: Infinity }} />)}
        {template.layout === "editorial" && <motion.span className="theme-motion theme-motion--editorial" animate={motionEnabled ? { scaleY: [.25, 1, .25], opacity: [.25, .8, .25] } : undefined} transition={{ duration: playful ? 2.2 : 4.8, repeat: Infinity }} />}
        {template.layout === "cinematic" && <motion.span className="theme-motion theme-motion--sunflare" animate={motionEnabled ? { x: [-18, 28, -18], opacity: [.18, .55, .18], scale: [.9, 1.12, .9] } : undefined} transition={{ duration: playful ? 5 : 10, repeat: Infinity }} />}
        {template.layout === "celestial" && Array.from({ length: playful ? 8 : 5 }, (_, item) => <motion.span key={item} className={`theme-motion theme-motion--moonstar tm-${item + 1}`} animate={motionEnabled ? { opacity: [.18, 1, .18], scale: [.7, 1.45, .7] } : undefined} transition={{ duration: (playful ? 1.8 : 3.5) + item * .25, repeat: Infinity, delay: item * .2 }}>✦</motion.span>)}
        {template.layout === "vintage" && Array.from({ length: playful ? 7 : 4 }, (_, item) => <motion.span key={item} className={`theme-motion theme-motion--dust tm-${item + 1}`} animate={motionEnabled ? { y: [-5, 9, -5], opacity: [.08, .55, .08] } : undefined} transition={{ duration: 4 + item * .45, repeat: Infinity }}>·</motion.span>)}
        {template.layout === "patisserie" && Array.from({ length: playful ? 7 : 4 }, (_, item) => <motion.span key={item} className={`theme-motion theme-motion--cherry tm-${item + 1}`} animate={motionEnabled ? { y: [-4, 7, -4], rotate: [-5, 8, -5] } : undefined} transition={{ duration: (playful ? 2.2 : 4.2) + item * .3, repeat: Infinity }}>●</motion.span>)}
        {template.layout === "deco" && Array.from({ length: playful ? 8 : 4 }, (_, item) => <motion.span key={item} className={`theme-motion theme-motion--deco tm-${item + 1}`} animate={motionEnabled ? { opacity: [.15, 1, .15], scale: [.65, 1.35, .65] } : undefined} transition={{ duration: (playful ? 1.5 : 3) + item * .2, repeat: Infinity }}>◆</motion.span>)}
        {template.layout === "ticket" && <motion.span className="theme-motion theme-motion--ticket" animate={motionEnabled ? { x: [-110, 330], opacity: [0, .55, 0] } : undefined} transition={{ duration: playful ? 3 : 6, repeat: Infinity, repeatDelay: 1 }} />}
        {template.layout === "postcard" && Array.from({ length: playful ? 6 : 3 }, (_, item) => <motion.span key={item} className={`theme-motion theme-motion--lemon tm-${item + 1}`} animate={motionEnabled ? { rotate: [-4, 7, -4], y: [-3, 6, -3] } : undefined} transition={{ duration: 4 + item * .5, repeat: Infinity }}>●</motion.span>)}
      </div>

      <div className="invite-content">
        <header className="invite-header">
          <p>{data.kicker}</p>
          <h1 className={data.name.length > 18 ? "long-name" : ""}>{data.name || "Ditt namn"}</h1>
          <h2>{data.subtitle}</h2>
        </header>

        <AnimatePresence mode="popLayout" initial={false}>
          {data.photoUrl && !photoIsBackground && <motion.div key="photo" layout className="invite-photo-slot" initial={{ opacity: 0, scale: .94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .94 }}><InvitationPhoto data={data} templateId={template.id} /></motion.div>}
          <motion.div key="details" layout className="invite-details">
            <p className="invite-date">{formatDate(data.date)}</p>
            <p><Clock3 size={14} /> {data.startTime || "14:00"}{data.endTime ? `–${data.endTime}` : ""}</p>
            <p><MapPin size={14} /> {data.address || "Platsen kommer snart"}</p>
          </motion.div>
          {enabled.includes("greeting") && data.greeting && <motion.p key="greeting" layout className="invite-greeting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{data.greeting}</motion.p>}
          {enabled.includes("countdown") && data.date && <motion.div key="countdown" layout initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .96 }}><Countdown date={data.date} label={data.countdownLabel} /></motion.div>}
          {actions.length > 0 && <motion.div layout key="actions" className={`invite-actions invite-actions--${actions.length}`}>
            {enabled.includes("rsvp") && rsvpMode === "form" && <motion.button type="button" layout key="rsvp" onClick={() => setRsvpOpen(true)}><MessageCircle /><span><small>Svara på en minut</small>Svara på inbjudan</span><ChevronRight /></motion.button>}
            {enabled.includes("rsvp") && rsvpMode === "sms" && <motion.a layout key="rsvp" href={interactive ? `sms:${data.phone}?&body=${encodeURIComponent(rsvpMessage(data.name))}` : undefined}><MessageCircle /><span><small>{data.rsvpHint}</small>{data.rsvpLabel}</span><ChevronRight /></motion.a>}
            {enabled.includes("map") && <motion.a layout key="map" target="_blank" rel="noreferrer" href={interactive ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address)}` : undefined}><MapPin /><span><small>{data.mapHint}</small>{data.mapLabel}</span><ChevronRight /></motion.a>}
            {enabled.includes("calendar") && <motion.a layout key="calendar" target="_blank" rel="noreferrer" href={interactive ? calendarUrl(data) : undefined}><CalendarPlus /><span><small>{data.calendarHint}</small>{data.calendarLabel}</span><ChevronRight /></motion.a>}
          </motion.div>}
        </AnimatePresence>
        <footer>{data.footerText}</footer>
        {template.layout === "postcard" && <button className="postcard-turn-back" type="button" onClick={() => setPostcardFlipped(false)}>Vänd till framsidan</button>}
      </div>
      {demoMark && <span className="demo-corner">DEMO<br />MINEA</span>}
      <RsvpForm open={rsvpOpen} onClose={() => setRsvpOpen(false)} invitationName={data.name} invitationToken={invitationToken} questions={rsvpQuestions} />
    </motion.article>
  );
}
