import type { Resume } from './schema';

// Sample content the preview shows, faded, for blocks the visitor hasn't filled yet.
export const PLACEHOLDER_RESUME: Resume = {
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
};
