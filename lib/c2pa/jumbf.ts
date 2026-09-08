/**
 * JUMBF box construction (ISO/IEC 19566-5:2019, Annex A).
 *
 * JUMBF boxes are the outer container for C2PA manifest stores. Each box is:
 *   LBox (4 bytes, big-endian uint32)  — total box size including LBox+TBox
 *   TBox (4 bytes, ASCII)              — box type
 *   Payload                            — box content (length = LBox - 8)
 *
 * A JUMBF superbox (type "jumb") contains a description box (type "jumd")
 * followed by zero or more data boxes.
 */

/** C2PA UUID suffix — the first 4 bytes name the box role. */
const C2PA_SUFFIX = new Uint8Array([
  0x00, 0x11, 0x00, 0x10, 0x80, 0x00, 0x00, 0xaa, 0x00, 0x38, 0x9b, 0x71,
]);

/** Construct a 16-byte C2PA UUID from a 4-byte role. */
export function c2paUuid(role: [number, number, number, number]): Uint8Array {
  const uuid = new Uint8Array(16);
  uuid[0] = role[0];
  uuid[1] = role[1];
  uuid[2] = role[2];
  uuid[3] = role[3];
  uuid.set(C2PA_SUFFIX, 4);
  return uuid;
}

// C2PA role constants (4-byte ASCII → byte values)
export const CAI_MANIFEST_UUID = c2paUuid([0x63, 0x32, 0x6d, 0x61]); // "c2ma"
export const CAI_ASSERTION_STORE_UUID = c2paUuid([0x63, 0x32, 0x61, 0x73]); // "c2as"
export const CAI_BLOCK_UUID = c2paUuid([0x63, 0x32, 0x70, 0x61]); // "c2pa"
export const CAI_CLAIM_UUID = c2paUuid([0x63, 0x32, 0x63, 0x6c]); // "c2cl"
export const CAI_SIGNATURE_UUID = c2paUuid([0x63, 0x32, 0x63, 0x73]); // "c2cs"

/** Write a big-endian uint32. */
function writeU32BE(value: number): Uint8Array {
  const buf = new Uint8Array(4);
  buf[0] = (value >>> 24) & 0xff;
  buf[1] = (value >>> 16) & 0xff;
  buf[2] = (value >>> 8) & 0xff;
  buf[3] = value & 0xff;
  return buf;
}

/** Concatenate multiple Uint8Arrays. */
export function concat(...arrays: Uint8Array[]): Uint8Array {
  const total = arrays.reduce((sum, a) => sum + a.length, 0);
  const result = new Uint8Array(total);
  let offset = 0;
  for (const a of arrays) {
    result.set(a, offset);
    offset += a.length;
  }
  return result;
}

/** Build a JUMBF box with the given 4-byte type and payload. */
export function buildBox(type: string, payload: Uint8Array): Uint8Array {
  const typeBytes = new Uint8Array(4);
  for (let i = 0; i < 4; i++) typeBytes[i] = type.charCodeAt(i);
  const length = 8 + payload.length;
  return concat(writeU32BE(length), typeBytes, payload);
}

/** Build a JUMBF description box (jumd). */
export function buildDescriptionBox(
  uuid: Uint8Array,
  label: string,
): Uint8Array {
  // UUID (16 bytes) + toggles (1 byte) + label (null-terminated string)
  const toggles = 0x03; // Requestable + Label Present
  const labelBytes = new TextEncoder().encode(label + "\0");
  const payload = concat(uuid, new Uint8Array([toggles]), labelBytes);
  return buildBox("jumd", payload);
}

/** Build a JUMBF CBOR content box. */
export function buildCborBox(cborData: Uint8Array): Uint8Array {
  return buildBox("cbor", cborData);
}

/** Build a JUMBF superbox (jumb) with a description box and data boxes. */
export function buildSuperBox(
  uuid: Uint8Array,
  label: string,
  dataBoxes: Uint8Array[],
): Uint8Array {
  const descBox = buildDescriptionBox(uuid, label);
  const payload = concat(descBox, ...dataBoxes);
  return buildBox("jumb", payload);
}

/** Build a JUMBF superbox from a pre-built description box and data boxes. */
export function buildSuperBoxFromDesc(
  descBox: Uint8Array,
  dataBoxes: Uint8Array[],
): Uint8Array {
  const payload = concat(descBox, ...dataBoxes);
  return buildBox("jumb", payload);
}
