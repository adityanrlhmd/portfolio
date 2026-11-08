import { useMemo } from 'react';

import { useT } from '@/components/language-provider';
import { PdfPreview } from '@/components/pdf-preview';

import { type Lang, translations } from '@/lib/i18n';
import { PLACEHOLDER_RESUME } from '@/lib/resume/placeholder';
import type { Resume } from '@/lib/resume/schema';

import { ResumeDocument } from './resume-document';

const T = translations({ label: 'Resume preview' }, { label: 'Preview CV' });

export const ResumePreview = ({
  resume,
  lang = 'en',
}: {
  resume: Resume;
  // the PDF's language, not the site's
  lang?: Lang;
}) => {
  const t = useT(T);
  const docs = useMemo(
    () => ({
      preview: (
        <ResumeDocument
          resume={resume}
          placeholder={PLACEHOLDER_RESUME[lang]}
          lang={lang}
        />
      ),
      // without placeholders, so the opened PDF matches the download
      document: <ResumeDocument resume={resume} lang={lang} />,
    }),
    [resume, lang]
  );
  return <PdfPreview {...docs} label={t.label} />;
};
