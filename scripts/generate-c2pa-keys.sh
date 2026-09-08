#!/usr/bin/env bash
#
# Self-signed certificate generation for C2PA signing.
#
# Generates an ECDSA P-256 key pair and a self-signed X.509 certificate
# suitable for C2PA manifest signing.
#
# LIMITATIONS:
# - Self-signed certificates may be flagged or untrusted by some C2PA verifiers.
# - For production use, obtain a CA-issued C2PA-approved certificate from a
#   recognized certificate authority (e.g., Adobe C2PA cert, Truepic, etc.).
# - Self-signed certs are suitable for development and initial deployment.
#
# Usage:
#   bash scripts/generate-c2pa-keys.sh
#
# Output:
#   C2PA_SIGNING_KEY.pem  (private key)
#   C2PA_SIGNING_CERT.pem (self-signed certificate)
#
# Set these as Worker secrets:
#   npx wrangler secret put C2PA_SIGNING_KEY < C2PA_SIGNING_KEY.pem
#   npx wrangler secret put C2PA_SIGNING_CERT < C2PA_SIGNING_CERT.pem

set -euo pipefail

KEY_FILE="C2PA_SIGNING_KEY.pem"
CERT_FILE="C2PA_SIGNING_CERT.pem"

# Generate ECDSA P-256 private key in PKCS#8 format.
# WebCrypto's importKey("pkcs8", ...) requires PKCS#8 — SEC1 format
# (openssl ecparam output) would cause a silent import failure.
# `openssl genpkey` produces PKCS#8 directly.
openssl genpkey -algorithm EC -pkeyopt ec_paramgen_curve:P-256 -out "$KEY_FILE"

# Generate self-signed certificate (1 year validity)
openssl req -new -x509 -key "$KEY_FILE" -out "$CERT_FILE" -days 365 \
  -subj "/C=US/O=SigRank/OU=SignalAF/CN=SigRank SignalAF C2PA Signer" \
  -addext "keyUsage=digitalSignature" \
  -addext "extendedKeyUsage=codeSigning"

echo "Generated C2PA signing key and certificate:"
echo "  $KEY_FILE  (private key — keep secret!)"
echo "  $CERT_FILE (self-signed certificate)"
echo ""
echo "Set as Worker secrets:"
echo "  npx wrangler secret put C2PA_SIGNING_KEY < $KEY_FILE"
echo "  npx wrangler secret put C2PA_SIGNING_CERT < $CERT_FILE"
echo ""
echo "WARNING: Self-signed certificates may be flagged by some C2PA"
echo "verifiers. For production, obtain a CA-issued C2PA certificate."
