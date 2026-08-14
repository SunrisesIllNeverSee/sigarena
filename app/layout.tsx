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
  title: "Performative Evals & Leaderboard for AI Users | SigRank SignalAF",
  description:
    "Performative evals and ranking for users not models. SigRank is the statistical layer for AI users — operators, developers, coders. Custom metrics like Yield turn AI usage into stats. Benchmark your AI performance.",
  authors: [{ name: "SigRank SignalAF", url: "https://signalaf.com" }],
  publisher: "SigRank SignalAF",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  openGraph: {
    title: "Performative Evals & Leaderboard for AI Users | SigRank SignalAF",
    description:
      "The statistical layer for AI users. Evals and ranking for users not models. Ranked by Yield.",
    type: "website",
    url: "https://sigeconomy.com",
    siteName: "SigRank SignalAF",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Performative Evals & Leaderboard for AI Users — SigRank SignalAF" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Performative Evals for AI Users — SigRank SignalAF",
    description: "The statistical layer for AI users. Evals and ranking for users not models. Ranked by Yield.",
    images: [{ url: "/og.png", alt: "Performative Evals & Leaderboard for AI Users — SigRank SignalAF" }],
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
