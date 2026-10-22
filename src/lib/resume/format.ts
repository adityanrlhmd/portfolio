import type { Resume } from './schema';

export const splitLines = (text: string) =>
  text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

export const contactItems = (resume: Resume) => {
  const items: { text: string; href: string }[] = [];
  const phone = resume.phone.trim();
  const email = resume.email.trim();
  if (phone)
    items.push({ text: phone, href: `tel:${phone.replace(/\s/g, '')}` });
  if (email) items.push({ text: email, href: `mailto:${email}` });
  for (const link of splitLines(resume.links)) {
    items.push({
      text: link,
      href: link.startsWith('http') ? link : `https://${link}`,
    });
  }
  return items;
};

export const skillLines = (text: string) =>
  splitLines(text).map(line => {
    const colon = line.indexOf(':');
    return colon === -1
      ? { category: '', items: line }
      : {
          category: line.slice(0, colon).trim(),
          items: line.slice(colon + 1).trim(),
        };
  });
