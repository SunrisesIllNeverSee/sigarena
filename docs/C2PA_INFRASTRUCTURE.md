# C2PA Infrastructure Setup Guide

This document describes the infrastructure configuration required for C2PA
Content Credentials on sigeconomy.com. These steps are performed outside the
codebase — via the Cloudflare dashboard or API — and must be completed before
deployment.

## 1. Cloudflare Images

### Enable Cloudflare Images

Cloudflare Images must be enabled on the account. The Worker binding (`IMAGES`)
is already configured in `wrangler.toml`:

```toml
[images]
binding = "IMAGES"
```

### Preserve Content Credentials

Enable account-wide Preserve Content Credentials so that Cloudflare Images
does not strip C2PA manifests when processing uploaded images:

```bash
curl --request PATCH \
  https://api.cloudflare.com/client/v4/accounts/{account_id}/images/v1/config \
  --header "Authorization: Bearer <API_TOKEN>" \
  --header "Content-Type: application/json" \
  --data '{"preserve_content_credentials": true}'
```

**Important:** Cloudflare Images preserves existing C2PA manifests — it does not
create them. Source images must already contain C2PA manifests before upload.
The signing pipeline in `lib/c2pa/manifest.ts` embeds the manifest before upload.

### Configure Image Variants

Create the following image variants in Cloudflare Images:

| Variant name | Dimensions | Purpose |
|-------------|------------|---------|
| `share-card` | 1200×630 | MCP share cards (OG image size) |
| `badge` | 256×256 | Operator badges |
| `og` | 1200×630 | Open Graph images |

### Configure Metadata

Set the metadata mode to `copyright`:

```bash
curl --request PATCH \
  https://api.cloudflare.com/client/v4/accounts/{account_id}/images/v1/config \
  --header "Authorization: Bearer <API_TOKEN>" \
  --header "Content-Type: application/json" \
  --data '{"metadata": "copyright"}'
```

## 2. C2PA Signing Keys

### Generate Self-Signed Certificate (Development)

```bash
bash scripts/generate-c2pa-keys.sh
```

This generates:
- `C2PA_SIGNING_KEY.pem` — ECDSA P-256 private key
- `C2PA_SIGNING_CERT.pem` — Self-signed X.509 certificate (1 year validity)

### Set Worker Secrets

```bash
npx wrangler secret put C2PA_SIGNING_KEY < C2PA_SIGNING_KEY.pem
npx wrangler secret put C2PA_SIGNING_CERT < C2PA_SIGNING_CERT.pem
```

### Optional: Cloudflare Account Hash

For constructing imagedelivery.net URLs, set the account hash as a Worker
secret or variable:

```bash
npx wrangler secret put CLOUDFLARE_IMAGES_ACCOUNT_HASH
# Enter your Cloudflare Images account hash
```

### Upgrade to CA-Issued Certificate (Production)

Self-signed certificates may be flagged or untrusted by some C2PA verifiers.
For production use:

1. Obtain a C2PA-approved certificate from a recognized certificate authority
   (e.g., Adobe C2PA cert, Truepic).
2. Replace the Worker secrets with the CA-issued key and certificate.
3. No code changes are required — the signing pipeline uses whatever key/cert
   is configured in the Worker secrets.

## 3. Security Notes

- The private signing key (`C2PA_SIGNING_KEY`) is a Worker secret and is never
  exposed in client bundles, public environment variables, API responses, or
  source control.
- Signing is performed server-side only, in the OG image route and the
  share-card pipeline module.
- The `lib/c2pa/` module is server-only and must never be imported in client
  code.
- Generated share-card URLs use deterministic IDs based on tool name and
  params hash, preventing unnecessary regeneration of identical cards.
