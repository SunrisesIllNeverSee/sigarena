/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  outputFileTracingRoot: import.meta.dirname,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "signalaf.com" },
      { protocol: "https", hostname: "pbs.twimg.com" },
    ],
  },
  async headers() {
    return [
      {
        // SSG prompt pages — OpenNext doesn't set static cache headers for
        // App Router dynamic routes (/[slug]) even with force-static +
        // dynamicParams=false. This explicitly sets s-maxage=31536000 for
        // all pre-rendered prompt slugs so Cloudflare's CDN caches them.
        // Listed slugs match generateStaticParams output.
        source: "/(best-ai-user|most-output-per-token|most-context-reuse|cleanest-signal|best-op-ratio|cheapest-tokens|largest-scale|most-efficient-overall|most-normalized)",
        headers: [
          { key: "Cache-Control", value: "s-maxage=31536000, stale-while-revalidate=2592000" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://us-assets.i.posthog.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://signalaf.com https://us.i.posthog.com https://us-assets.i.posthog.com https://app.posthog.com https://cloudflareinsights.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self' https://signalaf.com;",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/operator/:codename*",
        destination: "https://signalaf.com/user/:codename*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
