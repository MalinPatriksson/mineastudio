"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function OrganizerShareLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="organizer-share-link">
      <span>{url.replace(/^https?:\/\//, "")}</span>
      <button type="button" onClick={copy} aria-label="Kopiera delningslänken">{copied ? <Check /> : <Copy />}</button>
    </div>
  );
}

