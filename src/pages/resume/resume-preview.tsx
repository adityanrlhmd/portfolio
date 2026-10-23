import { pdf } from '@react-pdf/renderer';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

import { useEffect, useRef, useState } from 'react';

import { PLACEHOLDER_RESUME } from '@/lib/resume/placeholder';
import type { Resume } from '@/lib/resume/schema';

import { ResumeDocument } from './resume-document';

GlobalWorkerOptions.workerSrc = workerUrl;

// Draws the PDF onto canvases instead of an iframe, so an update swaps the
// pages in place: no blank flash, the scroll position stays, and every page
// shows on iOS too.
export const ResumePreview = ({ resume }: { resume: Resume }) => {
  const pagesRef = useRef<HTMLDivElement>(null);
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    let stale = false;

    (async () => {
      const blob = await pdf(
        <ResumeDocument resume={resume} placeholder={PLACEHOLDER_RESUME} />
      ).toBlob();
      if (stale) return;

      const task = getDocument({ data: await blob.arrayBuffer() });
      const doc = await task.promise;
      // shortcut: pages are drawn for the width at render time and only scaled by CSS on resize, re-render on resize if they look soft
      const width = (pagesRef.current?.clientWidth || 612) * devicePixelRatio;
      const canvases: HTMLCanvasElement[] = [];
      for (let n = 1; n <= doc.numPages && !stale; n++) {
        const page = await doc.getPage(n);
        const viewport = page.getViewport({
          scale: width / page.getViewport({ scale: 1 }).width,
        });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.className = 'w-full rounded-md border bg-white';
        await page.render({ canvas, viewport }).promise;
        canvases.push(canvas);
      }
      await task.destroy();
      // the old pages stay up until the whole new version is ready
      if (!stale) pagesRef.current?.replaceChildren(...canvases);
    })().catch(console.error);

    return () => {
      stale = true;
    };
  }, [resume]);

  // Built on click, without placeholders, so the opened PDF matches the download.
  // The tab opens before the await, or Safari blocks it as a popup.
  const openPdf = async () => {
    const tab = window.open('', '_blank');
    try {
      const blob = await pdf(<ResumeDocument resume={resume} />).toBlob();
      const next = URL.createObjectURL(blob);
      setUrl(next);
      if (tab) tab.location.href = next;
    } catch (error) {
      tab?.close();
      console.error(error);
    }
  };

  // revokes the previously opened PDF once the next one is made, and on unmount
  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url);
    },
    [url]
  );

  return (
    <div className="flex h-full flex-col gap-2">
      <div
        ref={pagesRef}
        role="img"
        aria-label="Resume preview"
        className="flex-1 space-y-3 overflow-y-auto"
      />
      <button
        type="button"
        onClick={openPdf}
        className="text-muted-foreground hover:text-foreground cursor-pointer self-end text-xs underline underline-offset-3"
      >
        Open PDF
      </button>
    </div>
  );
};
