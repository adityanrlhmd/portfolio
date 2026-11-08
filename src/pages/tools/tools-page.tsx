import { RiArrowRightLine } from '@remixicon/react';

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { TOOLS } from '@/lib/config';

// The page to share: every tool, numbered in the order a job hunt uses them
const ToolsPage = () => (
  <main className="min-h-svh">
    <div className="container max-w-3xl space-y-8 py-10">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Free tools for your job search</h2>
        <p className="text-muted-foreground text-sm">
          Make your resume, check it against the job, then write the cover
          letter. Free, no sign-up, and nothing you type leaves your browser.
        </p>
      </div>

      <ol className="grid gap-4">
        {TOOLS.map((tool, i) => (
          <li key={tool.href}>
            <a href={tool.href} className="group block">
              <Card className="group-hover:ring-primary transition-shadow">
                <CardHeader className="grid-cols-[auto_1fr_auto] items-center gap-x-4">
                  <tool.icon className="text-primary row-span-2 size-6" />
                  <CardTitle className="text-base">
                    <span className="text-muted-foreground">{i + 1}.</span>{' '}
                    {tool.title}
                  </CardTitle>
                  <RiArrowRightLine className="text-muted-foreground group-hover:text-primary row-span-2 size-5 transition-colors" />
                  <CardDescription className="col-start-2">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </a>
          </li>
        ))}
      </ol>

      <p className="text-muted-foreground text-xs">
        Made by{' '}
        <a href="/" className="hover:text-primary underline underline-offset-4">
          Aditya Hamda
        </a>
        , a frontend engineer.
      </p>
    </div>
  </main>
);

export default ToolsPage;
