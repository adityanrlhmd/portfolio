import { decodeDataFromPdf, encodeData } from '../pdf-data';
import { type Resume, resumeSchema } from './schema';

// The photo is left out to keep the PDF small; the user re-adds it after import.
export const encodeResume = (resume: Resume) =>
  encodeData('resume-data', { ...resume, photo: '' });

export const decodeResumeFromPdf = (bytes: ArrayBuffer) =>
  decodeDataFromPdf(bytes, 'resume-data', resumeSchema);
