import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PostHogProvider } from "@/components/posthog-provider";
import { websiteSchema, organizationSchema } from "@/lib/jsonld";

export const viewport: Viewport = {
  themeColor: "#3b82f6",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://sigeconomy.com"),
  title: "Public LLM Operator Evals — Powered by SigRank",
  description:
    "Public LLM operator evals — the public evaluation layer for AI operators. Like Vals AI evaluates models, SigRank evaluates the humans using AI. Ranked by Υ Yield — token-cascade efficiency.",
  authors: [{ name: "SigRank", url: "https://signalaf.com" }],
  publisher: "SigRank",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "Public LLM Operator Evals — Powered by SigRank",
    description:
      "Public evals for AI operators. Like Vals AI evaluates models, SigRank evaluates the humans using AI.",
    type: "website",
    url: "https://sigeconomy.com",
    siteName: "SigRank",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Public LLM Operator Evals — Ranked by Yield | SigRank" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Public LLM Operator Evals — SigRank",
    description: "Public evals for AI operators. Like Vals AI evaluates models, SigRank evaluates the humans using AI.",
    images: [{ url: "/og.png", alt: "Public LLM Operator Evals — Ranked by Yield | SigRank" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
      </head>
      <body className="min-h-screen bg-muted/20 font-sans antialiased">
        <PostHogProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:shadow-lg"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main-content" className="mx-auto max-w-5xl px-4 py-6 sm:py-8">{children}</main>
          <SiteFooter />
        </PostHogProvider>
      </body>
    </html>
  );
}
