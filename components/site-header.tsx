import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";
import { BrandLogo } from "./brand-logo";
import { invitationCategories } from "@/lib/invitations";

export function SiteHeader({ quiet = false }: { quiet?: boolean }) {
  return (
    <header className={`site-header ${quiet ? "site-header--quiet" : ""}`}>
      <Link className="brand" href="/" aria-label="Minea Studio, startsida">
        <BrandLogo />
      </Link>
      {!quiet && (
        <>
          <nav aria-label="Huvudmeny">
            <details className="collection-menu">
              <summary>Alla tillfällen</summary>
              <div>{invitationCategories.map((category) => <Link key={category.slug} href={`/kategori/${category.slug}`}>{category.name}</Link>)}</div>
            </details>
            <Link href="/#sa-fungerar-det">Så fungerar det</Link>
            <Link href="/mina-inbjudningar">Mina inbjudningar</Link>
            <Link className="nav-cta" href="/studio/rosendrom">
              Skapa din inbjudan <ArrowUpRight size={15} />
            </Link>
          </nav>
          <details className="mobile-menu">
            <summary aria-label="Öppna meny"><Menu size={21} /> Meny</summary>
            <div>
              {invitationCategories.map((category) => <Link key={category.slug} href={`/kategori/${category.slug}`}>{category.name}</Link>)}
              <Link href="/#sa-fungerar-det">Så fungerar det</Link>
              <Link href="/mina-inbjudningar">Mina inbjudningar</Link>
              <Link href="/studio/rosendrom">Börja skapa <ArrowUpRight size={15} /></Link>
            </div>
          </details>
        </>
      )}
    </header>
  );
}
