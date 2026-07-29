import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://natega-thanawya-amma.vercel.app",
      lastModified: new Date("2026-07-29"),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
