import { pdf } from '@react-pdf/renderer';
import {
  RiDownloadLine,
  RiFileUploadLine,
  RiRefreshLine,
  RiUserLine,
} from '@remixicon/react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { useEffect, useRef, useState } from 'react';

import { Logo } from '@/assets/logo';

import { ThemeProvider } from '@/components/theme-provider';
import { ToggleButton } from '@/components/toggle-button';
import { Button, buttonVariants } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';

import { ADITYA_RESUME } from '@/lib/resume/aditya';
import { decodeResumeFromPdf } from '@/lib/resume/embed';
import { EMPTY_RESUME, type Resume } from '@/lib/resume/schema';
import { clearResume, loadResume, saveResume } from '@/lib/resume/storage';
import { cn } from '@/lib/utils';

import { ResumeDocument } from './resume-document';
import { ResumeForm } from './resume-form';
import { ResumePreview } from './resume-preview';

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
    const timer = setTimeout(() => setDebounced(values), 400);
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
    form.reset({ ...imported, photo: form.getValues('photo') });
    toast.success('Resume imported.');
  };

  const resetAll = () => {
    if (!window.confirm("Clear everything? This can't be undone.")) return;
    form.reset(EMPTY_RESUME);
    clearResume();
  };

  const download = async () => {
    const resume = form.getValues();
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

  return (
    <div className="min-h-svh">
      <header className="bg-background sticky top-0 z-50 border-b">
        <div className="container flex h-(--header-height) items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a href="/" className="hover:text-primary" aria-label="Home">
              <Logo />
            </a>
            <div>
              <h1 className="text-sm font-bold">Resume Builder</h1>
              <p className="text-muted-foreground hidden text-xs sm:block">
                Everything stays in your browser. Nothing is uploaded.
              </p>
            </div>
          </div>
          <ToggleButton />
        </div>
      </header>

      <div className="container grid gap-6 py-6 lg:grid-cols-2">
        <div className="space-y-4">
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
            <Button type="button" onClick={download}>
              <RiDownloadLine /> Download PDF
            </Button>
          </div>

          <div className="flex gap-2 lg:hidden">
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
        </div>

        <div
          className={cn(
            tab !== 'preview' && 'hidden',
            'h-[calc(100svh-var(--header-height)-3rem)] lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:block'
          )}
        >
          <ResumePreview resume={debounced} />
        </div>
      </div>
    </div>
  );
};

const ResumePage = () => (
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <ResumeBuilder />
    <Toaster />
  </ThemeProvider>
);

export default ResumePage;
