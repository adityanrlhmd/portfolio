import type { ZodType } from 'zod';

// Stored in the PDF's Subject as `<prefix>:<base64 JSON>`, so a PDF made here can be imported back.
export const encodeData = (prefix: string, data: unknown) => {
  const utf8 = new TextEncoder().encode(JSON.stringify(data));
  return `${prefix}:${btoa(Array.from(utf8, b => String.fromCharCode(b)).join(''))}`;
};

// react-pdf writes the Subject as an uncompressed literal string, so a regex finds it.
export const decodeDataFromPdf = <T>(
  bytes: ArrayBuffer,
  prefix: string,
  schema: ZodType<T>
): T | null => {
  const match = new TextDecoder('latin1')
    .decode(bytes)
    .match(new RegExp(`\\(${prefix}:([A-Za-z0-9+/=]+)\\)`));
  if (!match) return null;
  try {
    const binary = atob(match[1]);
    const utf8 = Uint8Array.from(binary, char => char.charCodeAt(0));
    const parsed = schema.safeParse(JSON.parse(new TextDecoder().decode(utf8)));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
};
