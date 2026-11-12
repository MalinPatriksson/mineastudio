"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Check, Copy, Heart, Users, X } from "lucide-react";
import type { RsvpQuestionConfig } from "@/lib/invitations";

type RsvpFormProps = {
  open: boolean;
  onClose: () => void;
  invitationName: string;
  invitationToken?: string;
  questions: RsvpQuestionConfig;
};

type Attendance = "yes" | "no";
type SubmitState = "idle" | "submitting" | "success" | "preview" | "error";

export function RsvpForm({ open, onClose, invitationName, invitationToken, questions }: RsvpFormProps) {
  const [guestName, setGuestName] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("yes");
  const [partySize, setPartySize] = useState(1);
  const [allergies, setAllergies] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [editToken, setEditToken] = useState<string>();
  const [editUrl, setEditUrl] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [feedback, setFeedback] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open || !invitationToken) return;
    const urlToken = new URLSearchParams(window.location.hash.replace(/^#/, "")).get("rsvp");
    const storedToken = window.localStorage.getItem(`minea-rsvp-${invitationToken}`);
    const token = urlToken ?? storedToken;
    if (!token) return;

    const controller = new AbortController();
    void fetch("/api/rsvp", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ invitationToken, editToken: token }),
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) return;
        const result = await response.json() as { response: { guest_name: string; attendance: Attendance; party_size: number; allergies: string | null; message: string | null } };
        setGuestName(result.response.guest_name);
        setAttendance(result.response.attendance);
        setPartySize(result.response.party_size);
        setAllergies(result.response.allergies ?? "");
        setMessage(result.response.message ?? "");
        setEditToken(token);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [invitationToken, open]);

  if (!open) return null;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCopied(false);
    if (!invitationToken) {
      setSubmitState("preview");
      setFeedback("Det här är en förhandsvisning. Inget OSA-svar har sparats.");
      return;
    }

    setSubmitState("submitting");
    setFeedback("");
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ invitationToken, editToken, guestName, attendance, partySize, allergies, message, website }),
      });
      const result = await response.json() as { error?: string; editToken?: string; editUrl?: string; message?: string };
      if (!response.ok || !result.editToken || !result.editUrl) throw new Error(result.error ?? "Svaret kunde inte sparas.");

      window.localStorage.setItem(`minea-rsvp-${invitationToken}`, result.editToken);
      setEditToken(result.editToken);
      setEditUrl(`${window.location.origin}${result.editUrl}`);
      setFeedback(result.message ?? "Tack! Ditt svar är registrerat.");
      setSubmitState("success");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Något gick fel. Försök igen.");
      setSubmitState("error");
    }
  };

  const showConfirmation = submitState === "success" || submitState === "preview";

  return (
    <div className="rsvp-overlay" role="dialog" aria-modal="true" aria-labelledby="rsvp-title">
      <button className="rsvp-close" type="button" onClick={onClose} aria-label="Stäng OSA-formuläret"><X /></button>
      {showConfirmation ? (
        <div className="rsvp-confirmation" aria-live="polite">
          <span><Check /></span>
          <p className="eyebrow">{submitState === "preview" ? "Förhandsvisning" : "Svar mottaget"}</p>
          <h2>{submitState === "preview" ? "Så här ser bekräftelsen ut." : `Tack, ${guestName}!`}</h2>
          <p>{feedback}</p>
          {editUrl && (
            <div className="rsvp-edit-link">
              <small>Spara din personliga ändringslänk</small>
              <button type="button" onClick={async () => { await navigator.clipboard.writeText(editUrl); setCopied(true); }}>
                {copied ? <Check /> : <Copy />} {copied ? "Kopierad" : "Kopiera länk"}
              </button>
            </div>
          )}
          {submitState === "success" && <button className="rsvp-secondary" type="button" onClick={() => setSubmitState("idle")}>Ändra mitt svar</button>}
          <button className="button button-dark" type="button" onClick={onClose}>Tillbaka till inbjudan</button>
        </div>
      ) : (
        <form className="rsvp-form" onSubmit={submit}>
          <div className="rsvp-form-heading">
            <span><Heart /></span>
            <p className="eyebrow">OSA direkt</p>
            <h2 id="rsvp-title">Kan du komma?</h2>
            <p>Svara på inbjudan till {invitationName}. Det tar bara en minut.</p>
          </div>

          <label>Gästens namn<input required minLength={2} maxLength={100} value={guestName} onChange={(event) => setGuestName(event.target.value)} autoComplete="name" /></label>
          <fieldset>
            <legend>Jag…</legend>
            <div className="rsvp-attendance">
              <button type="button" className={attendance === "yes" ? "active" : ""} aria-pressed={attendance === "yes"} onClick={() => setAttendance("yes")}><Check /> Kommer gärna</button>
              <button type="button" className={attendance === "no" ? "active" : ""} aria-pressed={attendance === "no"} onClick={() => setAttendance("no")}><X /> Kan inte komma</button>
            </div>
          </fieldset>
          {questions.partySize && attendance === "yes" && <label>Antal personer, inklusive dig<div className="rsvp-number"><Users /><input type="number" min={1} max={20} value={partySize} onChange={(event) => setPartySize(Math.max(1, Number(event.target.value)))} /></div></label>}
          {questions.allergies && <label>Allergier eller kostönskemål<textarea maxLength={500} rows={3} value={allergies} onChange={(event) => setAllergies(event.target.value)} placeholder="Valfritt" /></label>}
          {questions.message && <label>Meddelande till arrangören<textarea maxLength={1000} rows={3} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Valfritt" /></label>}
          <label className="rsvp-honeypot" aria-hidden="true">Webbplats<input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} /></label>
          {submitState === "error" && <p className="rsvp-error" role="alert">{feedback}</p>}
          <button className="button button-dark rsvp-submit" type="submit" disabled={submitState === "submitting"}>{submitState === "submitting" ? "Skickar…" : editToken ? "Uppdatera mitt svar" : "Skicka mitt svar"}</button>
          <small className="rsvp-privacy">Svaret delas bara med arrangören och lagras enligt Mineas integritetspolicy.</small>
        </form>
      )}
    </div>
  );
}

