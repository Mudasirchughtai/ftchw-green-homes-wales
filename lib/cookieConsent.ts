"use client";

const CONSENT_KEY = "ftchw_cookie_consent";
export type ConsentState = "granted" | "denied" | null;

export function getStoredConsent(): ConsentState {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(CONSENT_KEY);
  return raw === "granted" || raw === "denied" ? raw : null;
}

export function setStoredConsent(state: "granted" | "denied") {
  window.localStorage.setItem(CONSENT_KEY, state);
  window.dispatchEvent(new CustomEvent("ftchw-consent-change", { detail: state }));
}
