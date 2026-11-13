"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Copy, Eye, ImagePlus, Monitor, Move, ShoppingBag, Smartphone, Sparkles, Trash2, X } from "lucide-react";
import type { AnimationStyle, Colorway, FeatureKey, InvitationData, InvitationTemplate, PhotoFrameStyle, PhotoShape, RsvpMode, RsvpQuestionConfig } from "@/lib/invitations";
import { colorwayOptions, defaultRsvpQuestions, featureLabels } from "@/lib/invitations";
import { InvitationRenderer } from "./invitation-renderer";
import { InvitationPhoto } from "./invitation-photo";
import { SiteHeader } from "./site-header";
import { AddressAutocomplete } from "./address-autocomplete";

type Props = { template: InvitationTemplate };

const featureKeys: FeatureKey[] = ["map", "calendar", "countdown", "greeting"];
const photoShapes: Array<{ id: PhotoShape; label: string }> = [{ id: "organic", label: "Mjuk" }, { id: "arch", label: "Valv" }, { id: "circle", label: "Rund" }];
const photoFrames: Array<{ id: PhotoFrameStyle; label: string }> = [{ id: "clean", label: "Ren" }, { id: "fade", label: "Mjuk fade" }, { id: "floral", label: "Dekorativ ram" }];

export function InvitationStudio({ template }: Props) {
  const [data, setData] = useState<InvitationData>(template.defaultData);
  const [enabled, setEnabled] = useState<FeatureKey[]>(template.recommended);
  const [animation, setAnimation] = useState<AnimationStyle>("soft");
  const [colorway, setColorway] = useState<Colorway>("signature");
  const [rsvpMode, setRsvpMode] = useState<RsvpMode>("form");
  const [rsvpQuestions, setRsvpQuestions] = useState<RsvpQuestionConfig>(defaultRsvpQuestions);
  const [fullPreview, setFullPreview] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("mobile");
  const photoDrag = useRef<{ clientX: number; clientY: number; positionX: number; positionY: number } | null>(null);
  const previewDrag = useRef<{ clientX: number; clientY: number; scrollLeft: number; scrollTop: number } | null>(null);
  const previewWasDragged = useRef(false);

  const required = [data.name, data.date, data.startTime, data.address, data.phone];
  const progress = Math.round((required.filter(Boolean).length / required.length) * 100);
  const photoIsBackground = template.layout === "cinematic";

  const update = <K extends keyof InvitationData>(key: K, value: InvitationData[K]) => setData((current) => ({ ...current, [key]: value }));
  const toggleFeature = (feature: FeatureKey) => setEnabled((current) => current.includes(feature) ? current.filter((item) => item !== feature) : [...current, feature]);
  const selectRsvpMode = (mode: RsvpMode) => {
    setRsvpMode(mode);
    setEnabled((current) => mode === "none" ? current.filter((item) => item !== "rsvp") : current.includes("rsvp") ? current : ["rsvp", ...current]);
  };
  const toggleRsvpQuestion = (question: keyof RsvpQuestionConfig) => setRsvpQuestions((current) => ({ ...current, [question]: !current[question] }));
  const addPhoto = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setData((current) => ({
      ...current,
      photoUrl: String(reader.result),
      photoPositionX: 50,
      photoPositionY: 50,
      photoShape: current.photoShape ?? "organic",
      photoFrame: current.photoFrame ?? "fade",
    }));
    reader.readAsDataURL(file);
  };
  const startPhotoDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    photoDrag.current = {
      clientX: event.clientX,
      clientY: event.clientY,
      positionX: data.photoPositionX ?? 50,
      positionY: data.photoPositionY ?? 50,
    };
  };
  const movePhoto = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = photoDrag.current;
    if (!drag) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const positionX = Math.max(0, Math.min(100, drag.positionX - ((event.clientX - drag.clientX) / bounds.width) * 100));
    const positionY = Math.max(0, Math.min(100, drag.positionY - ((event.clientY - drag.clientY) / bounds.height) * 100));
    setData((current) => ({ ...current, photoPositionX: positionX, photoPositionY: positionY }));
  };
  const stopPhotoDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    photoDrag.current = null;
  };
  const startPreviewDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    if (event.target instanceof Element && event.target.closest("button,a,input,textarea,select,label")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    previewWasDragged.current = false;
    previewDrag.current = { clientX: event.clientX, clientY: event.clientY, scrollLeft: event.currentTarget.scrollLeft, scrollTop: event.currentTarget.scrollTop };
  };
  const movePreview = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = previewDrag.current;
    if (!drag) return;
    const deltaX = event.clientX - drag.clientX;
    const deltaY = event.clientY - drag.clientY;
    if (Math.abs(deltaX) + Math.abs(deltaY) > 5) previewWasDragged.current = true;
    event.currentTarget.scrollLeft = drag.scrollLeft - deltaX;
    event.currentTarget.scrollTop = drag.scrollTop - deltaY;
  };
  const stopPreviewDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    previewDrag.current = null;
  };

  return (
    <main className="studio-page">
      <SiteHeader quiet />
      <div className="studio-topbar">
        <Link href="/" className="back-link"><ArrowLeft size={16} /> Till kollektionen</Link>
        <div className="studio-title"><span>{template.category}</span><strong>{template.name}</strong></div>
        <div className="studio-progress"><span>{progress}% klart</span><i><b style={{ width: `${progress}%` }} /></i></div>
      </div>

      <div className="studio-layout">
        <aside className="editor-panel">
          <div className="editor-intro"><p className="eyebrow">Gör den till din</p><h1>Din stund,<br /><em>dina ord.</em></h1><p>Vi tar hand om designen medan du fyller den med det som betyder något.</p></div>
          <section className="editor-section">
            <div className="editor-section-title"><span>01</span><div><h2>Berätta om stunden</h2><p>Texten uppdateras direkt i kortet.</p></div></div>
            <div className="field-grid">
              <label className="field field--wide">Namn<input value={data.name} maxLength={32} onChange={(event) => update("name", event.target.value)} /></label>
              <div className="photo-upload field--wide">
                <div>
                  <span className="photo-upload-icon"><ImagePlus size={19} /></span>
                  <span><b>{photoIsBackground ? "Egen bakgrundsbild" : "Egen bild"} <em>valfritt</em></b><small>{photoIsBackground ? "Bilden fyller hela inbjudan. Dra den för att välja exakt utsnitt." : "Välj form och finish, dra sedan fram precis rätt utsnitt."}</small></span>
                </div>
                {data.photoUrl ? (
                  <>
                    <div className="photo-uploaded"><span style={{ backgroundImage: `url(${data.photoUrl})`, backgroundPosition: `${data.photoPositionX ?? 50}% ${data.photoPositionY ?? 50}%` }} /><b>Justera bilden nedan</b><button type="button" aria-label="Ta bort bild" onClick={() => setData((current) => ({ ...current, photoUrl: undefined }))}><Trash2 size={15} /></button></div>
                    {photoIsBackground ? (
                      <div
                        className="cinematic-photo-editor"
                        onPointerDown={startPhotoDrag}
                        onPointerMove={movePhoto}
                        onPointerUp={stopPhotoDrag}
                        onPointerCancel={stopPhotoDrag}
                        style={{ backgroundImage: `linear-gradient(180deg,transparent 38%,rgba(27,17,11,.78)),url(${data.photoUrl})`, backgroundPosition: `center,${data.photoPositionX ?? 50}% ${data.photoPositionY ?? 50}%` }}
                      >
                        <span><small>{data.kicker}</small><b>{data.name}</b><em>{data.subtitle}</em></span>
                      </div>
                    ) : (
                      <div className={`photo-editor-theme invitation invitation--${template.palette} colorway--${colorway}`}>
                        <div
                          className="photo-editor-drag-target"
                          onPointerDown={startPhotoDrag}
                          onPointerMove={movePhoto}
                          onPointerUp={stopPhotoDrag}
                          onPointerCancel={stopPhotoDrag}
                        >
                          <InvitationPhoto data={data} templateId={template.id} className="invite-photo-wrap--editor" />
                        </div>
                      </div>
                    )}
                    <p className="photo-drag-hint"><Move size={13} /> Dra bilden för att välja exakt utsnitt</p>
                    {!photoIsBackground && <div className="photo-controls">
                      <div><small>Form</small><div className="photo-choice-row">{photoShapes.map((shape) => <button type="button" key={shape.id} className={(data.photoShape ?? "organic") === shape.id ? "active" : ""} aria-pressed={(data.photoShape ?? "organic") === shape.id} onClick={() => update("photoShape", shape.id)}>{shape.label}</button>)}</div></div>
                      <div><small>Finish</small><div className="photo-choice-row">{photoFrames.map((frame) => <button type="button" key={frame.id} className={(data.photoFrame ?? "fade") === frame.id ? "active" : ""} aria-pressed={(data.photoFrame ?? "fade") === frame.id} onClick={() => update("photoFrame", frame.id)}>{frame.label}</button>)}</div></div>
                    </div>}
                  </>
                ) : (
                  <label className="photo-upload-button">Välj bild<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => addPhoto(event.target.files?.[0])} /></label>
                )}
              </div>
              {template.category === "Barnkalas" && <label className="field">Ålder<input type="number" min="1" max="99" value={data.age} onChange={(event) => update("age", event.target.value)} /></label>}
              <label className="field">Datum<input type="date" value={data.date} onChange={(event) => update("date", event.target.value)} /></label>
              <label className="field">Starttid<input type="time" value={data.startTime} onChange={(event) => update("startTime", event.target.value)} /></label>
              <label className="field">Sluttid<input type="time" value={data.endTime} onChange={(event) => update("endTime", event.target.value)} /></label>
              <AddressAutocomplete value={data.address} onChange={(address) => update("address", address)} />
              <label className="field">Telefonnummer<input inputMode="tel" value={data.phone} onChange={(event) => update("phone", event.target.value)} /></label>
              <label className="field">Sista OSA-dag<input type="date" value={data.rsvpDate} onChange={(event) => update("rsvpDate", event.target.value)} /></label>
            </div>
            <div className="editable-copy">
              <p className="editable-copy-title"><Sparkles size={13} /> Din personliga text</p>
              <div className="field-grid">
                <label className="field field--wide">Överrubrik<input value={data.kicker} maxLength={48} onChange={(event) => update("kicker", event.target.value)} /></label>
                <label className="field field--wide">Underrubrik<input value={data.subtitle} maxLength={48} onChange={(event) => update("subtitle", event.target.value)} /></label>
                <label className="field field--wide">Personlig hälsning<textarea rows={3} maxLength={150} value={data.greeting} onChange={(event) => update("greeting", event.target.value)} /><small>{data.greeting.length}/150</small></label>
              </div>
              <p className="editable-copy-note">Knappar, nedräkning och avslutning är färdigformulerade för att alltid vara tydliga för gästen.</p>
            </div>
          </section>

          <section className="editor-section">
            <div className="editor-section-title"><span>02</span><div><h2>Välj funktioner</h2><p>Layouten balanseras automatiskt.</p></div></div>
            <div className="rsvp-settings">
              <div className="rsvp-settings-head"><div><b>Hur ska gästen svara?</b><small>OSA direkt samlar svaren på ett ställe.</small></div><em>Rekommenderad</em></div>
              <div className="rsvp-mode-options" role="radiogroup" aria-label="Välj OSA-sätt">
                {([{ id: "form", title: "Direkt i inbjudan", note: "Snyggt formulär" }, { id: "sms", title: "Via SMS", note: "Öppnar mobilen" }, { id: "none", title: "Ingen OSA", note: "Dölj svarsknappen" }] as const).map((option) => (
                  <button type="button" role="radio" aria-checked={rsvpMode === option.id} className={rsvpMode === option.id ? "active" : ""} key={option.id} onClick={() => selectRsvpMode(option.id)}><span aria-hidden="true" /><b>{option.title}</b><small>{option.note}</small></button>
                ))}
              </div>
              {rsvpMode === "form" && <div className="rsvp-question-options"><p>Frågor i formuläret</p>{([{ key: "partySize", label: "Antal personer" }, { key: "allergies", label: "Allergier & kost" }, { key: "message", label: "Meddelande" }] as const).map((question) => <label key={question.key}><input type="checkbox" checked={rsvpQuestions[question.key]} onChange={() => toggleRsvpQuestion(question.key)} /><span aria-hidden="true" />{question.label}</label>)}</div>}
            </div>
            <div className="feature-toggles">
              {featureKeys.map((feature) => {
                const active = enabled.includes(feature);
                return <button type="button" className={active ? "active" : ""} key={feature} aria-pressed={active} onClick={() => toggleFeature(feature)}><span className="toggle"><i /></span><span><b>{featureLabels[feature].title}</b><small>{featureLabels[feature].description}</small></span>{template.recommended.includes(feature) && <em>Rekommenderad</em>}</button>;
              })}
            </div>
          </section>

          <section className="editor-section">
            <div className="editor-section-title"><span>03</span><div><h2>Välj rörelse</h2><p>Stilla visar en färdig komposition utan pausade objekt.</p></div></div>
            <div className="animation-options">
              {([{ key: "none", title: "Stilla", symbol: "—" }, { key: "soft", title: "Mjuk", symbol: "∿" }, { key: "playful", title: "Lekfull", symbol: "✦" }] as const).map((option) => <button key={option.key} className={animation === option.key ? "active" : ""} onClick={() => setAnimation(option.key)}><i>{option.symbol}</i><span>{option.title}</span>{animation === option.key && <Check size={14} />}</button>)}
            </div>
          </section>

          <section className="editor-section">
            <div className="editor-section-title"><span>04</span><div><h2>Välj färgvärld</h2><p>Alla toner anpassas tillsammans av designen.</p></div></div>
            <div className="colorway-options">
              {colorwayOptions[template.palette].map((option) => (
                <button type="button" key={option.id} className={colorway === option.id ? "active" : ""} onClick={() => setColorway(option.id)} aria-pressed={colorway === option.id}>
                  <span className="colorway-swatches">{option.colors.map((color) => <i key={color} style={{ backgroundColor: color }} />)}</span>
                  <b>{option.name}</b>
                  {colorway === option.id && <Check size={14} />}
                </button>
              ))}
            </div>
            <p className="colorway-note"><Sparkles size={13} /> Illustration, text, knappar och kuvert färgmatchas automatiskt.</p>
          </section>
        </aside>

        <section className="preview-panel">
          <div className="preview-head"><div><span className="live-dot" />Liveförhandsvisning <em>· dra eller scrolla i kortet</em></div><button onClick={() => { setPreviewDevice("mobile"); setFullPreview(true); }}><Eye size={15} /> Förhandsvisa slutprodukten</button></div>
          <div className="preview-canvas"><div className="phone-frame drag-scroll-area" onPointerDown={startPreviewDrag} onPointerMove={movePreview} onPointerUp={stopPreviewDrag} onPointerCancel={stopPreviewDrag} onClickCapture={(event) => { if (previewWasDragged.current) { event.preventDefault(); event.stopPropagation(); previewWasDragged.current = false; } }}><div className="phone-speaker" /><InvitationRenderer template={template} data={data} enabled={enabled} animation={animation} colorway={colorway} interactive={false} rsvpMode={rsvpMode} rsvpQuestions={rsvpQuestions} /></div></div>
          <div className="preview-note"><Sparkles size={15} /><p><b>Designen anpassar sig.</b> Prova funktioner och färgvärldar. Vattenmärket finns bara i demon och tas bort helt från den betalda produkten.</p></div>
          <div className="buy-bar"><div><span>En inbjudan · ett evenemang</span><strong>{template.price} kr <del>79 kr</del></strong><small>Allt ingår · obegränsat antal gäster</small></div><button className="button button-dark" onClick={() => setCheckout(true)}>Fortsätt till köp <ArrowRight size={16} /></button></div>
        </section>
      </div>

      <AnimatePresence>
        {fullPreview && (
          <motion.div className="fullscreen-preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Förhandsvisning av inbjudan">
            <div className="fullscreen-bar">
              <span><i /> Demo · vattenmärket tas bort på den betalda produkten</span>
              <div className="device-toggle" role="group" aria-label="Välj förhandsvisningsstorlek">
                <button className={previewDevice === "desktop" ? "active" : ""} onClick={() => setPreviewDevice("desktop")}><Monitor /> Dator</button>
                <button className={previewDevice === "mobile" ? "active" : ""} onClick={() => setPreviewDevice("mobile")}><Smartphone /> Mobil</button>
              </div>
              <button onClick={() => setFullPreview(false)}><X /> Stäng</button>
            </div>
            <div className={`fullscreen-canvas fullscreen-canvas--${previewDevice}`} style={{ backgroundImage: `url(${template.artwork})` }}>
              <div className={`fullscreen-device fullscreen-device--${previewDevice} drag-scroll-area`} onPointerDown={startPreviewDrag} onPointerMove={movePreview} onPointerUp={stopPreviewDrag} onPointerCancel={stopPreviewDrag} onClickCapture={(event) => { if (previewWasDragged.current) { event.preventDefault(); event.stopPropagation(); previewWasDragged.current = false; } }}>
                {previewDevice === "mobile" && <div className="fullscreen-phone-speaker" />}
                <InvitationRenderer key={`${template.id}-${previewDevice}`} template={template} data={data} enabled={enabled} animation={animation} colorway={colorway} interactive envelope rsvpMode={rsvpMode} rsvpQuestions={rsvpQuestions} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {checkout && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><motion.div className="checkout-modal" initial={{ y: 30, scale: .98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, opacity: 0 }}><button className="modal-close" onClick={() => setCheckout(false)} aria-label="Stäng"><X /></button><span className="success-icon"><CheckCircle2 /></span><p className="eyebrow">Så levereras den</p><h2>Din personliga länk mejlas till dig.</h2><p>Efter betalning skapas en unik, svårgissad gästlänk utan vattenmärke. Ingen fil behöver laddas ner – du delar länken via SMS, mejl eller chatt och kan stänga den efter firandet.</p><div className="share-link"><span>minea.studio/i/din-personliga-länk</span><button onClick={async () => { await navigator.clipboard.writeText(`${location.origin}/i/${template.id}`); setCopied(true); }}>{copied ? <Check /> : <Copy />}</button></div><Link className="button button-dark" href={`/i/${template.id}`}>Öppna den vattenmärkta demon <ArrowRight /></Link><small><ShoppingBag size={13} /> Demoläget genomför ingen betalning.</small></motion.div></motion.div>}
      </AnimatePresence>
    </main>
  );
}
