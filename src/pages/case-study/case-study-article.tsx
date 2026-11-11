import { RiArrowRightLine } from '@remixicon/react';

import { Fragment, type ReactNode } from 'react';

import { backToPortfolio } from '@/lib/back-to-portfolio';

type Image = { src: string; alt: string; width: number; height: number };

export type Section = {
  title: string;
  paragraphs: string[];
  code?: string;
  list?: string[];
  images?: Image[];
};

export type CaseStudyCopy = {
  eyebrow: string;
  title: string;
  lead: string;
  facts: [label: string, value: string][];
  sections: Section[];
  next: string;
  back: string;
};

// `backticks` in the copy become inline code, **stars** become bold
const rich = (text: string) =>
  text.split('`').map((part, i) =>
    i % 2 ? (
      <code key={i} className="bg-muted rounded px-1 py-0.5 text-[0.85em]">
        {part}
      </code>
    ) : (
      <Fragment key={i}>
        {part.split('**').map((bit, j) =>
          j % 2 ? (
            <strong key={j} className="text-foreground">
              {bit}
            </strong>
          ) : (
            bit
          )
        )}
      </Fragment>
    )
  );

export const CaseStudyArticle = ({
  t,
  actions,
  nextHref,
  children,
}: {
  t: CaseStudyCopy;
  actions: ReactNode;
  nextHref: string;
  // media shown between the header and the first section
  children?: ReactNode;
}) => (
  <main className="min-h-svh">
    <article className="container max-w-3xl space-y-10 py-10">
      <div className="space-y-4">
        <p className="text-primary text-sm font-bold">{t.eyebrow}</p>
        <h1 className="text-3xl font-bold lg:text-4xl lg:leading-tight">
          {t.title}
        </h1>
        <p className="text-muted-foreground">{t.lead}</p>
        <dl className="grid gap-2 border-y py-4 text-sm sm:grid-cols-[auto_1fr] sm:gap-x-6">
          {t.facts.map(([label, value]) => (
            <Fragment key={label}>
              <dt className="text-muted-foreground">{label}</dt>
              <dd>{value}</dd>
            </Fragment>
          ))}
        </dl>
        {actions}
      </div>

      {children}

      {t.sections.map(section => (
        <section key={section.title} className="space-y-4">
          <h2 className="text-xl font-bold">{section.title}</h2>
          {section.paragraphs.map((paragraph, i) => (
            <Fragment key={i}>
              <p className="text-muted-foreground leading-relaxed">
                {rich(paragraph)}
              </p>
              {i === 0 && section.code && (
                <pre className="bg-muted overflow-x-auto rounded-md border p-4 text-xs leading-relaxed">
                  <code>{section.code}</code>
                </pre>
              )}
            </Fragment>
          ))}
          {section.list && (
            <ul className="text-muted-foreground list-disc space-y-2 pl-5 leading-relaxed">
              {section.list.map((item, i) => (
                <li key={i}>{rich(item)}</li>
              ))}
            </ul>
          )}
          {section.images?.map(image => (
            <img
              key={image.src}
              {...image}
              loading="lazy"
              decoding="async"
              className="w-full rounded-md border"
            />
          ))}
        </section>
      ))}

      <div className="flex flex-col gap-4 border-t pt-6">
        <a
          href={nextHref}
          className="text-primary inline-flex items-center gap-2 font-medium hover:underline"
        >
          {t.next} <RiArrowRightLine size={18} />
        </a>
        <a
          href="/"
          onClick={backToPortfolio}
          className="text-muted-foreground hover:text-primary inline-block text-sm underline underline-offset-4"
        >
          ← {t.back}
        </a>
      </div>
    </article>
  </main>
);
