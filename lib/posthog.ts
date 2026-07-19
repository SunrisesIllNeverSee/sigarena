/**
 * lib/posthog.ts — PostHog client init + event helpers.
 *
 * No-ops cleanly when NEXT_PUBLIC_POSTHOG_KEY is unset (local builds, before
 * the key lands in Cloudflare). Mirrors sigrank-app's "unset → no throw"
 * convention so analytics is purely additive.
 */

import posthog from "posthog-js";

let initialized = false;

/** Initialise PostHog in the browser. No-ops when the key is unset. */
export function initPostHog() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key || typeof window === "undefined" || initialized) return;
  initialized = true;
  posthog.init(key, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
    capture_pageview: false, // SPA pageviews sent manually in PostHogProvider
    capture_pageleave: true,
    persistence: "localStorage+cookie",
    capture_performance: false,
  });
}

export { posthog };

/**
 * Track a share button click. Properties identify which prompt + filter
 * combination was shared, so we can answer "which prompts + platforms get
 * shared most?" (Phase 4 item 30).
 */
export function trackShare(props: {
  prompt_slug: string;
  platform: string;
  view: string;
  category: string;
}) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  posthog.capture("share_clicked", props);
}
