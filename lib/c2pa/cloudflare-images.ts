/**
 * Cloudflare Images upload utility.
 *
 * Uploads signed PNG images to Cloudflare Images via the Worker binding
 * or the REST API, returning an imagedelivery.net URL.
 *
 * The Worker binding (`IMAGES`) is used when available (production). The
 * REST API is used as a fallback or for direct uploads.
 */

/** Cloudflare Images binding interface (from wrangler.toml). */
export interface CloudflareImagesBinding {
  input(
    image: ReadableStream | ArrayBuffer | string,
    options?: {
      id?: string;
      metadata?: Record<string, unknown>;
      requireSignedURLs?: boolean;
    },
  ): Promise<{ id: string }>;
}

/**
 * Get the Cloudflare Images binding from the request environment.
 * Returns null if the binding is not available (e.g., in development).
 */
export function getImagesBinding(
  env?: Record<string, unknown>,
): CloudflareImagesBinding | null {
  if (!env) return null;
  const binding = env.IMAGES as CloudflareImagesBinding | undefined;
  if (!binding || typeof binding.input !== "function") return null;
  return binding;
}

/**
 * Upload a signed PNG to Cloudflare Images and return the delivery URL.
 *
 * @param pngBytes - The C2PA-signed PNG bytes
 * @param id - A deterministic ID for the image (e.g., "share-mcp-discover_peers-<hash>")
 * @param metadata - Optional metadata to attach
 * @param env - The Worker environment (for the IMAGES binding)
 * @returns The imagedelivery.net URL, or null if upload fails
 */
export async function uploadToCloudflareImages(
  pngBytes: Uint8Array,
  id: string,
  metadata: Record<string, string>,
  env?: Record<string, unknown>,
): Promise<string | null> {
  const binding = getImagesBinding(env);
  const accountHash = env?.CLOUDFLARE_IMAGES_ACCOUNT_HASH as string;

  // The imagedelivery.net URL requires the account hash. Without it the
  // upload would succeed but the returned URL could not be constructed,
  // wasting bandwidth on an image that would never be referenced. Skip
  // the upload entirely in that case.
  if (!accountHash) {
    return null;
  }

  if (binding) {
    try {
      // Use the Worker binding for upload.
      // The binding accepts a ReadableStream or ArrayBuffer. Copy the
      // Uint8Array into a standalone ArrayBuffer to avoid passing a view
      // into a larger underlying buffer (cbor-x allocates 8 KiB blocks).
      const ab = new ArrayBuffer(pngBytes.byteLength);
      new Uint8Array(ab).set(pngBytes);
      const result = await binding.input(ab, {
        id,
        metadata,
      });
      return `https://imagedelivery.net/${accountHash}/${result.id}/share-card`;
    } catch {
      return null;
    }
  }

  // Fallback: REST API (requires CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID)
  const apiToken = env?.CLOUDFLARE_API_TOKEN as string;
  const accountId = env?.CLOUDFLARE_ACCOUNT_ID as string;

  if (!apiToken || !accountId) {
    return null;
  }

  try {
    const formData = new FormData();
    formData.append("file", new Blob([pngBytes as BlobPart]));
    formData.append("id", id);
    formData.append("metadata", JSON.stringify(metadata));

    const resp = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/images/v1`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiToken}`,
        },
        body: formData,
      },
    );

    if (!resp.ok) return null;

    const json = (await resp.json()) as {
      result?: { id?: string };
      success: boolean;
    };
    if (!json.success || !json.result?.id) return null;

    return `https://imagedelivery.net/${accountHash}/${json.result.id}/share-card`;
  } catch {
    return null;
  }
}
