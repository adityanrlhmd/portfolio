import { type ReactNode, useState } from 'react';

import { useLang } from '@/components/language-provider';
import { ToolNav } from '@/components/tool-nav';
import { Button } from '@/components/ui/button';

import { COMMON } from '@/lib/i18n';
import { cn } from '@/lib/utils';

// The shared frame of a tool page: the tools sidebar on wide screens, actions on top, the form beside a sticky
// preview on desktop, and Edit/Preview tabs to switch between them on mobile.
export const ToolLayout = ({
  actions,
  form,
  preview,
  tabs,
}: {
  actions: ReactNode;
  form: ReactNode;
  preview: ReactNode;
  // the mobile tab names; a tool whose right side is a result, not a document, names its own
  tabs?: [form: string, preview: string];
}) => {
  const [tab, setTab] = useState<'edit' | 'preview'>('edit');
  const { lang } = useLang();
  const tabNames =
    tabs ?? (lang === 'id' ? ['Edit', 'Preview'] : ['Edit', 'Preview']);

  return (
    <main className="min-h-svh">
      {/* minmax(0, 1fr) columns stop wide content from stretching the page past the screen;
          the auto/1fr rows give any spare height to the form row, not the toolbar */}
      <div className="container grid grid-cols-1 gap-x-6 gap-y-4 py-6 lg:grid-cols-2 lg:grid-rows-[auto_1fr] xl:grid-cols-[14rem_minmax(0,1fr)_minmax(0,1fr)]">
        {/* below xl the header's menu button opens the same list in a sheet */}
        <aside className="hidden xl:sticky xl:top-[calc(var(--header-height)+1.5rem)] xl:col-start-1 xl:row-span-2 xl:row-start-1 xl:block xl:h-[calc(100svh-var(--header-height)-3rem)] xl:self-start xl:border-r">
          <ToolNav />
        </aside>

        <div className="space-y-4 xl:col-start-2 xl:row-start-1">
          <p className="text-muted-foreground text-xs sm:hidden">
            {COMMON[lang].localOnly}
          </p>
          <div className="flex flex-wrap gap-2">{actions}</div>
        </div>

        {/* stays under the header so switching never needs a scroll back up */}
        <div className="bg-background/80 sticky top-(--header-height) z-40 -mx-4 flex gap-2 border-b px-4 py-2 backdrop-blur-md sm:-mx-8 sm:px-8 lg:hidden">
          {(['edit', 'preview'] as const).map((value, i) => (
            <Button
              key={value}
              type="button"
              variant={tab === value ? 'secondary' : 'ghost'}
              aria-pressed={tab === value}
              onClick={() => setTab(value)}
            >
              {tabNames[i]}
            </Button>
          ))}
        </div>

        <div
          className={cn(
            tab !== 'edit' && 'hidden',
            'lg:block xl:col-start-2 xl:row-start-2'
          )}
        >
          {form}
        </div>

        <div
          className={cn(
            tab !== 'preview' && 'hidden',
            'h-[calc(100svh-var(--header-height)-6rem)] lg:sticky lg:top-[calc(var(--header-height)+1.5rem)] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:block lg:h-[calc(100svh-var(--header-height)-3rem)] lg:self-start xl:col-start-3'
          )}
        >
          {preview}
        </div>
      </div>
    </main>
  );
};
