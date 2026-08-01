"use client";

import { useEffect, useId, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: { sitekey: string; callback: (token: string) => void }) => void;
    };
  }
}

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
}

/**
 * Renders nothing if NEXT_PUBLIC_TURNSTILE_SITE_KEY isn't set -- the form
 * still works without it (server-side verification skips the check too,
 * see lib/turnstile.ts), but this is a real anti-bot gap until the key is
 * configured. Flagged as a deployment blocker.
 */
export function TurnstileWidget({ onVerify }: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!siteKey || !containerRef.current || !window.turnstile) return;
    window.turnstile.render(containerRef.current, { sitekey: siteKey, callback: onVerify });
  }, [siteKey, onVerify]);

  if (!siteKey) return null;

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer strategy="lazyOnload" />
      <div ref={containerRef} id={`turnstile-${id}`} className="mt-3" />
    </>
  );
}
