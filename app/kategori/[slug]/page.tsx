import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { InvitationRenderer } from "@/components/invitation-renderer";
import { invitationCategories, templates } from "@/lib/invitations";

const categoryDetails = Object.fromEntries(invitationCategories.map((category) => [category.slug, { name: category.name, intro: category.note, palette: category.palette }]));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categoryDetails[slug];
  if (!category) return {};
  const seoTitle = `${category.name} – digitala inbjudningar med OSA`;
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
          <div className="category-products-summary"><p>{items.length} {items.length === 1 ? "design" : "designer"} i kollektionen</p><span><Sparkles size={13} /> Alla designer är interaktiva och visas med samtliga funktioner</span></div>
        </div>
        <div className="product-grid category-product-grid">
          {items.map((template, index) => (
            <article className={`product-card product-card--collection product-card--category-${slug}`} key={template.id}>
              <div className="product-art">
                <span className="card-index">{String(index + 1).padStart(2, "0")}</span>
                <div className="product-invitation-preview"><InvitationRenderer template={template} data={template.defaultData} enabled={["rsvp", "map", "calendar", "countdown", "greeting"]} animation="soft" interactive={false} demoMark={false} rsvpMode="form" thumbnail /></div>
                <Link className="product-art-hit" href={`/studio/${template.id}`} aria-label={`Anpassa ${template.name}`} />
              </div>
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

export function generateStaticParams() {
  return invitationCategories.map((category) => ({ slug: category.slug }));
}
