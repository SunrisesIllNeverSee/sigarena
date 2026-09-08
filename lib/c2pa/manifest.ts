/**
 * C2PA manifest store builder.
 *
 * Assembles the complete C2PA manifest store from assertions, claim, and
 * signature into a JUMBF superbox structure suitable for embedding into
 * a PNG (caBX chunk).
 *
 * Manifest store structure (C2PA spec 2.4 §4):
 *   jumb (superbox, UUID=c2pa, label="urn:c2pa:manifest_store")
 *     jumd (description box)
 *     jumb (manifest box, UUID=c2ma, label="urn:c2pa:manifest:default")
 *       jumd (description box)
 *       jumb (assertion store, UUID=c2as, label="c2pa.assertions")
 *         jumd (description box)
 *         jumb (assertion sub-box, label="c2pa.actions")
 *           cbor (assertion data)
 *         ...
 *       jumb (claim box, UUID=c2cl, label="c2pa.claim")
 *         jumd (description box)
 *         cbor (claim)
 *       jumb (signature box, UUID=c2cs, label="c2pa.signature")
 *         jumd (description box)
 *         cbor (COSE_Sign1_Tagged)
 *
 * JUMBF URIs in the claim reference boxes by their label. The URI
 * `self#jumbf=c2pa.assertions/c2pa.actions` navigates:
 *   1. Find the box labeled "c2pa.assertions" in the manifest store
 *   2. Within it, find the sub-box labeled "c2pa.actions"
 *
 * Therefore, the JUMBF box labels MUST match the URI path segments.
 */

import {
  CAI_BLOCK_UUID,
  CAI_MANIFEST_UUID,
  CAI_ASSERTION_STORE_UUID,
  CAI_CLAIM_UUID,
  CAI_SIGNATURE_UUID,
  buildSuperBox,
  buildSuperBoxFromDesc,
  buildDescriptionBox,
  buildCborBox,
} from "./jumbf";
import {
  buildClaim,
  buildActionsAssertion,
  buildHashDataAssertion,
  buildCreativeWorkAssertion,
  sha256,
  hashedUri,
  CLAIM_LABEL,
} from "./claim";
import { signCoseSign1, pemToDer } from "./cose";
import { embedC2paInPng } from "./png";
import { encode, toDeterministic } from "./cbor";

/** Manifest store label (C2PA namespace). */
const MANIFEST_STORE_LABEL = "urn:c2pa:manifest_store";

/** Manifest label (must be a URN per C2PA spec). */
const MANIFEST_LABEL = "urn:c2pa:manifest:default";

/** Assertion store label — matches URI path segment in self#jumbf=c2pa.assertions. */
const ASSERTIONS_LABEL = "c2pa.assertions";

/** Signature label — matches URI path segment in self#jumbf=c2pa.signature. */
const SIGNATURE_LABEL = "c2pa.signature";

/** Assertion URI prefix — references the assertion store by its label. */
const ASSERTION_URI_PREFIX = "self#jumbf=c2pa.assertions";

/** Signature URI — references the signature box by its label. */
const SIGNATURE_URI = "self#jumbf=c2pa.signature";

/** Hash algorithm used for all C2PA hashes. */
const HASH_ALG = "sha256";

export interface C2paSignerConfig {
  /** PEM-encoded ECDSA P-256 private key. */
  signingKey: string;
  /** PEM-encoded X.509 certificate (leaf certificate). */
  signingCert: string;
}

export interface C2paManifestInput {
  /** Claim generator identifier (e.g., "SigRank/1.0.0"). */
  claimGenerator: string;
  /** Claim generator info (name + version). */
  claimGeneratorInfo: Array<{ name: string; version: string }>;
  /** Creator info for the creative.work assertion. */
  creator: {
    name: string;
    identifier?: string;
  };
  /** Tool info for the creative.work assertion. */
  tool: {
    name: string;
    version: string;
  };
  /** Actions to include in the c2pa.actions assertion. */
  actions: Array<Record<string, unknown>>;
  /** Asset format (MIME type, e.g., "image/png"). */
  assetFormat: string;
  /** Unique identifier for this version of the asset. */
  instanceId: string;
}

/**
 * Build an assertion sub-box: a jumb superbox containing a cbor box.
 * Each assertion in the assertion store is wrapped in its own jumb box
 * identified by the assertion label (which matches the URI path segment).
 */
function buildAssertionSubBox(label: string, cborData: Uint8Array): Uint8Array {
  const cborBox = buildCborBox(cborData);
  // Use a zero UUID for assertion sub-boxes (the label identifies the type)
  const zeroUuid = new Uint8Array(16);
  const descBox = buildDescriptionBox(zeroUuid, label);
  return buildSuperBoxFromDesc(descBox, [cborBox]);
}

