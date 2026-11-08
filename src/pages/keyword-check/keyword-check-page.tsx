import { RiFileUploadLine, RiFileUserLine } from '@remixicon/react';
import { toast } from 'sonner';

import { useDeferredValue, useMemo, useState } from 'react';

import { ToolLayout } from '@/components/tool-layout';
import { Button, buttonVariants } from '@/components/ui/button';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';

import { type SkillHit, compareSkills } from '@/lib/keywords';
import { resumeText } from '@/lib/resume/format';
import { loadResume } from '@/lib/resume/storage';
import { cn } from '@/lib/utils';

const SkillList = ({
  title,
  skills,
  missing,
}: {
  title: string;
  skills: SkillHit[];
  missing?: boolean;
}) => (
  <section className="space-y-2">
    <h2 className="text-sm font-medium">
      {title} ({skills.length})
    </h2>
    {skills.length ? (
      <ul className="flex flex-wrap gap-2">
        {skills.map(skill => (
          <li
            key={skill.name}
            className={cn(
              'rounded-md border px-2 py-1 text-xs',
              missing && 'border-destructive/50 text-destructive'
            )}
          >
            {skill.name}
            {skill.count > 1 && (
              <span className="text-muted-foreground"> ×{skill.count}</span>
            )}
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-muted-foreground text-xs">None.</p>
    )}
  </section>
);

const KeywordCheckPage = () => {
  const [resume, setResume] = useState(() => {
    const saved = loadResume();
    return saved ? resumeText(saved) : '';
  });
  const [job, setJob] = useState('');

  const deferredResume = useDeferredValue(resume);
  const deferredJob = useDeferredValue(job);
  const result = useMemo(
    () => compareSkills(deferredResume, deferredJob),
    [deferredResume, deferredJob]
  );

  const replaceResume = (text: string) => {
    if (
      resume.trim() &&
      resume !== text &&
      !window.confirm('Replace the resume text you have now?')
    )
      return;
    setResume(text);
  };

  const fillFromSaved = () => {
    const saved = loadResume();
    if (!saved) {
      toast.error('No saved resume yet. Make one in the Resume Builder.');
      return;
    }
    replaceResume(resumeText(saved));
  };

  const importPdf = async (file: File | undefined) => {
    if (!file) return;
    try {
      // loaded on demand, so the page itself stays light
      const { pdfText } = await import('@/lib/pdf-text');
      const text = await pdfText(await file.arrayBuffer());
      if (!text) {
        toast.error(
          'No text found in this PDF. If it is a scan, paste the text instead.'
        );
        return;
      }
      replaceResume(text);
    } catch {
      toast.error("Couldn't read this PDF.");
    }
  };

  const total = result.missing.length + result.matched.length;

  return (
    <ToolLayout
      actions={
        <>
          <Button type="button" variant="outline" onClick={fillFromSaved}>
            <RiFileUserLine /> Use saved resume
          </Button>
          <label
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'focus-within:ring-ring/30 cursor-pointer focus-within:ring-2'
            )}
          >
            <RiFileUploadLine />
            Import resume PDF
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
        </>
      }
      form={
        <form onSubmit={e => e.preventDefault()} className="space-y-6">
          <Field>
            <FieldLabel htmlFor="job">Job post</FieldLabel>
            <Textarea
              id="job"
              className="min-h-60"
              value={job}
              onChange={e => setJob(e.target.value)}
            />
            <FieldDescription>
              Paste the whole job description, English or Indonesian.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="resume">Your resume</FieldLabel>
            <Textarea
              id="resume"
              className="min-h-60"
              value={resume}
              onChange={e => setResume(e.target.value)}
            />
            <FieldDescription>
              Filled from the Resume Builder when you have one saved. You can
              also import any text PDF, or paste.
            </FieldDescription>
          </Field>
        </form>
      }
      preview={
        // hugs the results instead of filling the PDF-sized slot, scrolls if they outgrow it
        <div className="flex max-h-full flex-col gap-2">
          <div
            role="region"
            aria-label="Results"
            className="min-h-0 space-y-6 overflow-y-auto rounded-md border p-4"
          >
            {!job.trim() ? (
              <p className="text-muted-foreground text-sm">
                Paste a job post to see which skills it asks for and which ones
                your resume doesn't mention yet.
              </p>
            ) : total === 0 ? (
              <p className="text-muted-foreground text-sm">
                No skills from the list were found in this job post.
              </p>
            ) : (
              <>
                <SkillList
                  title="Missing from your resume"
                  skills={result.missing}
                  missing
                />
                <SkillList
                  title="Already in your resume"
                  skills={result.matched}
                />
              </>
            )}
          </div>
          <FieldDescription>
            Checks for common skills and tools in tech, office software, design,
            marketing, finance, HR and soft skills, in English or Indonesian. A
            skill outside those won't show up. Most mentioned in the job post
            first.
          </FieldDescription>
        </div>
      }
    />
  );
};

export default KeywordCheckPage;
