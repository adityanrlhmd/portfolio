import { translations } from '../i18n';
import type { Resume } from './schema';

// Sample content the preview shows, faded, for blocks the visitor hasn't filled yet,
// in the PDF's language.
export const PLACEHOLDER_RESUME = translations<Resume>(
  {
    name: 'Your Name',
    phone: '+62 812 3456 7890',
    email: 'you@example.com',
    location: 'City, Country',
    links: 'linkedin.com/in/yourname\ngithub.com/yourname',
    summary:
      'A short summary of who you are, what you are good at, and what you are looking for next.',
    photo: '',
    skills: 'Languages: TypeScript, JavaScript\nFrameworks: React, Next.js',
    achievements: 'Certification or award - Issuer, Year',
    experiences: [
      {
        company: 'Company Name',
        location: 'City, Country',
        duration: 'Jan 2024 - Present',
        role: 'Job Title',
        description: '',
        bullets:
          'What you built or improved, and what changed because of it.\nAnother result, with numbers if you have them.',
      },
    ],
    educations: [
      {
        school: 'University Name',
        location: 'City, Country',
        duration: '2018 - 2022',
        degree: "Bachelor's Degree in Your Major",
      },
    ],
  },
  {
    name: 'Nama Kamu',
    phone: '+62 812 3456 7890',
    email: 'kamu@contoh.com',
    location: 'Kota, Negara',
    links: 'linkedin.com/in/namakamu\ngithub.com/namakamu',
    summary:
      'Ringkasan singkat tentang siapa kamu, keahlianmu, dan apa yang kamu cari selanjutnya.',
    photo: '',
    skills: 'Bahasa: TypeScript, JavaScript\nFramework: React, Next.js',
    achievements: 'Sertifikasi atau penghargaan - Penerbit, Tahun',
    experiences: [
      {
        company: 'Nama Perusahaan',
        location: 'Kota, Negara',
        duration: 'Jan 2024 - Sekarang',
        role: 'Jabatan',
        description: '',
        bullets:
          'Apa yang kamu bangun atau perbaiki, dan apa dampaknya.\nHasil lainnya, sertakan angka kalau ada.',
      },
    ],
    educations: [
      {
        school: 'Nama Universitas',
        location: 'Kota, Negara',
        duration: '2018 - 2022',
        degree: 'Sarjana Jurusan Kamu',
      },
    ],
  }
);
