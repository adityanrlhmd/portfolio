import { z } from 'zod';

import { ADITYA_RESUME } from './aditya';
import { decodeDataFromPdf, encodeData } from './pdf-data';
import { loadResume } from './resume/storage';
import { loadStored, saveStored } from './storage';

// body holds paragraphs separated by a blank line
export const coverLetterSchema = z.object({
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string(),
  date: z.string(),
  recipient: z.string(),
  company: z.string(),
  role: z.string(),
  body: z.string(),
});

export type CoverLetter = z.infer<typeof coverLetterSchema>;

export const STORAGE_KEY = 'cover-letter:v1';

// Sample content the preview shows, faded, for fields the visitor hasn't filled yet.
export const PLACEHOLDER_COVER_LETTER: CoverLetter = {
  name: 'Your Name',
  email: 'you@example.com',
  phone: '+62 812 3456 7890',
  location: 'City, Country',
  date: 'January 1, 2026',
  recipient: 'Hiring Manager',
  company: 'Company Name',
  role: 'Job Title',
  body: "Open with the role you're applying for and why this company caught your eye.\n\nPick one or two things you've built or improved that match what they need, with results if you have them.\n\nClose by saying you'd love to talk, and thank them for their time.",
};

// Company and recipient stay empty, since they depend on where the visitor is applying.
export const ADITYA_COVER_LETTER: Omit<CoverLetter, 'date'> = {
  name: ADITYA_RESUME.name,
  email: ADITYA_RESUME.email,
  phone: ADITYA_RESUME.phone,
  location: ADITYA_RESUME.location,
  recipient: '',
  company: '',
  role: 'Frontend Engineer',
  body: [
    "I'm a Frontend Engineer with 5+ years of building web and mobile apps with React, Next.js, and React Native. Right now I build the order and contract flows of a national e-procurement platform at GovTech Procurement, and I'd love to bring that experience to your team.",
    'Along the way I set up a core banking frontend from scratch at Bank Jakarta, and built micro frontends, a document management system, and real-time chat at eDOT. I like owning features end to end, from the design handoff to the edge cases in production, and keeping big codebases easy for the next person to work on.',
    "I'd be glad to talk about how I can help. Thank you for your time and consideration.",
  ].join('\n\n'),
};

// A new letter starts with today's date and the sender details from the saved resume, if any.
export const newCoverLetter = (): CoverLetter => {
  const resume = loadResume();
  return {
    name: resume?.name ?? '',
    email: resume?.email ?? '',
    phone: resume?.phone ?? '',
    location: resume?.location ?? '',
    date: new Date().toLocaleDateString('en-US', { dateStyle: 'long' }),
    recipient: '',
    company: '',
    role: '',
    body: '',
  };
};

export const loadCoverLetter = () => loadStored(STORAGE_KEY, coverLetterSchema);

export const saveCoverLetter = (letter: CoverLetter) =>
  saveStored(STORAGE_KEY, letter);

export const encodeCoverLetter = (letter: CoverLetter) =>
  encodeData('cover-letter-data', letter);

export const decodeCoverLetterFromPdf = (bytes: ArrayBuffer) =>
  decodeDataFromPdf(bytes, 'cover-letter-data', coverLetterSchema);

export const paragraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean);
