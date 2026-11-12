import { HomePage } from "@/components/home-page";

export default function Page() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": "https://mineastudio.se/#organization", name: "Minea Studio", url: "https://mineastudio.se", email: "hej@mineastudio.se" },
      { "@type": "WebSite", "@id": "https://mineastudio.se/#website", url: "https://mineastudio.se", name: "Minea Studio", inLanguage: "sv-SE", publisher: { "@id": "https://mineastudio.se/#organization" } },
      { "@type": "Service", name: "Personliga digitala inbjudningar", provider: { "@id": "https://mineastudio.se/#organization" }, areaServed: "SE", offers: { "@type": "AggregateOffer", priceCurrency: "SEK", lowPrice: "39", highPrice: "49", offerCount: "6" }, serviceType: "Digitala inbjudningskort för bröllop, barnkalas, dop och namngivning" },
      { "@type": "FAQPage", mainEntity: [
        { "@type": "Question", name: "Hur fungerar en digital inbjudan?", acceptedAnswer: { "@type": "Answer", text: "Välj en design, fyll i namn, datum och plats och dela sedan inbjudan som en personlig länk via SMS, mejl eller chatt." } },
        { "@type": "Question", name: "Kan jag skapa en digital bröllopsinbjudan med OSA?", acceptedAnswer: { "@type": "Answer", text: "Ja. Bröllopsinbjudan kan innehålla OSA via SMS, karta, kalenderlänk, personlig hälsning och en design som matchar era färger." } },
        { "@type": "Question", name: "Behöver gästerna ladda ner en app?", acceptedAnswer: { "@type": "Answer", text: "Nej. Gästen öppnar den digitala inbjudan direkt i mobilen eller på datorn via länken du delar." } }
      ] }
    ]
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><HomePage /></>;
}
