import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MotionProvider } from "@/components/animation/MotionProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: "Heat Pump Grants and Green Homes Wales Funding | First Time Central Heating Wales",
  description:
    "Check whether your Welsh home may qualify for up to £9,000 towards an eligible heat pump, interest-free Green Homes Wales funding and expert retrofit support.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={inter.variable}>
      <body className="font-sans antialiased">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
