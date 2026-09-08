#!/usr/bin/env node
/**
 * End-to-end C2PA manifest verification test.
 *
 * Verifies that the C2PA manifest produced by lib/c2pa/ complies with the
 * C2PA spec 2.4 v1 claim-map schema.
 */

import { Decoder } from "cbor-x";
import { deflateSync } from "node:zlib";
import { createPublicKey } from "node:crypto";
import { execFileSync } from "node:child_process";
import { writeFileSync, readFileSync, unlinkSync } from "node:fs";
import { signPngWithC2pa } from "../lib/c2pa/manifest.ts";
import { extractC2paFromPng } from "../lib/c2pa/png.ts";
import { buildSigStructure } from "../lib/c2pa/cose.ts";

// --- Helpers ---

function crc32(buf) {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[n] = c;
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function buildChunk(type, data) {
  const len = new Uint8Array(4);
  const dv = new DataView(len.buffer);
  dv.setUint32(0, data.length, false);
  const typeBuf = new Uint8Array(4);
  for (let i = 0; i < 4; i++) typeBuf[i] = type.charCodeAt(i);
  const typeAndData = new Uint8Array(typeBuf.length + data.length);
  typeAndData.set(typeBuf, 0);
  typeAndData.set(data, typeBuf.length);
  const crc = crc32(typeAndData);
  const crcBuf = new Uint8Array(4);
  new DataView(crcBuf.buffer).setUint32(0, crc, false);
  const result = new Uint8Array(len.length + typeAndData.length + crcBuf.length);
  result.set(len, 0);
  result.set(typeAndData, len.length);
  result.set(crcBuf, len.length + typeAndData.length);
  return result;
}

function buildMinimalPng() {
  const sig = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrData = new Uint8Array(13);
  const ihdrDv = new DataView(ihdrData.buffer);
  ihdrDv.setUint32(0, 1, false); // width
  ihdrDv.setUint32(4, 1, false); // height
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 2;  // color type (RGB)
  const ihdr = buildChunk("IHDR", ihdrData);
  const rawRow = new Uint8Array([0, 255, 0, 0]); // filter=none, R=255, G=0, B=0
  const idatData = new Uint8Array(deflateSync(rawRow));
  const idat = buildChunk("IDAT", idatData);
  const iend = buildChunk("IEND", new Uint8Array(0));
  const total = sig.length + ihdr.length + idat.length + iend.length;
  const result = new Uint8Array(total);
  let off = 0;
  result.set(sig, off); off += sig.length;
  result.set(ihdr, off); off += ihdr.length;
  result.set(idat, off); off += idat.length;
  result.set(iend, off);
  return result;
}

function parseJumbfBoxes(data, offset = 0, end = data.length) {
  const boxes = [];
  while (offset < end) {
    if (offset + 8 > end) break;
    const length = ((data[offset] << 24) | (data[offset + 1] << 16) | (data[offset + 2] << 8) | data[offset + 3]) >>> 0;
    const type = String.fromCharCode(data[offset + 4], data[offset + 5], data[offset + 6], data[offset + 7]);
    if (offset + length > end) break;
    const payload = data.subarray(offset + 8, offset + length);
    boxes.push({ type, payload, offset, length });
    offset += length;
  }
  return boxes;
}

function parseJumbSuperBox(data) {
  const boxes = parseJumbfBoxes(data);
  if (boxes.length === 0 || boxes[0].type !== "jumd") {
    throw new Error("Expected jumd as first box in jumb superbox");
  }
  const jumdPayload = boxes[0].payload;
  const uuid = jumdPayload.subarray(0, 16);
  const toggles = jumdPayload[16];
  const labelEnd = jumdPayload.indexOf(0, 17);
  const label = new TextDecoder().decode(jumdPayload.subarray(17, labelEnd));
  const dataBoxes = boxes.slice(1);
  return { uuid, toggles, label, dataBoxes };
}

function bytesEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function fail(msg) {
  console.error("FAIL:", msg);
  process.exit(1);
}

// --- Main test ---

async function main() {
  // Generate test key pair
  const keyPair = await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign", "verify"],
  );
  const privateKeyDer = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
  const privateKeyPem = `-----BEGIN PRIVATE KEY-----\n${Buffer.from(privateKeyDer).toString("base64")}\n-----END PRIVATE KEY-----`;

  // Generate a self-signed cert using openssl (Node crypto can't create X509 certs)
  const tmpKey = "/tmp/c2pa-test-key.pem";
  const tmpCert = "/tmp/c2pa-test-cert.pem";
  writeFileSync(tmpKey, privateKeyPem);
  execFileSync("openssl", [
    "req", "-new", "-x509", "-key", tmpKey, "-out", tmpCert, "-days", "1",
    "-subj", "/CN=Test C2PA Signer",
    "-addext", "keyUsage=digitalSignature",
  ]);
  const certPem = readFileSync(tmpCert, "utf-8");
  unlinkSync(tmpKey);
  unlinkSync(tmpCert);

  // Build and sign PNG
  const pngBuffer = buildMinimalPng();
  console.log("1. Built minimal PNG:", pngBuffer.length, "bytes");

  const signedPng = await signPngWithC2pa(
    pngBuffer,
    {
      claimGenerator: "SigRank/1.0.0",
      claimGeneratorInfo: [{ name: "Test Generator", version: "1.0.0" }],
      creator: { name: "Test Creator", identifier: "https://example.com" },
      tool: { name: "Test Tool", version: "1.0.0" },
      actions: [{ action: "c2pa.created", when: new Date().toISOString(), digitalSourceType: "algorithmicMedia" }],
      assetFormat: "image/png",
      instanceId: "test-instance-id",
    },
    { signingKey: privateKeyPem, signingCert: certPem },
  );
  console.log("2. Signed PNG:", signedPng.length, "bytes");

  // Extract manifest
  const manifestStore = extractC2paFromPng(signedPng);
  if (!manifestStore) fail("No C2PA manifest found in PNG");
  console.log("3. Extracted manifest store:", manifestStore.length, "bytes");

  // Parse JUMBF structure
  const topBoxes = parseJumbfBoxes(manifestStore);
  const manifestStoreBox = topBoxes.find(b => b.type === "jumb");
  if (!manifestStoreBox) fail("No jumb box at top level");

  const storeParsed = parseJumbSuperBox(manifestStoreBox.payload);
  console.log("4. Manifest store label:", storeParsed.label);
  if (storeParsed.label !== "urn:c2pa:manifest_store") fail("Manifest store label wrong");

  const manifestBox = storeParsed.dataBoxes.find(b => b.type === "jumb");
  if (!manifestBox) fail("No manifest jumb box");
  const manifestParsed = parseJumbSuperBox(manifestBox.payload);
  console.log("5. Manifest label:", manifestParsed.label);
  if (manifestParsed.label !== "urn:c2pa:manifest:default") fail("Manifest label wrong");

  // Find assertion store, claim, and signature boxes
  let assertionStoreBox = null, claimBox = null, signatureBox = null;
  for (const box of manifestParsed.dataBoxes) {
    const p = parseJumbSuperBox(box.payload);
    if (p.label === "c2pa.assertions") assertionStoreBox = p;
    else if (p.label === "c2pa.claim") claimBox = p;
    else if (p.label === "c2pa.signature") signatureBox = p;
  }
  if (!assertionStoreBox) fail("No assertion store box (label 'c2pa.assertions')");
  if (!claimBox) fail("No claim box (label 'c2pa.claim')");
  if (!signatureBox) fail("No signature box (label 'c2pa.signature')");
  console.log("6. Found assertion store, claim, and signature boxes ✓");

  // Verify assertion sub-box labels
  const assertionSubBoxes = assertionStoreBox.dataBoxes.filter(b => b.type === "jumb");
  const subLabels = assertionSubBoxes.map(b => parseJumbSuperBox(b.payload).label);
  console.log("7. Assertion sub-box labels:", subLabels);
  for (const expected of ["c2pa.actions", "c2pa.hash.data", "stds.schemaorg.CreativeWork"]) {
    if (!subLabels.includes(expected)) fail(`Missing assertion sub-box '${expected}'`);
  }

  // Verify assertion CBOR data does NOT include 'label' field
  const decoder = new Decoder({ useRecords: false, useTag259ForMaps: false, tagUint8Array: false });
  for (const subBox of assertionSubBoxes) {
    const parsed = parseJumbSuperBox(subBox.payload);
    const cborBox = parsed.dataBoxes.find(b => b.type === "cbor");
    if (!cborBox) fail(`No cbor box in assertion '${parsed.label}'`);
    const decoded = decoder.decode(cborBox.payload);
    const keys = decoded instanceof Map ? [...decoded.keys()] : Object.keys(decoded);
    if (keys.includes("label")) fail(`Assertion '${parsed.label}' CBOR includes 'label' field`);
  }
  console.log("8. Assertion CBOR data does NOT include 'label' field ✓");

  // Verify c2pa.hash.data structure
  const hashDataSubBox = assertionSubBoxes.find(b => parseJumbSuperBox(b.payload).label === "c2pa.hash.data");
  const hashDataParsed = parseJumbSuperBox(hashDataSubBox.payload);
  const hashDataCbor = hashDataParsed.dataBoxes.find(b => b.type === "cbor");
  const hashDataDecoded = decoder.decode(hashDataCbor.payload);
  const hashDataKeys = hashDataDecoded instanceof Map ? [...hashDataDecoded.keys()] : Object.keys(hashDataDecoded);
  console.log("9. c2pa.hash.data fields:", hashDataKeys);
  if (hashDataKeys.includes("format")) fail("c2pa.hash.data should NOT have 'format' field");
  if (!hashDataKeys.includes("hash")) fail("c2pa.hash.data missing 'hash' field");
  if (!hashDataKeys.includes("pad")) fail("c2pa.hash.data missing 'pad' field");
  console.log("9. c2pa.hash.data structure is spec-compliant ✓");

  // Decode claim
  const claimCbor = claimBox.dataBoxes.find(b => b.type === "cbor");
  const claimDecoded = decoder.decode(claimCbor.payload);
  const claimKeys = claimDecoded instanceof Map ? [...claimDecoded.keys()] : Object.keys(claimDecoded);
  console.log("10. Claim fields:", claimKeys);

  // Verify v1 claim-map required fields
  for (const field of ["claim_generator", "claim_generator_info", "signature", "assertions", "dc:format", "instanceID", "alg"]) {
    if (!claimKeys.includes(field)) fail(`Claim missing required field '${field}'`);
  }
  console.log("11. Claim has all v1 claim-map required fields ✓");

  // Verify no unknown fields
  const allowedFields = new Set(["claim_generator", "claim_generator_info", "signature", "assertions", "dc:format", "instanceID", "alg", "dc:title", "redacted_assertions", "alg_soft", "metadata"]);
  for (const key of claimKeys) {
    if (!allowedFields.has(key)) fail(`Claim has unknown field '${key}'`);
  }
  console.log("12. Claim has no unknown fields ✓");

  // Verify signature is a URI string
  const sigValue = claimDecoded instanceof Map ? claimDecoded.get("signature") : claimDecoded.signature;
  if (typeof sigValue !== "string") fail(`signature should be string, got ${typeof sigValue}`);
  if (sigValue !== "self#jumbf=c2pa.signature") fail(`signature URI wrong: ${sigValue}`);
  console.log("13. signature is URI string:", sigValue, "✓");

  // Verify claim_generator_info is an array (v1)
  const genInfo = claimDecoded instanceof Map ? claimDecoded.get("claim_generator_info") : claimDecoded.claim_generator_info;
  if (!Array.isArray(genInfo)) fail("claim_generator_info should be an array (v1)");
  console.log("14. claim_generator_info is array ✓");

  // Verify alg is hash algorithm
  const algValue = claimDecoded instanceof Map ? claimDecoded.get("alg") : claimDecoded.alg;
  if (algValue === "es256") fail("alg should be hash algorithm, not signing algorithm");
  if (algValue !== "sha256") fail(`alg should be 'sha256', got '${algValue}'`);
  console.log("15. alg is hash algorithm:", algValue, "✓");

  // Verify assertions are hashed-uri maps
  const assertions = claimDecoded instanceof Map ? claimDecoded.get("assertions") : claimDecoded.assertions;
  if (!Array.isArray(assertions)) fail("assertions should be an array");
  for (let i = 0; i < assertions.length; i++) {
    const a = assertions[i] instanceof Map ? Object.fromEntries(assertions[i]) : assertions[i];
    if (!("url" in a)) fail(`assertion[${i}] missing 'url'`);
    if (!("hash" in a)) fail(`assertion[${i}] missing 'hash'`);
    if (!a.url.startsWith("self#jumbf=c2pa.assertions/")) fail(`assertion[${i}] URL wrong prefix: ${a.url}`);
  }
  console.log("16. assertions are valid hashed-uri maps ✓");

  // Verify assertion URIs match JUMBF box labels
  for (const a of assertions) {
    const aObj = a instanceof Map ? Object.fromEntries(a) : a;
    const label = aObj.url.replace("self#jumbf=c2pa.assertions/", "");
    const found = assertionSubBoxes.some(b => parseJumbSuperBox(b.payload).label === label);
    if (!found) fail(`assertion URI references '${label}' but no JUMBF box with that label exists`);
  }
  console.log("17. assertion URIs match JUMBF box labels ✓");

  // Verify COSE_Sign1
  const sigCbor = signatureBox.dataBoxes.find(b => b.type === "cbor");
  const sigDecoded = decoder.decode(sigCbor.payload);
  let coseSign1;
  if (sigDecoded && typeof sigDecoded === "object" && "tag" in sigDecoded && sigDecoded.tag === 18) {
    coseSign1 = sigDecoded.value;
  } else if (Array.isArray(sigDecoded)) {
    coseSign1 = sigDecoded;
  } else {
    fail("Expected COSE_Sign1_Tagged (Tag 18)");
  }

  const [protectedHeaderBstr, unprotectedHeader, payloadBstr, signatureBstr] = coseSign1;
  console.log("18. COSE_Sign1 structure OK");

  // Verify protected header
  const protectedHeader = decoder.decode(protectedHeaderBstr);
  const protectedKeys = protectedHeader instanceof Map ? [...protectedHeader.keys()] : Object.keys(protectedHeader);
  console.log("19. Protected header keys:", protectedKeys);
  // cbor-x decodes maps as plain objects by default; keys are strings
  // Check that the keys are "1" and "33" (string representations of integer keys)
  // or 1 and 33 (actual integers if Map)
  const hasAlgKey = protectedKeys.some(k => k === 1 || k === "1");
  const hasX5chainKey = protectedKeys.some(k => k === 33 || k === "33");
  if (!hasAlgKey) fail("Protected header missing key 1 (alg)");
  const algVal = protectedHeader instanceof Map ? protectedHeader.get(1) ?? protectedHeader.get("1") : protectedHeader[1] ?? protectedHeader["1"];
  if (algVal !== -7) fail(`alg should be -7, got ${algVal}`);
  if (!hasX5chainKey) fail("Protected header missing key 33 (x5chain)");
  console.log("20. Protected header has integer keys (1=alg=-7, 33=x5chain) ✓");

  // Verify unprotected header is a bare Map or empty object (no Tag 259)
  if (protectedHeader instanceof Map) {
    console.log("21. Unprotected header is Map ✓");
  } else if (typeof unprotectedHeader === "object" && unprotectedHeader !== null) {
    console.log("21. Unprotected header is plain object (cbor-x default) ✓");
  } else {
    fail("Unprotected header should be a Map or object");
  }

  // Verify payload matches claim
  if (!bytesEqual(payloadBstr, claimCbor.payload)) fail("COSE payload does not match claim bytes");
  console.log("22. Payload matches claim bytes ✓");

  // Verify signature is 64 bytes
  if (signatureBstr.length !== 64) fail(`ES256 signature should be 64 bytes, got ${signatureBstr.length}`);
  console.log("23. Signature is 64 bytes (ES256) ✓");

  // Verify signature cryptographically
  // Use buildSigStructure from cose.ts (same encoder used during signing)
  const phCopy = new Uint8Array(protectedHeaderBstr.length);
  phCopy.set(protectedHeaderBstr);
  const plCopy = new Uint8Array(payloadBstr.length);
  plCopy.set(payloadBstr);
  const sigStructureRaw = buildSigStructure(phCopy, plCopy);
  // Copy into standalone ArrayBuffer — cbor-x returns a Buffer that may be
  // a view into a larger underlying ArrayBuffer, which causes crypto.subtle
  // to hash extra trailing bytes.
  const sigStructure = new Uint8Array(sigStructureRaw.length);
  sigStructure.set(sigStructureRaw);

  const sigCopy = new Uint8Array(signatureBstr.length);
  sigCopy.set(signatureBstr);

  // Node.js 26 WebCrypto ECDSA verify is broken (returns false even for
  // valid signatures). Use native crypto.verify with DER-encoded signature.
  const { createVerify } = await import("node:crypto");

  // Convert raw r||s (64 bytes) to DER-encoded signature for native crypto
  function rawToDer(raw) {
    const r = raw.subarray(0, 32);
    const s = raw.subarray(32, 64);
    function encodeInt(val) {
      // Prepend 0x00 if high bit set (positive integer)
      let bytes = [...val];
      if (bytes[0] & 0x80) bytes.unshift(0);
      // Remove leading zeros
      while (bytes.length > 1 && bytes[0] === 0 && !(bytes[1] & 0x80)) bytes.shift();
      const len = bytes.length;
      return [0x02, len, ...bytes];
    }
    const rDer = encodeInt(r);
    const sDer = encodeInt(s);
    const seqLen = rDer.length + sDer.length;
    return Buffer.from([0x30, seqLen, ...rDer, ...sDer]);
  }

  // Export public key to PEM
  const pubKeyDer = await crypto.subtle.exportKey("spki", keyPair.publicKey);
  const pubKeyPem = `-----BEGIN PUBLIC KEY-----\n${Buffer.from(pubKeyDer).toString("base64")}\n-----END PUBLIC KEY-----`;
  const pubKey = createPublicKey(pubKeyPem);

  // Verify using native crypto
  const verifier = createVerify("sha256");
  verifier.update(Buffer.from(sigStructure));
  const derSig = rawToDer(sigCopy);
  const isValid = verifier.verify(pubKey, derSig);
  if (!isValid) fail("Cryptographic signature verification FAILED");
  console.log("24. Cryptographic signature verification PASSED ✓");

  console.log("\n=== ALL CHECKS PASSED ===");
  console.log("C2PA manifest is spec-compliant per C2PA 2.4 v1 claim-map schema.");
}

main().catch(err => {
  console.error("ERROR:", err);
  process.exit(1);
});