/**
 * Build a complete C2PA manifest store and embed it into a PNG image.
 *
 * @param pngBytes - The original PNG image bytes
 * @param input - Manifest input data
 * @param signer - Signing key and certificate
 * @returns The PNG bytes with the C2PA manifest embedded
 */
export async function signPngWithC2pa(
  pngBytes: Uint8Array,
  input: C2paManifestInput,
  signer: C2paSignerConfig,
): Promise<Uint8Array> {
  // 1. Compute the asset hash (hard binding)
  const assetHash = await sha256(pngBytes);

  // 2. Build assertions (data only — labels go in JUMBF description boxes)
  const actionsAssertion = buildActionsAssertion(input.actions);
  const hashDataAssertion = buildHashDataAssertion(assetHash, "jumbf manifest");
  const creativeWorkAssertion = buildCreativeWorkAssertion(
    input.creator,
    input.tool,
  );

  // 3. Encode assertions as CBOR (deterministic encoding).
  // toDeterministic recursively sorts all nested plain-object keys so the
  // assertion encoding complies with RFC 8949 §4.2.1.
  const actionsCbor = encode(toDeterministic(actionsAssertion));
  const hashDataCbor = encode(toDeterministic(hashDataAssertion));
  const creativeWorkCbor = encode(toDeterministic(creativeWorkAssertion));

  // 4. Compute assertion hashes (for the claim's assertion references)
  const actionsHash = await sha256(actionsCbor);
  const hashDataHash = await sha256(hashDataCbor);
  const creativeWorkHash = await sha256(creativeWorkCbor);

  // 5. Build assertion references for the claim (hashed-uri maps).
  // The URI path must match the JUMBF box labels: c2pa.assertions/<label>
  const assertionRefs = [
    hashedUri(`${ASSERTION_URI_PREFIX}/c2pa.actions`, actionsHash, HASH_ALG),
    hashedUri(`${ASSERTION_URI_PREFIX}/c2pa.hash.data`, hashDataHash, HASH_ALG),
    hashedUri(`${ASSERTION_URI_PREFIX}/stds.schemaorg.CreativeWork`, creativeWorkHash, HASH_ALG),
  ];

  // 6. Build the claim (v1 claim-map schema)
  const claimBytes = buildClaim(
    input.claimGenerator,
    input.claimGeneratorInfo,
    assertionRefs,
    SIGNATURE_URI,
    input.assetFormat,
    input.instanceId,
    HASH_ALG,
  );

  // 7. Sign the claim with COSE_Sign1
  const certDer = pemToDer(signer.signingCert);
  const coseSign1Tagged = await signCoseSign1(
    claimBytes,
    signer.signingKey,
    [certDer],
  );

  // 8. Build the assertion store (jumb superbox with assertion sub-boxes).
  // The assertion store label "c2pa.assertions" matches the URI path segment.
  const assertionStoreBox = buildSuperBox(
    CAI_ASSERTION_STORE_UUID,
    ASSERTIONS_LABEL,
    [
      buildAssertionSubBox("c2pa.actions", actionsCbor),
      buildAssertionSubBox("c2pa.hash.data", hashDataCbor),
      buildAssertionSubBox("stds.schemaorg.CreativeWork", creativeWorkCbor),
    ],
  );

  // 9. Build the claim box (contains the claim as a cbor box).
  // The claim label "c2pa.claim" is the v1 claim label.
  const claimBox = buildSuperBox(CAI_CLAIM_UUID, CLAIM_LABEL, [
    buildCborBox(claimBytes),
  ]);

  // 10. Build the signature box (contains the COSE_Sign1 as a cbor box).
  // The signature label "c2pa.signature" matches the URI path segment.
  const signatureBox = buildSuperBox(CAI_SIGNATURE_UUID, SIGNATURE_LABEL, [
    buildCborBox(coseSign1Tagged),
  ]);

  // 11. Build the manifest box (contains assertion store + claim + signature)
  const manifestBox = buildSuperBox(CAI_MANIFEST_UUID, MANIFEST_LABEL, [
    assertionStoreBox,
    claimBox,
    signatureBox,
  ]);

  // 12. Build the manifest store (top-level jumb superbox)
  const manifestStore = buildSuperBox(CAI_BLOCK_UUID, MANIFEST_STORE_LABEL, [
    manifestBox,
  ]);

  // 13. Embed into PNG
  return embedC2paInPng(pngBytes, manifestStore);
}
