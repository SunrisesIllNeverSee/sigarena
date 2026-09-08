/**
 * PNG C2PA embedding.
 *
 * C2PA stores the manifest store as the data of a single `caBX` chunk,
 * inserted before `IEND`. The PNG format is:
 *   signature (8 bytes) + chunks (length(4 BE) | type(4) | data | crc(4))
 *
 * The CRC covers the type and data fields (ISO 3309 / zlib CRC-32).
 */

/** PNG signature bytes. */
const PNG_SIGNATURE = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

/** caBX chunk type. */
const TYPE_CABX = new Uint8Array([0x63, 0x61, 0x42, 0x58]); // "caBX"

/** IEND chunk type. */
const TYPE_IEND = new Uint8Array([0x49, 0x45, 0x4e, 0x44]); // "IEND"

/** Compute CRC-32 (ISO 3309 / zlib). */
function crc32(data: Uint8Array): Uint8Array {
  // CRC-32 table
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      if (c & 1) {
        c = 0xedb88320 ^ (c >>> 1);
      } else {
        c = c >>> 1;
      }
    }
    table[n] = c;
  }

  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = table[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  crc = (crc ^ 0xffffffff) >>> 0;

  const result = new Uint8Array(4);
  result[0] = (crc >>> 24) & 0xff;
  result[1] = (crc >>> 16) & 0xff;
  result[2] = (crc >>> 8) & 0xff;
  result[3] = crc & 0xff;
  return result;
}

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
function concat(...arrays: Uint8Array[]): Uint8Array {
  const total = arrays.reduce((sum, a) => sum + a.length, 0);
  const result = new Uint8Array(total);
  let offset = 0;
  for (const a of arrays) {
    result.set(a, offset);
    offset += a.length;
  }
  return result;
}

/**
 * Insert a C2PA manifest store into a PNG file as a `caBX` chunk.
 *
 * The chunk is inserted immediately before the `IEND` chunk. If a `caBX`
 * chunk already exists, it is replaced.
 *
 * @param pngBytes - The original PNG file bytes
 * @param manifestStore - The JUMBF manifest store bytes
 * @returns The PNG bytes with the caBX chunk inserted
 */
export function embedC2paInPng(
  pngBytes: Uint8Array,
  manifestStore: Uint8Array,
): Uint8Array {
  // Verify PNG signature
  if (pngBytes.length < 8 || !pngBytes.subarray(0, 8).every((b, i) => b === PNG_SIGNATURE[i])) {
    throw new Error("Invalid PNG: missing or incorrect signature");
  }

  // Build the caBX chunk: length(4) + type(4) + data + crc(4)
  const chunkTypeAndData = concat(TYPE_CABX, manifestStore);
  const crc = crc32(chunkTypeAndData);
  const cabxChunk = concat(
    writeU32BE(manifestStore.length),
    chunkTypeAndData,
    crc,
  );

  // Walk the chunks to find IEND, skipping any existing caBX
  const chunks: Uint8Array[] = [];
  let offset = 8; // skip signature
  let foundIend = false;

  while (offset < pngBytes.length) {
    if (offset + 8 > pngBytes.length) {
      throw new Error("Invalid PNG: truncated chunk header");
    }

    // Use unsigned right shift to avoid signed 32-bit interpretation for
    // chunk lengths above 2 GiB (extremely rare, but spec-legal).
    const length = ((pngBytes[offset] << 24) |
      (pngBytes[offset + 1] << 16) |
      (pngBytes[offset + 2] << 8) |
      pngBytes[offset + 3]) >>> 0;
    const type = pngBytes.subarray(offset + 4, offset + 8);
    const totalChunkSize = 12 + length; // length(4) + type(4) + data(length) + crc(4)

    if (offset + totalChunkSize > pngBytes.length) {
      throw new Error("Invalid PNG: chunk length exceeds file bounds");
    }

    // Skip existing caBX chunks (we replace them)
    if (type[0] === TYPE_CABX[0] && type[1] === TYPE_CABX[1] &&
        type[2] === TYPE_CABX[2] && type[3] === TYPE_CABX[3]) {
      offset += totalChunkSize;
      continue;
    }

    // Check if this is IEND
    const isIend = type[0] === TYPE_IEND[0] && type[1] === TYPE_IEND[1] &&
      type[2] === TYPE_IEND[2] && type[3] === TYPE_IEND[3];

    if (isIend) {
      // Insert caBX before IEND
      chunks.push(cabxChunk);
      foundIend = true;
    }

    // Copy the chunk as-is
    chunks.push(pngBytes.subarray(offset, offset + totalChunkSize));
    offset += totalChunkSize;
  }

  if (!foundIend) {
    throw new Error("Invalid PNG: no IEND chunk found");
  }

  // Reassemble: signature + chunks
  return concat(PNG_SIGNATURE, ...chunks);
}

/**
 * Extract the C2PA manifest store from a PNG file (caBX chunk).
 * Returns null if no caBX chunk is present.
 */
export function extractC2paFromPng(pngBytes: Uint8Array): Uint8Array | null {
  // Verify PNG signature
  if (pngBytes.length < 8 || !pngBytes.subarray(0, 8).every((b, i) => b === PNG_SIGNATURE[i])) {
    return null;
  }

  let offset = 8;
  while (offset < pngBytes.length) {
    if (offset + 8 > pngBytes.length) break;

    // Use unsigned right shift to avoid signed 32-bit interpretation for
    // chunk lengths above 2 GiB (consistent with embedC2paInPng).
    const length = ((pngBytes[offset] << 24) |
      (pngBytes[offset + 1] << 16) |
      (pngBytes[offset + 2] << 8) |
      pngBytes[offset + 3]) >>> 0;
    const type = pngBytes.subarray(offset + 4, offset + 8);
    const totalChunkSize = 12 + length;

    if (offset + totalChunkSize > pngBytes.length) break;

    if (type[0] === TYPE_CABX[0] && type[1] === TYPE_CABX[1] &&
        type[2] === TYPE_CABX[2] && type[3] === TYPE_CABX[3]) {
      return pngBytes.subarray(offset + 8, offset + 8 + length);
    }

    offset += totalChunkSize;
  }

  return null;
}
