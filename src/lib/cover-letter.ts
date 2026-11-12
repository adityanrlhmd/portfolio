import { z } from 'zod';

import { ADITYA_RESUME } from './aditya';
import { LOCALES, type Lang, translations } from './i18n';
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

// Sample content the preview shows, faded, for fields the visitor hasn't filled yet,
// in the PDF's language.
export const PLACEHOLDER_COVER_LETTER = translations<CoverLetter>(
  {
    name: 'Your Name',
    email: 'you@example.com',
    phone: '+62 812 3456 7890',
    location: 'City, Country',
    date: 'January 1, 2026',
    recipient: 'Hiring Manager',
    company: 'Company Name',
    role: 'Job Title',
    body: "Open with the role you're applying for and why this company caught your eye.\n\nPick one or two things you've built or improved that match what they need, with results if you have them.\n\nClose by saying you'd love to talk, and thank them for their time.",
  },
  {
    name: 'Nama Kamu',
    email: 'kamu@contoh.com',
    phone: '+62 812 3456 7890',
    location: 'Kota, Negara',
    date: '1 Januari 2026',
    recipient: 'Bapak/Ibu HRD',
    company: 'Nama Perusahaan',
    role: 'Nama Posisi',
    body: 'Buka dengan posisi yang kamu lamar dan alasan perusahaan ini menarik perhatianmu.\n\nPilih satu atau dua hal yang pernah kamu bangun atau perbaiki yang sesuai dengan kebutuhan mereka, sertakan hasilnya kalau ada.\n\nTutup dengan menyampaikan bahwa kamu ingin berdiskusi lebih lanjut, dan ucapkan terima kasih atas waktunya.',
  }
);

// Company and recipient stay empty, since they depend on where the visitor is applying.
export const ADITYA_COVER_LETTER: Omit<CoverLetter, 'date'> = {
  name: ADITYA_RESUME.name,
  email: ADITYA_RESUME.email,
  phone: ADITYA_RESUME.phone,
  // the resume's "open to remote" note reads oddly in a letterhead; the closing says it instead
  location: 'Sukabumi, Indonesia',
  recipient: '',
  company: '',
  role: 'Frontend Engineer',
  body: [
    "I'm a Frontend Engineer with 5+ years of building web and mobile apps with React, Next.js, and React Native. Right now I build the order and contract flows of a national e-procurement platform at GovTech Procurement, and I'd love to bring that experience to your team.",
    'Along the way I set up a core banking frontend from scratch at Bank Jakarta, and built micro frontends, a document management system, and real-time chat at eDOT. I like owning features end to end, from the design handoff to the edge cases in production, and keeping big codebases easy for the next person to work on.',
    "I'm based in Sukabumi and open to remote work or relocation. I'd be glad to talk about how I can help. Thank you for your time and consideration.",
  ].join('\n\n'),
};

// today, written the way a letter in that language dates itself
export const today = (lang: Lang) =>
  new Date().toLocaleDateString(LOCALES[lang], { dateStyle: 'long' });

// A new letter starts with today's date and the sender details from the saved resume, if any.
export const newCoverLetter = (lang: Lang = 'en'): CoverLetter => {
  const resume = loadResume();
  return {
    name: resume?.name ?? '',
    email: resume?.email ?? '',
    phone: resume?.phone ?? '',
    location: resume?.location ?? '',
    date: today(lang),
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

const EMAIL = translations(
  {
    subject: (role: string, name: string) =>
      `Application for ${role} – ${name}`,
    greeting: (recipient: string) => `Dear ${recipient},`,
    team: (company: string) => `${company} Hiring Team`,
    intro: (name: string, role: string, company: string) =>
      `My name is ${name}, and I'd like to apply for the ${role} position${company && ` at ${company}`}.`,
    cvAttached: 'My CV is attached for your review.',
    pitch: 'I believe my experience is a good match for what this role needs.',
    attached:
      "I've attached the following for your review:\n- CV\n- Cover letter",
    outro: (company: string) =>
      `I'd welcome the chance to talk about how I can contribute to ${company || 'your team'}. Thank you for your time and consideration, and I look forward to hearing from you.`,
    closing: 'Best regards,',
  },
  {
    subject: (role: string, name: string) => `Lamaran ${role} – ${name}`,
    greeting: (recipient: string) => `Yth. ${recipient},\n\nDengan hormat,`,
    team: (company: string) => `Tim HRD ${company}`,
    intro: (name: string, role: string, company: string) =>
      `Perkenalkan, saya ${name}. Melalui email ini, saya ingin mengajukan lamaran untuk posisi ${role}${company && ` di ${company}`}.`,
    cvAttached:
      'CV saya lampirkan bersama email ini sebagai bahan pertimbangan.',
    pitch: 'Saya yakin pengalaman saya sesuai dengan kebutuhan posisi ini.',
    attached:
      'Sebagai bahan pertimbangan, bersama email ini saya lampirkan:\n- CV\n- Surat lamaran',
    outro: (company: string) =>
      `Saya berharap dapat diberi kesempatan wawancara untuk menjelaskan lebih lanjut kontribusi yang bisa saya berikan${company && ` untuk ${company}`}. Atas waktu dan perhatian Bapak/Ibu, saya ucapkan terima kasih.`,
    closing: 'Hormat saya,',
  }
);

// The links of whichever resume belongs to the sender: the visitor's saved one, or Aditya's
// after "Fill with Aditya's data". A name that matches neither gets no links.
export const signatureLinks = (name: string) =>
  [loadResume(), ADITYA_RESUME].find(
    resume => resume && resume.name.trim() === name.trim()
  )?.links ?? '';

// The email the CV goes with. By default the letter is attached too and the email borrows its
// first paragraph as the pitch; with `inline`, the whole letter is the email and only the CV
// is attached. Empty fields show the placeholder so the visitor sees what is missing, except
// the company, which is simply left out (not every application names one).
export const applicationEmail = (
  letter: CoverLetter,
  lang: Lang,
  { inline = false, links = '' } = {}
) => {
  const t = EMAIL[lang];
  const p = PLACEHOLDER_COVER_LETTER[lang];
  const take = (key: keyof CoverLetter) => letter[key].trim() || p[key];
  const company = letter.company.trim();
  const letterParagraphs = paragraphs(letter.body);
  const intro = t.intro(take('name'), take('role'), company);
  // a written letter already closes with its own thanks
  const fullLetter = inline && letterParagraphs.length > 0;

  return {
    subject: t.subject(take('role'), take('name')),
    body: [
      t.greeting(
        letter.recipient.trim() || (company ? t.team(company) : p.recipient)
      ),
      ...(fullLetter
        ? [`${intro} ${t.cvAttached}`, ...letterParagraphs]
        : [
            intro,
            letterParagraphs[0] ?? t.pitch,
            inline ? t.cvAttached : t.attached,
            t.outro(company),
          ]),
      [t.closing, take('name'), letter.phone, letter.email, links]
        .map(line => line.trim())
        .filter(Boolean)
        .join('\n'),
    ].join('\n\n'),
  };
};
