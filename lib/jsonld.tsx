import type { LeaderboardEntry, OperatorResponse, AggregateStats } from "@/lib/api";
import { operatorDisplayName, formatYield } from "@/lib/utils";

const SITE_URL = "https://sigeconomy.com";
const ORG_URL = "https://signalaf.com";

/** Organization schema for SigRank — used site-wide */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SigRank",
    url: ORG_URL,
    logo: `${ORG_URL}/logo.png`,
    description:
      "SigRank is the statistical layer for AI users — performative evals and ranking for users not models. Custom metrics like Yield turn AI usage into stats, like ERA for baseball.",
    sameAs: [
      "https://github.com/SunrisesIllNeverSee",
      "https://x.com/burnmydays",
    ],
  };
}

/** WebSite schema — used site-wide in root layout */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SigRank — Performative Evals for AI Users",
    alternateName: "SigRank",
    url: SITE_URL,
    description:
      "Performative evals and ranking for users not models. SigRank is the statistical layer for AI users — operators, developers, coders. Custom metrics like Yield turn AI usage into stats.",
    publisher: {
      "@type": "Organization",
      name: "SigRank",
      url: ORG_URL,
    },
  };
}

/** WebSite schema with aggregate stats — used on the homepage for AI search engines */
export function websiteSchemaWithStats(stats: AggregateStats, platformCount: number) {
  const tokenStr = stats.total_tokens >= 1e12
    ? `${(stats.total_tokens / 1e12).toFixed(1)}T`
    : stats.total_tokens >= 1e9
    ? `${(stats.total_tokens / 1e9).toFixed(1)}B`
    : `${(stats.total_tokens / 1e6).toFixed(1)}M`;
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SigRank — Performative Evals for AI Users",
    alternateName: "SigRank",
    url: SITE_URL,
    description: `${stats.total_operators.toLocaleString()} operators ranked across ${platformCount} platforms. ${tokenStr} tokens analyzed. Median Yield: ${formatYield(stats.median_yield)}. Performative evals and ranking for users not models.`,
    publisher: {
      "@type": "Organization",
      name: "SigRank",
      url: ORG_URL,
    },
    about: {
      "@type": "Thing",
      name: "AI User Leaderboard",
      description: `${stats.total_operators} operators ranked by Yield (Υ) — token-cascade efficiency across ${platformCount} platforms.`,
    },
    mainEntity: {
      "@type": "Dataset",
      name: "SigRank Operator Leaderboard",
      description: `${stats.total_operators} operators, ${tokenStr} tokens analyzed, ${platformCount} platforms. Ranked by Yield (Υ) = (cache_read × output) / input².`,
      variableMeasured: ["Yield (Υ)", "Velocity", "Leverage", "SNR", "10xDEV", "Scale V", "Efficiency", "$/1M", "Op Ratio"],
      measurementTechnique: "Token telemetry from real AI coding sessions",
    },
  };
}

/** ItemList schema for leaderboard pages */
export function leaderboardSchema(
  entries: LeaderboardEntry[],
  pageName: string = "AI User Leaderboard",
  pageUrl: string = SITE_URL,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: pageName,
    url: pageUrl,
    description: `The top AI users ranked by Yield (Υ) — token-cascade efficiency.`,
    numberOfItems: entries.length,
    itemListElement: entries.slice(0, 20).map((entry, i) => ({
      "@type": "ListItem",
      position: entry.rank || i + 1,
      item: {
        "@type": "Person",
        name: operatorDisplayName(entry.display_name, entry.codename),
        url: `${ORG_URL}/user/${entry.codename}`,
        identifier: entry.codename,
        knowsAbout: "AI-assisted coding",
        award: `Υ ${formatYield(entry.yield_)} — ${entry.class_tier?.replace(/_/g, " ") || "Ranked"}`,
      },
    })),
  };
}

/** Person schema for operator profile pages */
export function personSchema(op: OperatorResponse) {
  const name = operatorDisplayName(op.display_name, op.codename);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: `${ORG_URL}/user/${op.codename}`,
    identifier: op.codename,
    knowsAbout: "AI-assisted coding",
    jobTitle: "AI Operator",
    award: [
      `Rank #${op.current_rank.global} on AI User Leaderboard`,
      `Υ Yield: ${formatYield(op.current_metrics.yield_)}`,
      `${op.class_tier?.replace(/_/g, " ") || "Ranked"} class`,
    ],
    knows: op.platform,
    description: `${name} ranks #${op.current_rank.global} on the AI User Leaderboard with Υ ${formatYield(op.current_metrics.yield_)} (${op.class_tier} class, ${op.platform}).`,
  };
}

/** Article schema for comparison and topic hub pages */
export function articleSchema(
  title: string,
  description: string,
  path: string,
  datePublished: string = "2026-08-12",
) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: `${SITE_URL}${path}`,
    datePublished,
    dateModified: datePublished,
    author: {
      "@type": "Organization",
      name: "SigRank",
      url: ORG_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "SigRank",
      url: ORG_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}${path}`,
    },
  };
}

/** BreadcrumbList schema for interior pages */
export function breadcrumbSchema(
  crumbs: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  };
}

/** FAQPage schema for /how-it-works */
export function faqSchema(
  faqs: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/** React component that renders JSON-LD as a <script> tag */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = Array.isArray(data) ? data : [data];
  return (
    <>
      {json.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}

/** Render JSON-LD scripts directly — use inside a <head> element */
export function HeadJsonLd({ data }: { data: object | object[] }) {
  const json = Array.isArray(data) ? data : [data];
  return (
    <>
      {json.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
