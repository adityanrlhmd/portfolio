import { pdf } from '@react-pdf/renderer';

import type { Resume } from '@/lib/resume/schema';

import { ResumeDocument } from './resume-document';

export const downloadResume = async (resume: Resume) => {
  const blob = await pdf(<ResumeDocument resume={resume} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = resume.name.trim()
    ? `${resume.name.trim()} - Resume.pdf`
    : 'Resume.pdf';
  link.click();
  // some browsers start the download after click() returns
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
