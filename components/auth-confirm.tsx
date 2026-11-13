"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LoaderCircle, ShieldCheck, TriangleAlert } from "lucide-react";

export function AuthConfirm() {
  const [state, setState] = useState<"loading" | "error">("loading");
  const [message, setMessage] = useState("Verifierar din säkra länk…");

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const accessToken = hash.get("access_token");
    const errorDescription = hash.get("error_description");
    if (!accessToken) {
      queueMicrotask(() => {
        setState("error");
        setMessage(errorDescription ? decodeURIComponent(errorDescription) : "Länken är ogiltig eller har gått ut.");
      });
      return;
    }

    void fetch("/api/auth/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ accessToken }),
    }).then(async (response) => {
      if (!response.ok) throw new Error((await response.json().catch(() => ({}))).error ?? "Inloggningen misslyckades.");
      window.history.replaceState(null, "", window.location.pathname);
      window.location.replace("/mina-inbjudningar");
    }).catch((error: Error) => {
      setState("error");
      setMessage(error.message);
    });
  }, []);

  return (
    <div className="auth-confirm-card">
      {state === "loading" ? <LoaderCircle className="auth-spinner" /> : <TriangleAlert />}
      <p className="eyebrow">Minea Studio</p>
      <h1>{state === "loading" ? "Ett ögonblick" : "Länken kunde inte öppnas"}</h1>
      <p>{message}</p>
      {state === "error" && <Link className="button button-dark" href="/mina-inbjudningar"><ShieldCheck /> Begär en ny länk</Link>}
    </div>
  );
}

