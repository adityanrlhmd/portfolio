import { Dialog } from '@base-ui/react/dialog';
import { RiCloseLine, RiMenuLine } from '@remixicon/react';

import { useId } from 'react';

import { Button } from '@/components/ui/button';

import { backToPortfolio } from '@/lib/back-to-portfolio';
import { TOOLS, TOOLS_HUB } from '@/lib/config';

// Every tool in job hunt order, styled after the shadcn docs sidebar.
// The sidebar on wide screens.
export const ToolNav = () => {
  const path = window.location.pathname.replace(/\/$/, '');
  const labelId = useId();

  return (
    <nav aria-labelledby={labelId} className="flex flex-col gap-0.5">
      {/* the way back to the hub, where a shared link lands */}
      <a
        href={TOOLS_HUB.href}
        id={labelId}
        className="text-muted-foreground hover:text-foreground w-fit px-2 pb-2 text-xs font-medium transition-colors"
      >
        Tools
      </a>
      {TOOLS.map(link => (
        <a
          key={link.href}
          href={link.href}
          aria-current={link.href === path ? 'page' : undefined}
          className="hover:bg-muted aria-[current=page]:bg-muted flex h-7.5 w-fit items-center rounded-md px-2 text-[0.8rem] font-medium transition-colors"
        >
          {link.title}
        </a>
      ))}
    </nav>
  );
};

// The header's menu below xl, after the shadcn docs': a blurred panel under the header with
// big links, toggled by the same button that turns into a close icon.
export const ToolMenu = () => {
  const path = window.location.pathname.replace(/\/$/, '');
  const sections = [
    { label: 'Tools', links: TOOLS },
    {
      label: 'More',
      links: [
        { title: 'All tools', href: TOOLS_HUB.href },
        { title: 'Portfolio', href: '/' },
      ],
    },
  ];

  return (
    <Dialog.Root>
      <Dialog.Trigger
        render={
          <Button
            variant="ghost"
            size="icon"
            aria-label="Tools menu"
            className="group xl:hidden"
          />
        }
      >
        <RiMenuLine className="size-[1.2rem] group-data-[popup-open]:hidden" />
        <RiCloseLine className="hidden size-[1.2rem] group-data-[popup-open]:block" />
      </Dialog.Trigger>
      <Dialog.Portal>
        {/* starts under the header so it stays in view, with the button to close */}
        <Dialog.Popup className="bg-background/90 fixed inset-x-0 top-(--header-height) bottom-0 z-50 overflow-y-auto backdrop-blur transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0">
          <Dialog.Title className="sr-only">Tools menu</Dialog.Title>
          <nav
            aria-label="Tools"
            className="container flex flex-col gap-10 py-6"
          >
            {sections.map(section => (
              <div key={section.label} className="flex flex-col gap-4">
                <p className="text-muted-foreground text-sm font-medium">
                  {section.label}
                </p>
                <div className="flex flex-col gap-3">
                  {section.links.map(link => (
                    <a
                      key={link.href}
                      href={link.href}
                      aria-current={link.href === path ? 'page' : undefined}
                      // like the header logo: back in history when the visitor came from it
                      onClick={link.href === '/' ? backToPortfolio : undefined}
                      // lime text is too faint on the light theme, so the open tool gets a lime underline instead
                      className="hover:text-primary decoration-primary w-fit text-2xl font-medium underline-offset-8 transition-colors aria-[current=page]:underline aria-[current=page]:decoration-2"
                    >
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
