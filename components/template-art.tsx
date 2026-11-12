"use client";

import { motion } from "motion/react";
import type { InvitationTemplate } from "@/lib/invitations";

const shortDate = (value: string) => {
  if (!value) return "Datum kommer";
  return new Intl.DateTimeFormat("sv-SE", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value}T12:00:00`));
};

export function TemplateArt({ template, compact = false, animated = true }: { template: InvitationTemplate; compact?: boolean; animated?: boolean }) {
  const data = template.defaultData;
  const classes = `template-art ${template.palette}-art template-art--${template.layout} ${compact ? "template-art--compact" : ""}`;

  if (template.palette === "sand") {
    return (
      <div className={classes}>
        <div className="art-world" style={{ backgroundImage: `url(${template.artwork})` }} />
        <div className="art-kicker">{data.kicker}</div>
        <div className="art-title">{data.name}</div>
        <div className="art-subtitle">{data.subtitle}</div>
        <motion.span className="sand-line sand-line-one" animate={animated ? { opacity: [.25, .7, .25], scaleX: [.9, 1.04, .9] } : undefined} transition={{ duration: 5.5, repeat: Infinity }} />
        <div className="art-date">{shortDate(data.date)}</div>
      </div>
    );
  }

  if (template.palette === "midnight") {
    return (
      <div className={classes}>
        <div className="art-world" style={{ backgroundImage: `url(${template.artwork})` }} />
        <motion.span className="celestial-glow" animate={animated ? { opacity: [.35, .88, .35], scale: [.9, 1.1, .9] } : undefined} transition={{ duration: 3.8, repeat: Infinity }} />
        <motion.span className="art-twinkle twinkle-one" animate={animated ? { opacity: [.15, 1, .15], rotate: [0, 40, 0] } : undefined} transition={{ duration: 2.4, repeat: Infinity }}>✦</motion.span>
        <motion.span className="art-twinkle twinkle-two" animate={animated ? { opacity: [1, .2, 1], scale: [.7, 1.4, .7] } : undefined} transition={{ duration: 3.1, repeat: Infinity }}>✧</motion.span>
        <div className="art-kicker">{data.kicker}</div>
        <div className="art-title">{data.name}</div>
        <div className="art-rule" />
        <div className="art-date">{shortDate(data.date)}</div>
      </div>
    );
  }

  if (template.palette === "sky") {
    const botanical = template.id === "olivkvist";
    return (
      <div className={classes}>
        <div className="art-world" style={{ backgroundImage: `url(${template.artwork})` }} />
        {botanical ? (
          <motion.span className="botanical-float" animate={animated ? { y: [-4, 8, -4], rotate: [-2, 2, -2] } : undefined} transition={{ duration: 7, repeat: Infinity }}>❧</motion.span>
        ) : (
          <>
            <motion.span className="drifting-cloud dc-one" animate={animated ? { x: [-35, 55, -35], opacity: [.12, .42, .12] } : undefined} transition={{ duration: 12, repeat: Infinity }} />
            <motion.span className="drifting-cloud dc-two" animate={animated ? { x: [40, -45, 40], opacity: [.08, .35, .08] } : undefined} transition={{ duration: 15, repeat: Infinity }} />
            <motion.span className="art-twinkle sky-twinkle" animate={animated ? { opacity: [.2, 1, .2], scale: [.8, 1.4, .8] } : undefined} transition={{ duration: 2.8, repeat: Infinity }}>✦</motion.span>
          </>
        )}
        <div className="art-kicker">{data.kicker}</div>
        <div className="art-title">{data.name}<br /><i>{data.subtitle}</i></div>
        <div className="art-rule" />
        <div className="art-date">{shortDate(data.date)}</div>
      </div>
    );
  }

  return (
    <div className={classes}>
      <div className="art-world" style={{ backgroundImage: `url(${template.artwork})` }} />
      {[0, 1, 2].map((bloom) => <motion.span key={bloom} className={`art-bloom ab-${bloom + 1}`} animate={animated ? { scale: [.94, 1.08, .94], rotate: [-2, 3, -2], opacity: [.3, .62, .3] } : undefined} transition={{ duration: 5.8 + bloom, repeat: Infinity, delay: bloom * .7 }}>✿</motion.span>)}
      <motion.span className="rose-sparkle" animate={animated ? { scale: [.6, 1.5, .6], opacity: [.2, 1, .2], rotate: [0, 90, 0] } : undefined} transition={{ duration: 2.3, repeat: Infinity }}>✦</motion.span>
      <div className="art-kicker">{data.kicker}</div>
      <div className="art-title">{data.name}</div>
      <div className="art-subtitle">{data.subtitle}</div>
      <div className="art-date">{shortDate(data.date)} · {data.startTime}</div>
    </div>
  );
}
