"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, Mail, ShieldCheck } from "lucide-react";

export function OrganizerLogin({ configured }: { configured: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("sending");
    const response = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setState("error");
      setMessage(result.error ?? "Länken kunde inte skickas just nu.");
      return;
    }
    setState("sent");
  }

  if (state === "sent") {
    return (
      <div className="organizer-login-card organizer-login-card--sent">
        <span className="organizer-login-icon"><CheckCircle2 /></span>
        <p className="eyebrow">Kontrollera din inkorg</p>
        <h2>Din privata länk är på väg.</h2>
        <p>Vi har skickat en säker inloggningslänk till <strong>{email}</strong>. Länken tar dig tillbaka till dina inbjudningar.</p>
        <button type="button" onClick={() => setState("idle")}>Använd en annan mejladress</button>
      </div>
    );
  }

  return (
    <form className="organizer-login-card" onSubmit={submit}>
      <span className="organizer-login-icon"><ShieldCheck /></span>
      <p className="eyebrow">Privat arrangörssida</p>
      <h2>Öppna dina inbjudningar</h2>
      <p>Använd samma mejladress som vid köpet. Du får en säker länk och behöver inget lösenord.</p>
      <label>
        <span>Mejladress</span>
        <div><Mail /><input required type="email" autoComplete="email" placeholder="du@exempel.se" value={email} onChange={(event) => setEmail(event.target.value)} /></div>
      </label>
      {state === "error" && <p className="organizer-login-error" role="alert">{message}</p>}
      {!configured && <p className="organizer-login-error" role="alert">Inloggningen väntar på serverkonfiguration.</p>}
      <button className="button button-dark" type="submit" disabled={!configured || state === "sending"}>
        {state === "sending" ? "Skickar…" : "Skicka säker länk"} <ArrowRight />
      </button>
      <small>Av säkerhetsskäl visar vi inte om en mejladress finns registrerad.</small>
    </form>
  );
}

