/**
 * COSE_Sign1 construction and signing (RFC 9052).
 *
 * C2PA wraps the CBOR-encoded claim in a COSE_Sign1 structure for signing.
 * The structure is:
 *
 *   COSE_Sign1 = [
 *     protected: bstr .cbor {1: alg, 33: x5chain},   // protected header
 *     unprotected: {},                                 // unprotected header (empty)
 *     payload: bstr,                                    // claim bytes
 *     signature: bstr                                   // signature over Sig_structure
 *   ]
 *
 * The signature is computed over the Sig_structure:
 *   Sig_structure = [
 *     "Signature1",
 *     protected_header_bstr,
 *     external_aad: bstr (empty),
 *     payload: bstr (claim bytes)
 *   ]
 *
 * The x5chain (certificate chain) is placed in the protected header to ensure
 * integrity protection (CAWG Identity 1.2 requirement).
 *
 * IMPORTANT: COSE header maps use integer keys (RFC 9052 §1.4). JavaScript
 * object keys are always strings, so cbor-x would encode them as CBOR text
 * strings — invalid for COSE. We use Map with integer keys and the
 * deterministic encoder (no Tag 259 wrapping) from ./cbor.
 */

import { Tag } from "cbor-x";
import { encode, sortedMap } from "./cbor";

/** COSE algorithm identifier for ES256 (ECDSA P-256 with SHA-256). */
export const COSE_ALG_ES256 = -7;

/** COSE header label for x5chain (certificate chain). */
export const COSE_HDR_X5CHAIN = 33;

/** COSE tag for COSE_Sign1_Tagged. */
export const COSE_SIGN1_TAG = 18;

/**
 * Build the protected header as a CBOR-encoded byte string.
 * Contains a map with integer keys: {1: alg, 33: x5chain}.
 *
 * Keys are sorted by their CBOR byte-wise encoding (RFC 8949 deterministic
 * encoding) so the encoding is reproducible by a verifier.
 */
export function buildProtectedHeader(
  alg: number,
  certChain: Uint8Array[],
): Uint8Array {
  // x5chain: single cert as bstr, multiple certs as array of bstr
  const x5chain: Uint8Array | Uint8Array[] =
    certChain.length === 1 ? certChain[0] : certChain;

  const headerMap = sortedMap([
    [1, alg],
    [COSE_HDR_X5CHAIN, x5chain],
  ]);

  return encode(headerMap);
}

/**
 * Build the Sig_structure for signing (RFC 9052 §4.1).
 *
 *   Sig_structure = [
 *     "Signature1",
 *     protected: bstr,
 *     external_aad: bstr,
 *     payload: bstr
 *   ]
 */
export function buildSigStructure(
  protectedHeader: Uint8Array,
  payload: Uint8Array,
): Uint8Array {
  const sigStructure = [
    "Signature1",
    protectedHeader,
    new Uint8Array(0), // external_aad (empty)
    payload,
  ];
  return encode(sigStructure);
}

/**
 * Sign the claim bytes using ECDSA P-256 (ES256) with WebCrypto.
 *
 * @param claimBytes - The CBOR-encoded claim bytes (the COSE payload)
 * @param privateKeyPem - PEM-encoded ECDSA P-256 private key
 * @param certChainDer - Array of DER-encoded certificates (leaf first)
 * @returns The COSE_Sign1_Tagged bytes (tag 18 + COSE_Sign1 array)
 */
export async function signCoseSign1(
  claimBytes: Uint8Array,
  privateKeyPem: string,
  certChainDer: Uint8Array[],
): Promise<Uint8Array> {
  // Import the private key
  const privateKey = await importPrivateKey(privateKeyPem);

  // Build the protected header
  const protectedHeader = buildProtectedHeader(COSE_ALG_ES256, certChainDer);

  // Build the Sig_structure to sign
  const sigStructure = buildSigStructure(protectedHeader, claimBytes);

  // Sign with WebCrypto (ECDSA with SHA-256).
  // Pass the Uint8Array view directly (not .buffer) — cbor-x may return a
  // view into a larger underlying ArrayBuffer, so .buffer would include
  // extra trailing bytes that would corrupt the signature.
  const signatureBuffer = await crypto.subtle.sign(
    { name: "ECDSA", hash: "SHA-256" },
    privateKey,
    sigStructure as BufferSource,
  );
  const signature = new Uint8Array(signatureBuffer);

  // Build the COSE_Sign1 structure (untagged)
  //   [protected: bstr, unprotected: {}, payload: bstr, signature: bstr]
  // The unprotected header is an empty map — encoded as a bare Map (a0)
  // using the deterministic encoder (no Tag 259).
  const coseSign1 = [
    protectedHeader, // protected header (bstr)
    new Map(), // unprotected header (empty map — bare a0, no Tag 259)
    claimBytes, // payload (bstr)
    signature, // signature (bstr)
  ];

  // Wrap in CBOR tag 18 (COSE_Sign1_Tagged) using cbor-x's Tag class.
  const tagged = new Tag(coseSign1, COSE_SIGN1_TAG);
  return encode(tagged);
}

/**
 * Import a PEM-encoded ECDSA P-256 private key for WebCrypto.
 *
 * Expects PKCS#8 format (-----BEGIN PRIVATE KEY-----). SEC1 format
 * (-----BEGIN EC PRIVATE KEY-----) is NOT supported by WebCrypto's
 * importKey("pkcs8", ...) and will throw a clear error.
 */
async function importPrivateKey(pem: string): Promise<CryptoKey> {
  // Detect SEC1 format and fail with a clear message instead of a
  // cryptic WebCrypto DER-decode error.
  if (pem.includes("EC PRIVATE KEY")) {
    throw new Error(
      "C2PA signing key is in SEC1 format (-----BEGIN EC PRIVATE KEY-----). " +
        "WebCrypto requires PKCS#8 format (-----BEGIN PRIVATE KEY-----). " +
        "Regenerate with: openssl genpkey -algorithm EC -pkeyopt ec_paramgen_curve:P-256",
    );
  }

  // Strip PEM headers and decode base64
  const pemContents = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, "")
    .replace(/-----END PRIVATE KEY-----/g, "")
    .replace(/\s/g, "");

  const keyBytes = base64ToUint8Array(pemContents);

  return crypto.subtle.importKey(
    "pkcs8",
    keyBytes as BufferSource,
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"],
  );
}

/**
 * Import a PEM-encoded certificate and return its DER bytes.
 */
export function pemToDer(pem: string): Uint8Array {
  const pemContents = pem
    .replace(/-----BEGIN CERTIFICATE-----/g, "")
    .replace(/-----END CERTIFICATE-----/g, "")
    .replace(/\s/g, "");
  return base64ToUint8Array(pemContents);
}

/** Decode a base64 string to a Uint8Array. */
function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
