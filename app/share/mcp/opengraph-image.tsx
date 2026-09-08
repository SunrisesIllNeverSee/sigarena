import { ImageResponse } from "next/og";
import { decodeShareParams, buildShareCard } from "@/lib/share/mcp-card";
import { signPngWithC2pa } from "@/lib/c2pa";
import { uploadToCloudflareImages } from "@/lib/c2pa/cloudflare-images";
import { computeParamsHash } from "@/lib/c2pa/share-pipeline";

// CRITICAL: without force-dynamic the build will fail (the OG image reads
// search params and fetches the MCP endpoint at request time).
export const dynamic = "force-dynamic";

export const alt = "SigEconomy MCP Tool Result";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface OGProps {
  searchParams: Promise<{ t?: string; d?: string }>;
}

const TOOL_LABELS: Record<string, string> = {
  get_best_operator: "Best Operator",
  compare_operators: "Compare Operators",
  explain_this_operator: "Operator Profile",
  discover_peers: "Discover Peers",
  optimize_efficiency: "Optimize Efficiency",
  describe_power_user: "Power User Profile",
  operator_gap: "Operator Gap",
  field_anomaly: "Field Anomaly",
};

export default async function OGImage({ searchParams }: OGProps) {
  const sp = await searchParams;
  const toolName = sp.t || "";
  const params = decodeShareParams(sp.d ?? null);

  const baseUrl = process.env.NODE_ENV === "production"
    ? "https://sigeconomy.com"
    : "http://localhost:3001";

  let headline = "SigEconomy MCP";
  let subheadline = toolName ? TOOL_LABELS[toolName] ?? toolName : "";
  let interpretation = "";
  let metrics: Array<{ label: string; value: string }> = [];

  if (toolName && params) {
    const result = await buildShareCard(toolName, params, baseUrl);
    if (!("error" in result)) {
      headline = result.headline;
      subheadline = result.subheadline || (TOOL_LABELS[toolName] ?? toolName);
      interpretation = result.interpretation;
      metrics = result.metrics.slice(0, 4);
    } else {
      headline = "Result unavailable";
      subheadline = result.error || "";
    }
  }

  // Truncate interpretation for the OG image
  const maxInterpLen = 180;
  const truncatedInterp = interpretation.length > maxInterpLen
    ? interpretation.slice(0, maxInterpLen).trim() + "…"
    : interpretation;

  // Generate the base OG image
  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
          padding: "60px",
          fontFamily: "sans-serif",
          color: "#ffffff",
        }}
      >
        {/* Top label */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "20px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", opacity: 0.8 }}>
          <span style={{ fontSize: "24px" }}>✦</span>
          SigEconomy MCP
        </div>

        {/* Tool name */}
        <div style={{ fontSize: "22px", marginTop: "8px", opacity: 0.7 }}>{subheadline}</div>

        {/* Headline */}
        <div style={{ fontSize: "52px", fontWeight: 700, marginTop: "16px", lineHeight: 1.1, maxWidth: "1000px" }}>
          {headline}
        </div>

        {/* Metrics row */}
        {metrics.length > 0 && (
          <div style={{ display: "flex", gap: "24px", marginTop: "32px" }}>
            {metrics.map((m) => (
              <div
                key={m.label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "rgba(255,255,255,0.12)",
                  borderRadius: "12px",
                  padding: "16px 24px",
                  minWidth: "140px",
                }}
              >
                <div style={{ fontSize: "32px", fontWeight: 700 }}>{m.value}</div>
                <div style={{ fontSize: "14px", opacity: 0.8, marginTop: "4px" }}>{m.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Interpretation */}
        {truncatedInterp && (
          <div style={{ fontSize: "20px", marginTop: "32px", lineHeight: 1.4, opacity: 0.9, maxWidth: "1000px" }}>
            {truncatedInterp}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: "flex", marginTop: "auto", justifyContent: "space-between", alignItems: "center", fontSize: "18px", opacity: 0.7 }}>
          <span>Powered by SigRank SignalAF</span>
          <span>sigeconomy.com</span>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );

  // Attempt to embed C2PA Content Credentials into the PNG.
  // If signing keys are not configured or signing fails, return the unsigned image.
  const signingKey = process.env.C2PA_SIGNING_KEY;
  const signingCert = process.env.C2PA_SIGNING_CERT;

  if (!signingKey || !signingCert) {
    return imageResponse;
  }

  try {
    const pngBuffer = await imageResponse.arrayBuffer();
    const pngBytes = new Uint8Array(pngBuffer);

    // Compute params hash early — used for both the C2PA instanceID and
    // the Cloudflare Images deterministic image ID.
    const paramsHash = toolName && params
      ? await computeParamsHash({ t: toolName, d: sp.d ?? "" })
      : "";

    const signedPng = await signPngWithC2pa(
      pngBytes,
      {
        claimGenerator: "SigRank/1.0.0",
        claimGeneratorInfo: [
          { name: "SigRank Share Card Generator", version: "1.0.0" },
        ],
        creator: {
          name: "SigRank SignalAF",
          identifier: "https://signalaf.com",
        },
        tool: {
          name: "SigEconomy MCP Share Card",
          version: "1.0.0",
        },
        actions: [
          {
            action: "c2pa.created",
            when: new Date().toISOString(),
            softwareAgent: "SigEconomy MCP",
            digitalSourceType: "algorithmicMedia",
          },
        ],
        assetFormat: "image/png",
        // instanceID uniquely identifies this version of the asset (C2PA spec 2.4 §5.2.1).
        instanceId: `sigeconomy.com/share/mcp?t=${toolName}&d=${paramsHash}`,
      },
      { signingKey, signingCert },
    );

    // Upload to Cloudflare Images for CDN caching (best-effort — does not
    // block the response if the IMAGES binding or account hash is missing).
    // The signed PNG is returned directly regardless of upload outcome.
    if (toolName && params) {
      const imageId = `share-mcp-${toolName}-${paramsHash}`;
      void uploadToCloudflareImages(
        signedPng,
        imageId,
        { tool: toolName, type: "share-card", c2pa: "signed" },
        process.env as unknown as Record<string, unknown>,
      ).catch(() => {
        // Upload failure is non-fatal — the signed image is returned directly.
      });
    }

    return new Response(signedPng.buffer as ArrayBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    // If C2PA signing fails, return the original unsigned image
    return imageResponse;
  }
}
