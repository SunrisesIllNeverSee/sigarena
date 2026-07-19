import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PostHogProvider } from "@/components/posthog-provider";
import { websiteSchema, organizationSchema } from "@/lib/jsonld";

export const metadata: Metadata = {
  metadataBase: new URL("https://signaaf.com"),
  title: "AI User Leaderboard — Powered by SigRank",
  description:
    "Who's the best AI user? See how you rank on SigRank. Ranked by Υ Yield — token-cascade efficiency, not raw spend.",
  openGraph: {
    title: "AI User Leaderboard — Powered by SigRank",
    description:
      "Who's the best AI user? See how you rank on SigRank.",
    type: "website",
    url: "https://signaaf.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI User Leaderboard — Powered by SigRank",
    description: "Who's the best AI user? See how you rank on SigRank.",
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
          <SiteHeader />
          <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8">{children}</main>
          <SiteFooter />
        </PostHogProvider>
      </body>
    </html>
  );
}
