import { Reveal } from "@/components/animation/Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  heading: string;
  supporting?: string;
  align?: "left" | "center";
  dark?: boolean;
}

export function SectionHeading({ eyebrow, heading, supporting, align = "center", dark = false }: SectionHeadingProps) {
  return (
    <Reveal className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className={`text-sm font-semibold uppercase tracking-wide ${dark ? "text-gold-300" : "text-gold-600"}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`mt-2 text-2xl font-bold sm:text-3xl ${dark ? "text-white" : "text-brand-900"}`}>{heading}</h2>
      {supporting && (
        <p className={`mt-3 text-base ${dark ? "text-brand-100" : "text-ink-light"}`}>{supporting}</p>
      )}
    </Reveal>
  );
}
