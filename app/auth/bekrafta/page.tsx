import type { Metadata } from "next";
import Link from "next/link";
import { AuthConfirm } from "@/components/auth-confirm";
import { BrandLogo } from "@/components/brand-logo";

export const metadata: Metadata = { title: "Säker inloggning", robots: { index: false, follow: false } };

export default function AuthConfirmPage() {
  return (
    <main className="auth-confirm-page">
      <Link className="auth-confirm-brand" href="/" aria-label="Minea Studio, startsida"><BrandLogo /></Link>
      <AuthConfirm />
    </main>
  );
}

