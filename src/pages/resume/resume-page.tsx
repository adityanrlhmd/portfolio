import {
  RiArrowLeftLine,
  RiDownloadLine,
  RiFileUploadLine,
  RiRefreshLine,
  RiUserLine,
} from '@remixicon/react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { useEffect, useRef, useState } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';

import { ADITYA_RESUME } from '@/lib/resume/aditya';
import { decodeResumeFromPdf } from '@/lib/resume/embed';
import { EMPTY_RESUME, type Resume } from '@/lib/resume/schema';
import { clearResume, loadResume, saveResume } from '@/lib/resume/storage';
import { cn } from '@/lib/utils';

import { downloadResume } from './download';
import { ResumeForm } from './resume-form';
import { ResumePreview } from './resume-preview';

// Back keeps the visitor's scroll spot on the portfolio; only when they came from it,
// otherwise (opened directly, or from another site) the link just goes home.
const backToPortfolio = (event: React.MouseEvent) => {
  try {
    if (new URL(document.referrer).origin !== window.location.origin) return;
  } catch {
    return; // no referrer
  }
  event.preventDefault();
  window.history.back();
};

const isBlank = (resume: Resume) =>
  JSON.stringify(resume) === JSON.stringify(EMPTY_RESUME);

const ResumeBuilder = () => {
  const form = useForm<Resume>({
    defaultValues: loadResume() ?? EMPTY_RESUME,
  });
  const values = useWatch({ control: form.control }) as Resume;
  const [debounced, setDebounced] = useState(values);
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');
  const warnedStorage = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(values), 200);
    return () => clearTimeout(timer);
  }, [values]);

  useEffect(() => {
    if (saveResume(debounced) || warnedStorage.current) return;
    warnedStorage.current = true;
    toast.error("Couldn't save your progress in this browser.");
  }, [debounced]);

  const fillAditya = () => {
    if (
      !isBlank(form.getValues()) &&
      !window.confirm("Replace what you have typed with Aditya's data?")
    )
      return;
    form.reset(ADITYA_RESUME);
  };

  const importPdf = async (file: File | undefined) => {
    if (!file) return;
    const imported = decodeResumeFromPdf(await file.arrayBuffer());
    if (!imported) {
      toast.error('Only resumes made with this generator can be imported.');
      return;
    }
    if (
      !isBlank(form.getValues()) &&
      !window.confirm('Replace what you have typed with the imported resume?')
    )
      return;
    form.reset({ ...imported, photo: form.getValues('photo') });
    toast.success('Resume imported.');
  };

  const resetAll = () => {
    if (!window.confirm("Clear everything? This can't be undone.")) return;
    form.reset(EMPTY_RESUME);
    clearResume();
  };

  return (
    <main className="min-h-svh">
      {/* minmax(0, 1fr) columns stop wide content from stretching the page past the screen;
          the auto/1fr rows give any spare height to the form row, not the toolbar */}
      <div className="container grid grid-cols-1 gap-x-6 gap-y-4 py-6 lg:grid-cols-2 lg:grid-rows-[auto_1fr]">
        <div className="space-y-4">
          <a
            href="/"
            onClick={backToPortfolio}
            className={buttonVariants({
              variant: 'ghost',
              className: '-ms-2',
            })}
          >
            <RiArrowLeftLine /> Back to portfolio
          </a>
          <p className="text-muted-foreground text-xs sm:hidden">
            Everything stays in your browser. Nothing is uploaded.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={fillAditya}>
              <RiUserLine /> Fill with Aditya's data
            </Button>
            <label
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'focus-within:ring-ring/30 cursor-pointer focus-within:ring-2'
              )}
            >
              <RiFileUploadLine />
              Import PDF
              <input
                type="file"
                accept="application/pdf"
                className="sr-only"
                onChange={e => {
                  importPdf(e.target.files?.[0]);
                  e.target.value = '';
                }}
              />
            </label>
            <Button type="button" variant="outline" onClick={resetAll}>
              <RiRefreshLine /> Reset
            </Button>
            <Button
              type="button"
              onClick={() => downloadResume(form.getValues())}
            >
              <RiDownloadLine /> Download PDF
            </Button>
          </div>
        </div>

        {/* stays under the header so switching never needs a scroll back up */}
        <div className="bg-background/80 sticky top-(--header-height) z-40 -mx-4 flex gap-2 border-b px-4 py-2 backdrop-blur-md sm:-mx-8 sm:px-8 lg:hidden">
          {(['edit', 'preview'] as const).map(value => (
            <Button
              key={value}
              type="button"
              variant={tab === value ? 'secondary' : 'ghost'}
              aria-pressed={tab === value}
              onClick={() => setTab(value)}
              className="capitalize"
            >
              {value}
            </Button>
          ))}
        </div>

        <div className={cn(tab !== 'edit' && 'hidden', 'lg:block')}>
          <ResumeForm form={form} />
        </div>

        <div
          className={cn(
            tab !== 'preview' && 'hidden',
            'h-[calc(100svh-var(--header-height)-6rem)] lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:block lg:h-[calc(100svh-var(--header-height)-3rem)] lg:self-start'
          )}
        >
          <ResumePreview resume={debounced} />
        </div>
      </div>
    </main>
  );
};

export default ResumeBuilder;
