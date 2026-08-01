import type { MetadataRoute } from "next";
import { absoluteUrl, isIndexableEnvironment } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexableEnvironment()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
