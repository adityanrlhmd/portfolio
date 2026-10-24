import { downloadPdf } from '@/lib/download-pdf';
import type { Resume } from '@/lib/resume/schema';

import { ResumeDocument } from './resume-document';

export const downloadResume = (resume: Resume) =>
  downloadPdf(
    <ResumeDocument resume={resume} />,
    resume.name.trim() ? `${resume.name.trim()} - Resume.pdf` : 'Resume.pdf'
  );
