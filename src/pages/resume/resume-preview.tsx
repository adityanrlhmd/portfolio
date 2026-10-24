import { useMemo } from 'react';

import { PdfPreview } from '@/components/pdf-preview';

import { PLACEHOLDER_RESUME } from '@/lib/resume/placeholder';
import type { Resume } from '@/lib/resume/schema';

import { ResumeDocument } from './resume-document';

export const ResumePreview = ({ resume }: { resume: Resume }) => {
  const docs = useMemo(
    () => ({
      preview: (
        <ResumeDocument resume={resume} placeholder={PLACEHOLDER_RESUME} />
      ),
      // without placeholders, so the opened PDF matches the download
      document: <ResumeDocument resume={resume} />,
    }),
    [resume]
  );
  return <PdfPreview {...docs} label="Resume preview" />;
};
