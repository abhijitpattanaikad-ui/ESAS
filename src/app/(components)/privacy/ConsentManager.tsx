"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CONSENT_COOKIE,
  DEFAULT_CONSENT,
  ConsentPreference,
  parseConsent,
  serializeConsent,
  shouldLoadAnalytics,
} from "@/lib/privacy/consent";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

const COOKIE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;

function readCookie(name: string): string | undefined {
  const prefix = `${name}=`;
  return document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))
    ?.slice(prefix.length);
}

function writeConsent(preference: ConsentPreference): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE}=${serializeConsent(preference)}; Max-Age=${COOKIE_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
}

export default function ConsentManager() {
  const pathname = usePathname();
  const [preference, setPreference] = useState<ConsentPreference>(DEFAULT_CONSENT);
  const [hasDecision, setHasDecision] = useState(false);
  const [isPanelOpen, setPanelOpen] = useState(false);
  const tagManagerId = process.env.NEXT_PUBLIC_GTM_ID;

  useEffect(() => {
    const stored = readCookie(CONSENT_COOKIE);
    setPreference(parseConsent(stored));
    setHasDecision(Boolean(stored));
  }, []);

  const analyticsEnabled = useMemo(
    () => shouldLoadAnalytics(preference, pathname, tagManagerId),
    [pathname, preference, tagManagerId],
  );

  useEffect(() => {
    if (!analyticsEnabled) return;
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  }, [analyticsEnabled]);

  function savePreference(analytics: boolean) {
    const nextPreference: ConsentPreference = { necessary: true, analytics, version: 1 };
    writeConsent(nextPreference);
    setPreference(nextPreference);
    setHasDecision(true);
    setPanelOpen(false);
  }

  const showPanel = !hasDecision || isPanelOpen;

  return (
    <>
      {analyticsEnabled && tagManagerId ? (
        <Script
          id="goezpz-tag-manager"
          src={`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(tagManagerId)}`}
          strategy="afterInteractive"
        />
      ) : null}

      {showPanel ? (
        <section
          aria-label="Privacy choices"
          className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-3xl rounded-2xl border border-white/15 bg-[#0c0a11]/95 p-5 shadow-2xl backdrop-blur-xl md:p-6"
        >
          <h2 className="heading-font text-lg font-bold uppercase tracking-wide text-white">
            Your privacy choices
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/70">
            GoEzPz uses essential cookies for secure account and tournament functions. Analytics stays off unless you choose to enable it. Sensitive sign-in, verification, and password-reset routes are excluded from analytics initialization. Read our{" "}
            <Link className="font-semibold text-jaffa-400 underline underline-offset-4" href="/privacy">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => savePreference(false)}
              className="min-h-11 rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jaffa-400"
            >
              Essential only
            </button>
            <button
              type="button"
              onClick={() => savePreference(true)}
              className="min-h-11 rounded-lg bg-jaffa-500 px-5 py-2.5 text-sm font-bold text-black transition hover:bg-jaffa-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jaffa-400"
            >
              Accept analytics
            </button>
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setPanelOpen(true)}
          className="fixed bottom-3 left-3 z-[90] rounded-full border border-white/15 bg-[#0c0a11]/90 px-3 py-2 text-xs font-semibold text-white/75 shadow-lg backdrop-blur transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jaffa-400"
        >
          Privacy choices
        </button>
      )}
    </>
  );
}
