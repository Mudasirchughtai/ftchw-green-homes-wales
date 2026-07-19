import type { Metadata } from "next";
import GreenHomesWalesPage from "@/app/green-homes-wales/page";

// CLAUDE.md -> "RECOMMENDED PAGE URL": alternative SEO route, same page.
export const metadata: Metadata = {
  title: "Heat Pump Grants Wales | Boiler Upgrade Scheme & Green Homes Wales",
  description:
    "Check whether your Welsh home may qualify for up to £9,000 towards an eligible heat pump, interest-free Green Homes Wales funding and expert retrofit support.",
};

export default function HeatPumpGrantsWalesPage() {
  return <GreenHomesWalesPage />;
}
