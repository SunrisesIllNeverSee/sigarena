/**
 * ShareBar — "Share on X" button using the prompt's tweet_template.
 *
 * Builds a twitter.com/intent/tweet URL from the template (with {url}
 * replaced by the canonical page URL) and opens it in a new tab.
 * Tracks the share click via PostHog (no-ops when key is unset).
 */

"use client";

import { Share2 } from "lucide-react";
import { trackShare } from "@/lib/posthog";

interface ShareBarProps {
  /** Tweet template with {url} placeholder, from the Prompt registry. */
  tweetTemplate: string;
  /** Canonical URL for this page (e.g. https://signaaf.com/best-ai-user). */
  url: string;
  /** Prompt slug for analytics (e.g. "best-ai-user"). */
  promptSlug: string;
  /** Active platform filter for analytics (e.g. "all", "claude"). */
  platform: string;
  /** Active view for analytics ("peak" or "center"). */
  view: string;
  /** Active category for analytics ("human" or "all"). */
  category: string;
}

export function ShareBar({
  tweetTemplate,
  url,
  promptSlug,
  platform,
  view,
  category,
}: ShareBarProps) {
  const text = tweetTemplate.replace("{url}", url);
  const href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;

  const handleClick = () => {
    trackShare({ prompt_slug: promptSlug, platform, view, category });
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold transition-colors hover:bg-muted/50"
      >
        <Share2 className="h-4 w-4" />
        Share on X
      </a>
    </div>
  );
}
