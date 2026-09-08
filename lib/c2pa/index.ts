/**
 * C2PA Content Credentials module.
 *
 * Provides cryptographically authenticated provenance for share-card images
 * using the C2PA (Content Credentials) standard. Manifests are embedded
 * into PNG images at creation time, signed with an ECDSA P-256 key, and
 * the signing certificate is included in the COSE_Sign1 protected header.
 *
 * @see https://c2pa.org/
 * @see https://spec.c2pa.org/
 */

export {
  signPngWithC2pa,
  type C2paSignerConfig,
  type C2paManifestInput,
} from "./manifest";
export { embedC2paInPng, extractC2paFromPng } from "./png";
export {
  buildClaim,
  buildActionsAssertion,
  buildHashDataAssertion,
  buildCreativeWorkAssertion,
  ASSERTION_LABELS,
  CLAIM_LABEL,
} from "./claim";
export { signCoseSign1, pemToDer, buildProtectedHeader, buildSigStructure } from "./cose";
export {
  buildSuperBox,
  buildDescriptionBox,
  buildCborBox,
  c2paUuid,
} from "./jumbf";
export { encode, sortedMap, toDeterministic } from "./cbor";
export { computeParamsHash } from "./share-pipeline";
