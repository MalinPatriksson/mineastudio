"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowDown, ArrowRight, CalendarDays, Check, MapPin, MessageCircle, Sparkles } from "lucide-react";
import { invitationCategories, templateById, templates } from "@/lib/invitations";
import { SiteHeader } from "./site-header";
import { TemplateArt } from "./template-art";
import { BrandLogo } from "./brand-logo";

const heroOccasions = invitationCategories.slice(0, 3);

const marqueeCopy = <><span>Formgivet för stunden</span><i>✦</i><span>Personligt utan designkrångel</span><i>◇</i><span>En vacker länk att dela</span><i>✦</i><span>Allt ingår i ett fast pris</span><i>◇</i></>;

const seoFaqs = [
  { question: "Hur fungerar en digital inbjudan?", answer: "Välj en design, fyll i namn, datum och plats och dela sedan inbjudan som en personlig länk via SMS, mejl eller chatt." },
  { question: "Kan jag skapa en digital bröllopsinbjudan med OSA?", answer: "Ja. Bröllopsinbjudan kan innehålla OSA direkt i inbjudan eller via SMS, karta, kalenderlänk, personlig hälsning och en design som matchar era färger." },
  { question: "Vilka tillfällen finns det inbjudningar till?", answer: "Minea Studio har kollektioner för barnkalas, bröllop, dop och namngivning, babyshower, födelsedag och jubileum, student och examen samt fest och middag." },
  { question: "Behöver gästerna ladda ner en app?", answer: "Nej. Gästen öppnar den digitala inbjudan direkt i mobilen eller på datorn via länken du delar." },
];

