import type { MetadataRoute } from "next";
import { invitationCategories } from "@/lib/invitations";

const baseUrl = "https://mineastudio.se";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    ...invitationCategories.map((category) => ({ url: `${baseUrl}/kategori/${category.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: .9 })),
  ];
}
