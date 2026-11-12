import type { MetadataRoute } from "next";

const baseUrl = "https://mineastudio.se";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/kategori/brollop`, lastModified: new Date(), changeFrequency: "monthly", priority: .9 },
    { url: `${baseUrl}/kategori/barnkalas`, lastModified: new Date(), changeFrequency: "monthly", priority: .9 },
    { url: `${baseUrl}/kategori/dop`, lastModified: new Date(), changeFrequency: "monthly", priority: .9 },
  ];
}
