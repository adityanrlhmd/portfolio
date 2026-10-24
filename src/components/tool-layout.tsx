import { type ReactNode, useState } from 'react';

import { ToolNav } from '@/components/tool-nav';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/utils';

// The shared frame of a tool page: nav and actions on top, the form beside a sticky
// preview on desktop, and Edit/Preview tabs to switch between them on mobile.
export const ToolLayout = ({
  next,
  actions,
  form,
  preview,
}: {
  next: { href: string; label: string };
  actions: ReactNode;
  form: ReactNode;
  preview: ReactNode;
}) => {
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');

  return (
    <main className="min-h-svh">
      {/* minmax(0, 1fr) columns stop wide content from stretching the page past the screen;
          the auto/1fr rows give any spare height to the form row, not the toolbar */}
      <div className="container grid grid-cols-1 gap-x-6 gap-y-4 py-6 lg:grid-cols-2 lg:grid-rows-[auto_1fr]">
        <div className="space-y-4">
          <ToolNav next={next} />
          <p className="text-muted-foreground text-xs sm:hidden">
            Everything stays in your browser. Nothing is uploaded.
          </p>
          <div className="flex flex-wrap gap-2">{actions}</div>
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

        <div className={cn(tab !== 'edit' && 'hidden', 'lg:block')}>{form}</div>

        <div
          className={cn(
            tab !== 'preview' && 'hidden',
            'h-[calc(100svh-var(--header-height)-6rem)] lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:block lg:h-[calc(100svh-var(--header-height)-3rem)] lg:self-start'
          )}
        >
          {preview}
        </div>
      </div>
    </main>
  );
};
