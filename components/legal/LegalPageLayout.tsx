import { Header } from "@/components/layout/Header";
import { TopInfoBar } from "@/components/layout/TopInfoBar";
import { MainDisclaimer } from "@/components/layout/MainDisclaimer";
import { Footer } from "@/components/layout/Footer";

interface LegalPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  return (
    <div>
      <TopInfoBar />
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold text-brand-900">{title}</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink-light [&_a]:text-brand-700 [&_a]:underline">
          {children}
        </div>
      </main>
      <MainDisclaimer />
      <Footer />
    </div>
  );
}
