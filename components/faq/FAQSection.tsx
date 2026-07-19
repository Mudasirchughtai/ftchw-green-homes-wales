import { SectionHeading } from "@/components/common/SectionHeading";
import { RevealGroup } from "@/components/animation/Reveal";
import { FAQAccordion } from "@/components/faq/FAQAccordion";
import { FAQS } from "@/components/faq/data";

export function FAQSection() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <section id="faqs" className="bg-cream-200 px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <SectionHeading eyebrow="Common Questions" heading="Frequently Asked Questions" />
        <RevealGroup>
          <FAQAccordion />
        </RevealGroup>
      </div>

      {/* eslint-disable-next-line react/no-danger -- static JSON-LD generated from FAQS above, no user input */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </section>
  );
}
