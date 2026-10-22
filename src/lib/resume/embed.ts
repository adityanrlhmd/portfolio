import { type Resume, resumeSchema } from './schema';

const PREFIX = 'resume-data:';

// The photo is left out to keep the PDF small; the user re-adds it after import.
export const encodeResume = (resume: Resume) => {
  const utf8 = new TextEncoder().encode(
    JSON.stringify({ ...resume, photo: '' })
  );
  return PREFIX + btoa(Array.from(utf8, b => String.fromCharCode(b)).join(''));
};

// react-pdf writes the Subject as an uncompressed literal string, so a regex finds it.
export const decodeResumeFromPdf = (bytes: ArrayBuffer): Resume | null => {
  const match = new TextDecoder('latin1')
    .decode(bytes)
    .match(/\(resume-data:([A-Za-z0-9+/=]+)\)/);
  if (!match) return null;
  try {
    const binary = atob(match[1]);
    const utf8 = Uint8Array.from(binary, char => char.charCodeAt(0));
    const parsed = resumeSchema.safeParse(
      JSON.parse(new TextDecoder().decode(utf8))
    );
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
};
