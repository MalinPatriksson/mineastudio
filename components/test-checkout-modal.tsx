"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Check, CheckCircle2, Copy, Mail, ShoppingBag, X } from "lucide-react";
import type { AnimationStyle, Colorway, FeatureKey, InvitationData, InvitationTemplate, RsvpMode, RsvpQuestionConfig } from "@/lib/invitations";

type Props = {
  template: InvitationTemplate;
  data: InvitationData;
  enabled: FeatureKey[];
  animation: AnimationStyle;
  colorway: Colorway;
  rsvpMode: RsvpMode;
  rsvpQuestions: RsvpQuestionConfig;
  onClose: () => void;
};

type PurchaseResult = {
  invitationUrl: string;
  dashboardUrl: string;
  loginEmailSent: boolean;
};

export function TestCheckoutModal({ template, data, enabled, animation, colorway, rsvpMode, rsvpQuestions, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "error" | "success">("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<PurchaseResult | null>(null);
  const [copied, setCopied] = useState(false);
  const checkoutReference = useRef<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");
    checkoutReference.current ??= crypto.randomUUID();

    const response = await fetch("/api/purchase", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        checkoutReference: checkoutReference.current,
        email,
        templateId: template.id,
        data,
        enabled,
        animation,
        colorway,
        rsvpMode,
        rsvpQuestions,
        website: "",
      }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setState("error");
      setMessage(payload.error ?? "Testköpet kunde inte genomföras.");
      return;
    }
    setResult(payload as PurchaseResult);
    setState("success");
  }

  async function copyLink() {
    if (!result) return;
    await navigator.clipboard.writeText(result.invitationUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className={`checkout-modal checkout-modal--purchase ${state === "success" ? "checkout-modal--complete" : ""}`} initial={{ y: 30, scale: .98 }} animate={{ y: 0, scale: 1 }} exit={{ y: 20, opacity: 0 }} role="dialog" aria-modal="true" aria-labelledby="checkout-heading">
        <button className="modal-close" onClick={onClose} aria-label="Stäng"><X /></button>
        <span className="success-icon">{state === "success" ? <CheckCircle2 /> : <ShoppingBag />}</span>
        {state === "success" && result ? (
          <>
            <p className="eyebrow">Testköpet är klart</p>
            <h2 id="checkout-heading">Din inbjudan är live.</h2>
            <p>Den personliga länken är skapad utan vattenmärke och inbjudan finns nu under Mina inbjudningar.</p>
            <div className="share-link checkout-result-link"><span>{result.invitationUrl.replace(/^https?:\/\//, "")}</span><button type="button" onClick={copyLink}>{copied ? <Check /> : <Copy />}</button></div>
            <div className="checkout-complete-actions">
              <a className="button button-dark" href={result.invitationUrl}>Öppna inbjudan <ArrowRight /></a>
              <Link className="button checkout-dashboard-link" href="/mina-inbjudningar">Mina inbjudningar</Link>
            </div>
            <small><Mail /> {result.loginEmailSent ? `En säker inloggningslänk har skickats till ${email}.` : "Öppna Mina inbjudningar och begär en säker inloggningslänk."}</small>
          </>
        ) : (
          <>
            <p className="eyebrow">Testköp · ingen debitering</p>
            <h2 id="checkout-heading">Publicera din inbjudan</h2>
            <p>Inbjudan skapas direkt med en unik delningslänk och kopplas till din privata arrangörssida.</p>
            <div className="checkout-order-row"><div><span>{template.category}</span><strong>{template.name}</strong></div><b>{template.price} kr</b></div>
            <form className="checkout-purchase-form" onSubmit={submit}>
              <label><span>Mejladress för leverans</span><div><Mail /><input required type="email" autoComplete="email" placeholder="du@exempel.se" value={email} onChange={(event) => setEmail(event.target.value)} /></div></label>
              {state === "error" && <p className="checkout-error" role="alert">{message}</p>}
              <button className="button button-dark" type="submit" disabled={state === "submitting"}>{state === "submitting" ? "Publicerar…" : "Slutför testköpet"} <ArrowRight /></button>
            </form>
            <small><ShoppingBag /> Stripe kopplas in senare. Testköpet drar inga pengar.</small>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

