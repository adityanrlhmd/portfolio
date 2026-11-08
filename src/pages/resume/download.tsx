import { downloadPdf } from '@/lib/download-pdf';
import type { Lang } from '@/lib/i18n';
import type { Resume } from '@/lib/resume/schema';

import { RESUME_PDF, ResumeDocument } from './resume-document';

export const downloadResume = (resume: Resume, lang: Lang = 'en') => {
  const title = RESUME_PDF[lang].title;
  return downloadPdf(
    <ResumeDocument resume={resume} lang={lang} />,
    resume.name.trim() ? `${resume.name.trim()} - ${title}.pdf` : `${title}.pdf`
  );
};
