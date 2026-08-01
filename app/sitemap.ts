import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

const ROUTES = [
  "/green-homes-wales",
  "/heat-pump-grants-wales",
  "/privacy-policy",
  "/cookie-policy",
  "/terms-of-use",
  "/complaints-procedure",
  "/funding-and-grant-disclaimer",
  "/how-we-select-installers",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: route === "/green-homes-wales" ? "weekly" : "monthly",
    priority: route === "/green-homes-wales" ? 1 : 0.5,
  }));
}
