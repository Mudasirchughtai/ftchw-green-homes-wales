"use client";

import { trackEvent } from "@/lib/analytics";
import { CONTACT_PHONE_HREF } from "@/config/contact";

interface PhoneCtaLinkProps {
  className?: string;
  children: React.ReactNode;
}

export function PhoneCtaLink({ className, children }: PhoneCtaLinkProps) {
  return (
    <a href={CONTACT_PHONE_HREF} className={className} onClick={() => trackEvent("phone_cta_click")}>
      {children}
    </a>
  );
}
