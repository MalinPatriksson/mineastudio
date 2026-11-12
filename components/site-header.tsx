import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BrandLogo } from "./brand-logo";

export function SiteHeader({ quiet = false }: { quiet?: boolean }) {
  return (
    <header className={`site-header ${quiet ? "site-header--quiet" : ""}`}>
      <Link className="brand" href="/" aria-label="Minea Studio, startsida">
        <BrandLogo />
      </Link>
      {!quiet && (
        <nav aria-label="Huvudmeny">
          <Link href="/#kollektion">Kollektion</Link>
          <Link href="/#sa-fungerar-det">Så fungerar det</Link>
          <Link className="nav-cta" href="/studio/rosendrom">
            Skapa din inbjudan <ArrowUpRight size={15} />
          </Link>
        </nav>
      )}
    </header>
  );
}
