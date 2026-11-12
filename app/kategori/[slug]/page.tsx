import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { TemplateArt } from "@/components/template-art";
import { templates } from "@/lib/invitations";

const categoryDetails: Record<string, { name: string; intro: string; palette: "rose" | "sand" | "midnight" | "sky" }> = {
  barnkalas: { name: "Barnkalas", intro: "Lekfulla små världar för födelsedagar som får kännas precis så stora som de är.", palette: "rose" },
  brollop: { name: "Bröllop", intro: "Mjuka, professionella inbjudningar formgivna som den vackra början på er stora dag.", palette: "sand" },
  dop: { name: "Dop & namngivning", intro: "Varsamma, ljusa uttryck för en dag fylld av närhet och nya minnen.", palette: "sky" },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryDetails[slug];
  if (!category) return {};
  const seoTitle = slug === "brollop" ? "Digital bröllopsinbjudan med OSA" : slug === "barnkalas" ? "Digitala inbjudningskort till barnkalas" : "Digital dopinbjudan & inbjudan till namngivning";
  return {
    title: seoTitle,
    description: `${category.intro} Välj en mall, anpassa text och färger och dela din digitala inbjudan via SMS-länk.`,
    alternates: { canonical: `/kategori/${slug}` },
    openGraph: { title: seoTitle, description: category.intro, url: `/kategori/${slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categoryDetails[slug];
  if (!category) notFound();

  const items = templates.filter((template) => template.categorySlug === slug);

  return (
    <main className={`category-page category-page--${category.palette}`}>
      <SiteHeader />
      <section className="category-hero">
        <Link href="/#kollektion"><ArrowLeft size={15} /> Alla kategorier</Link>
        <p className="eyebrow">Kollektionen</p>
        <h1>{category.name}</h1>
        <p>{category.intro}</p>
      </section>
      <section className="category-products">
        <div className="category-products-head">
          <div><p className="eyebrow">Välj en design</p><h2>Hitta känslan som<br /><em>är alldeles er.</em></h2></div>
          <p>{items.length} {items.length === 1 ? "design" : "designer"} i kollektionen</p>
        </div>
        <div className="product-grid category-product-grid">
          {items.map((template, index) => (
            <article className={`product-card product-card--${template.palette}`} key={template.id}>
              <Link className={`product-art product-art--${template.palette}`} href={`/studio/${template.id}`} aria-label={`Anpassa ${template.name}`}>
                <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
                <TemplateArt template={template} animated={false} />
                <span className="card-badge"><Sparkles size={12} /> Interaktiv</span>
              </Link>
              <div className="product-info">
                <div><p>{template.category}</p><h3>{template.name}</h3></div>
                <div className="product-price">{template.price} kr<small>engångspris</small></div>
              </div>
              <Link className="product-link" href={`/studio/${template.id}`}>Anpassa inbjudan <ArrowRight size={16} /></Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
