"use client";

import type { AttributionData } from "@/lib/types";

const STORAGE_KEY = "ftchw_attribution";

/**
 * Captures UTM/click-id params on first landing and persists them in
 * sessionStorage so they survive the multi-step form even if the query
 * string is dropped on later navigations, per CLAUDE.md -> "Preserve
 * attribution across the multi-step form."
 */
export function captureAttribution(): AttributionData {
  if (typeof window === "undefined") {
    return emptyAttribution();
  }

  const existing = window.sessionStorage.getItem(STORAGE_KEY);
  if (existing) {
    try {
      return JSON.parse(existing) as AttributionData;
    } catch {
      // fall through and re-capture
    }
  }

  const params = new URLSearchParams(window.location.search);
  const attribution: AttributionData = {
    pageUrl: window.location.href,
    referrer: document.referrer || "",
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
    utmContent: params.get("utm_content"),
    utmTerm: params.get("utm_term"),
    fbclid: params.get("fbclid"),
    gclid: params.get("gclid"),
  };

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  return attribution;
}

function emptyAttribution(): AttributionData {
  return {
    pageUrl: "",
    referrer: "",
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
    utmContent: null,
    utmTerm: null,
    fbclid: null,
    gclid: null,
  };
}
