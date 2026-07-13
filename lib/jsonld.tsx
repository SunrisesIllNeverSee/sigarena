import type { LeaderboardEntry, OperatorResponse } from "@/lib/api";
import { operatorDisplayName, operatorSlug, formatYield } from "@/lib/utils";

const SITE_URL = "https://sigarena.signalaf.com";
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
      "SigRank ranks AI users by token-cascade efficiency (Yield). The AI User Leaderboard — who's the best AI user?",
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
    name: "AI User Leaderboard",
    alternateName: "SigArena",
    url: SITE_URL,
    description:
      "Who's the best AI user? The AI User Leaderboard ranks operators by Yield (Υ) — token-cascade efficiency, not raw spend.",
    publisher: {
      "@type": "Organization",
      name: "SigRank",
      url: ORG_URL,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/operator/{search_term_string}`,
      "query-input": "required name=search_term_string",
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
        url: `${SITE_URL}/operator/${operatorSlug(entry.display_name, entry.codename)}`,
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
  const slug = operatorSlug(op.display_name, op.codename);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    url: `${SITE_URL}/operator/${slug}`,
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
  datePublished: string = "2026-07-13",
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

/** React component that renders JSON-LD as a <script> tag in <head> */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = Array.isArray(data) ? data : [data];
  return (
    <head>
      {json.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </head>
  );
}
