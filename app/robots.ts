import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/studio/", "/i/"] }],
    sitemap: "https://mineastudio.se/sitemap.xml",
    host: "https://mineastudio.se",
  };
}