export function HomePage() {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const featured = templateById[heroOccasions[featuredIndex].templateId];

  useEffect(() => {
    const rotation = window.setInterval(() => setFeaturedIndex((current) => (current + 1) % heroOccasions.length), 5200);
    return () => window.clearInterval(rotation);
  }, []);
  return (
    <main className="home">
      <SiteHeader />
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Interaktiva inbjudningar · Formgivna i Sverige</p>
          <h1>Små ögonblick.<br /><em>Stora minnen.</em></h1>
          <p className="hero-lead">Personliga, interaktiva inbjudningar som gör varje tillfälle lite mer magiskt.</p>
          <div className="hero-actions">
            <Link className="button button-dark" href="#kollektion">Hitta din inbjudan <ArrowRight size={17} /></Link>
            <Link className="text-link" href="/studio/rosendrom">Prova studion <span>↗</span></Link>
          </div>
        </div>
        <div className="hero-stage" aria-label="Utvalda digitala inbjudningar">
          <div className="hero-editorial">
            <span className={`hero-paper-swatch hero-paper-swatch--${featured.palette}`} />
            <AnimatePresence mode="wait">
              <motion.div key={featured.id} className="hero-feature-card" initial={{ opacity: 0, scale: .985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .35 }}>
                <TemplateArt template={featured} animated={false} />
                <Link className="live-pill" href={`/studio/${featured.id}`}><Sparkles size={12} /> Interaktiv demo</Link>
              </motion.div>
            </AnimatePresence>
            <div className="hero-counter">0{featuredIndex + 1}<span>/03</span></div>
          </div>
          <div className="hero-template-picker" role="group" aria-label="Välj tillfälle att förhandsvisa">
            {heroOccasions.map((occasion) => (
              <button key={occasion.slug} className={featuredIndex === heroOccasions.indexOf(occasion) ? "active" : ""} onClick={() => setFeaturedIndex(heroOccasions.indexOf(occasion))}>
                <span style={{ backgroundImage: `url(${templateById[occasion.templateId].artwork})` }} />
                <div><small>{occasion.number}</small><b>{occasion.name}</b></div>
              </button>
            ))}
          </div>
        </div>
        <a className="scroll-hint" href="#kollektion">Se kollektionen <ArrowDown size={14} /></a>
      </section>

      <section className="marquee" aria-label="Produktfördelar"><div className="marquee-track">{[0, 1, 2, 3].map((item) => <div className="marquee-set" aria-hidden={item > 0} key={item}>{marqueeCopy}</div>)}</div></section>

      <section className="collection section" id="kollektion">
        <div className="section-heading">
          <div><p className="eyebrow">Välj ditt tillfälle</p><h2>Var börjar<br /><em>er stund?</em></h2></div>
          <p>Börja med tillfället. Där hittar du alla inbjudningar som är formgivna just för den sortens firande.</p>
        </div>
        <div className="category-entry-grid">
          {invitationCategories.map((occasion) => (
            <Link href={`/kategori/${occasion.slug}`} key={occasion.slug} className={`category-entry category-entry--${occasion.slug}`}>
              <div className="category-entry-art" style={{ backgroundImage: `url(/category-heroes/${occasion.slug}.webp)` }} aria-hidden="true" />
              <div className="category-entry-copy"><span>{occasion.number}</span><p>{occasion.note}</p><h3>{occasion.name}</h3><i>Se alla designer <ArrowRight size={16} /></i></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="studio-feature section" id="sa-fungerar-det">
        <div className="studio-demo">
          <div className="demo-toolbar"><span /><span /><span /><small>Din inbjudan förändras medan du skapar</small></div>
          <div className="demo-body">
            <div className="demo-controls">
              <p className="eyebrow">Valbara detaljer</p>
              {["Personlig hälsning", "OSA via SMS", "Hitta hit", "Nedräkning"].map((item, i) => <div key={item}><span className={i < 3 ? "on" : ""} /><b>{item}</b></div>)}
            </div>
            <div className="demo-preview"><TemplateArt template={templates[0]} compact /><div className="mini-actions"><MessageCircle size={13} /><MapPin size={13} /><CalendarDays size={13} /></div></div>
          </div>
        </div>
        <div className="studio-copy">
          <p className="eyebrow">En designer i bakgrunden</p>
          <h2>Du väljer.<br /><em>Designen löser resten.</em></h2>
          <p>Fyll i det viktigaste och slå på de funktioner du vill ha. Layouten balanseras automatiskt, så att inbjudan alltid ser genomarbetad ut.</p>
          <ol><li><span>01</span> Välj en design</li><li><span>02</span> Gör den personlig</li><li><span>03</span> Dela en magisk länk</li></ol>
          <Link className="button button-light" href="/studio/rosendrom">Testa live-studion <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className="feature-strip section">
        <div><MessageCircle /><h3>OSA utan krångel</h3><p>Ett färdigt sms, bara att skicka.</p></div>
        <div><MapPin /><h3>Vägen dit</h3><p>Rätt adress, direkt i kartan.</p></div>
        <div><CalendarDays /><h3>Glöm aldrig datumet</h3><p>En knapp lägger allt i kalendern.</p></div>
        <div><Sparkles /><h3>Levande detaljer</h3><p>Mjuka rörelser som passar stunden.</p></div>
      </section>

      <section className="simple-pricing section" aria-labelledby="pris">
        <div><p className="eyebrow">Ett enkelt pris</p><h2 id="pris"><strong>59 kr</strong> <del>79 kr</del><br /><em>per evenemang.</em></h2><p>En betalning gäller en personlig inbjudan till ett evenemang. Ett nytt evenemang kräver ett nytt köp.</p></div>
        <ul>
          {["Alla designer, färger och animationer", "OSA direkt eller via SMS", "Gästhantering och obegränsat antal gäster", "Karta, kalender och personlig bild", "Redigering efter köp", "Tillgänglig till 90 dagar efter evenemanget"].map((item) => <li key={item}><Check /> {item}</li>)}
        </ul>
      </section>

      <section className="seo-section section" aria-labelledby="digitala-inbjudningar">
        <div className="seo-intro">
          <p className="eyebrow">Digitala inbjudningskort</p>
          <h2 id="digitala-inbjudningar">En personlig digital inbjudan<br /><em>som är enkel att dela.</em></h2>
          <p>Skapa en digital inbjudan till bröllop, barnkalas, dop, babyshower, student, jubileum eller middag. Välj en upplevelse, anpassa text, färger och funktioner och dela en vacker länk – utan app för gästen.</p>
          <div className="seo-keywords" aria-label="Tillfällen">{invitationCategories.map((category) => <Link key={category.slug} href={`/kategori/${category.slug}`}>{category.name}</Link>)}</div>
        </div>
        <div className="faq-list">
          {seoFaqs.map((item) => <details key={item.question}><summary>{item.question}<span>+</span></summary><p>{item.answer}</p></details>)}
        </div>
      </section>

      <footer>
        <div className="footer-main"><div><Link className="brand brand--footer" href="/" aria-label="Minea Studio, startsida"><BrandLogo /></Link><h2>Gör nästa stund<br /><em>lite mer magisk.</em></h2></div><Link className="round-link" href="/studio/rosendrom"><ArrowRight size={26} /><span>Börja skapa</span></Link></div>
        <div className="footer-bottom"><span>© 2026 Minea Studio</span><span>Digitala inbjudningar, formgivna med omtanke.</span><a href="mailto:hej@mineastudio.se">hej@mineastudio.se</a></div>
      </footer>
    </main>
  );
}
