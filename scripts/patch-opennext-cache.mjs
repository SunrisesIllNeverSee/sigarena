/**
 * Post-build patch: adds pre-rendered App Router pages to OpenNext's HtmlPages list.
 *
 * OpenNext's fixCacheHeaderForHtmlPages() only sets s-maxage=31536000 for
 * pages in the HtmlPages list. For App Router dynamic routes (/[slug]),
 * the list only contains "/404" — so all pre-rendered pages (both SSG and
 * ISR) get "no-cache, no-store" headers even though they're static HTML at
 * build time.
 *
 * This script reads the prerender-manifest.json, finds all pre-rendered routes
 * (both SSG with initialRevalidateSeconds === false and ISR with a numeric
 * revalidate value), and patches the generated worker to include them in
 * HtmlPages and override cache-control headers.
 *
 * Run after `opennextjs-cloudflare build` and before `deploy`.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// Read prerender manifest to find all pre-rendered routes (SSG + ISR)
const manifest = JSON.parse(
  readFileSync(join(root, ".next", "prerender-manifest.json"), "utf8")
);

const ssgRoutes = Object.entries(manifest.routes || {})
  .filter(([path, config]) => {
    // Include both SSG (false) and ISR (numeric) pre-rendered routes
    const reval = config.initialRevalidateSeconds;
    return (reval === false || typeof reval === "number") && path !== "/_not-found";
  })
  .map(([path]) => path);

// Patch worker.js, index.mjs and handler.mjs
const ssgList = JSON.stringify(ssgRoutes);
const ssgArrayLiteral = `[${ssgRoutes.map(r => `"${r}"`).join(",")}]`;

const files = [
  {
    path: join(root, ".open-next", "worker.js"),
    patches: [
      // Wrap the handler response to override cache-control for SSG routes.
      // This is the most reliable approach — it modifies the response at the
      // Cloudflare Worker level, after all OpenNext/Next.js processing.
      {
        pattern: 'const { handler } = await import("./server-functions/default/handler.mjs");\n            return handler(reqOrResp, env, ctx, request.signal);',
        replacement: `const { handler } = await import("./server-functions/default/handler.mjs");\n            const _res = await handler(reqOrResp, env, ctx, request.signal);\n            const _ssgPaths = ${ssgArrayLiteral};\n            const _url = new URL(request.url);\n            if (_ssgPaths.includes(_url.pathname) && _res.headers) {\n              const _newHeaders = new Headers(_res.headers);\n              _newHeaders.set("cache-control", "public, max-age=0, s-maxage=31536000, stale-while-revalidate=2592000, must-revalidate");\n              return new Response(_res.body, { status: _res.status, statusText: _res.statusText, headers: _newHeaders });\n            }\n            return _res;`,
      },
    ],
  },
  {
    path: join(root, ".open-next", "server-functions", "default", "index.mjs"),
    patches: [
      {
        pattern: 'var HtmlPages = ["/404"];',
        replacement: `var HtmlPages = ${JSON.stringify(["/404", ...ssgRoutes])};`,
      },
    ],
  },
  {
    path: join(root, ".open-next", "server-functions", "default", "handler.mjs"),
    patches: [
      {
        pattern: 'HtmlPages=["/404"]',
        replacement: `HtmlPages=${JSON.stringify(["/404", ...ssgRoutes])}`,
      },
    ],
  },
];

for (const { path: filePath, patches } of files) {
  let code = readFileSync(filePath, "utf8");
  let patched = 0;
  for (const { pattern, replacement } of patches) {
    if (code.includes(pattern)) {
      code = code.replace(pattern, replacement);
      patched++;
    }
  }
  if (patched > 0) {
    writeFileSync(filePath, code, "utf8");
    console.log(`Patched ${filePath.split("/").pop()}: ${patched} patches applied`);
  } else {
    console.warn(`Warning: no patterns found in ${filePath.split("/").pop()} — skipping`);
  }
}
for (const route of ssgRoutes) {
  console.log(`  + ${route}`);
}
