import { pdf } from '@react-pdf/renderer';

import { useEffect, useState } from 'react';

import type { Resume } from '@/lib/resume/schema';

import { ResumeDocument } from './resume-document';

export const ResumePreview = ({ resume }: { resume: Resume }) => {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    let stale = false;
    pdf(<ResumeDocument resume={resume} />)
      .toBlob()
      .then(blob => {
        // a newer render started meanwhile; drop this one
        if (!stale) setUrl(URL.createObjectURL(blob));
      })
      .catch(console.error);
    return () => {
      stale = true;
    };
  }, [resume]);

  // revokes the previous PDF once the next one is showing, and on unmount
  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url);
    },
    [url]
  );

  if (!url) return null;

  return (
    <div className="flex h-full flex-col gap-2">
      <iframe
        title="Resume preview"
        src={url}
        className="w-full flex-1 rounded-md border bg-white"
      />
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="text-muted-foreground hover:text-foreground self-end text-xs underline underline-offset-3"
      >
        Open PDF
      </a>
    </div>
  );
};
