"use client";

/**
 * PostHogProvider — client island that boots PostHog and emits manual SPA
 * pageviews. The root layout stays a server component; this wraps the body
 * content so every route change is captured. No-ops when the key is unset.
 */

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initPostHog, posthog } from "@/lib/posthog";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initPostHog();
  }, []);

  return (
    <>
      {children}
      <Suspense fallback={null}>
        <PageViews />
      </Suspense>
    </>
  );
}

function PageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initPostHog();
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
    posthog.capture("$pageview", { $current_url: window.location.href });
  }, [pathname, searchParams]);

  return null;
}
