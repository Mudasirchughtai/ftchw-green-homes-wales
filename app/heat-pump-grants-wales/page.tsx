import type { Metadata } from "next";
import GreenHomesWalesPage from "@/app/green-homes-wales/page";
import { absoluteUrl } from "@/lib/site";

// CLAUDE.md -> "RECOMMENDED PAGE URL": alternative SEO route, same content.
// Canonical points at the primary /green-homes-wales URL to avoid this
// duplicate-content page competing with it in search results.
export const metadata: Metadata = {
  title: "Heat Pump Grants Wales | Boiler Upgrade Scheme & Green Homes Wales",
  description:
    "Check whether your Welsh home may qualify for up to £9,000 towards an eligible heat pump, interest-free Green Homes Wales funding and expert retrofit support.",
  alternates: { canonical: absoluteUrl("/green-homes-wales") },
};

export default function HeatPumpGrantsWalesPage() {
  return <GreenHomesWalesPage />;
}
