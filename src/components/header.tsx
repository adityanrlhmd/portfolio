import { RiFileUserLine } from '@remixicon/react';

import { useEffect, useState } from 'react';

import { Logo } from '@/assets/logo';

import { buttonVariants } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { useActiveSection } from '@/hooks/use-active-section';

import { NAVIGATIONS } from '@/lib/config';
import { cn } from '@/lib/utils';

import { ToggleButton } from './toggle-button';

// The resume page keeps the same header frame but swaps the navigation for a way back
export const Header = ({ resume = false }: { resume?: boolean }) => {
  const activeSection = useActiveSection(
    NAVIGATIONS.map(nav => nav.href.replace('#', ''))
  );
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 flex h-(--header-height) justify-center transition-colors',
          scrolled
            ? cn(
                'bg-background/80 border-b backdrop-blur-md',
                // the resume Edit/Preview bar sticks right below and draws the line instead
                resume && 'max-lg:border-b-0'
              )
            : // see-through on mobile only over the home hero; the resume form scrolls under it
              cn('sm:bg-background sm:border-b', resume && 'bg-background')
        )}
      >
        <div className="container flex w-full items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <a href="/" className="hover:text-primary">
              <Logo />
            </a>
            {resume && (
              <div className="min-w-0">
                <h1 className="truncate text-sm font-bold">Resume Builder</h1>
                <p className="text-muted-foreground hidden truncate text-xs sm:block">
                  Everything stays in your browser. Nothing is uploaded.
                </p>
              </div>
            )}
          </div>

          {!resume && (
            <NavigationMenu className="hidden sm:flex">
              <NavigationMenuList>
                {NAVIGATIONS.map(nav => (
                  <NavigationMenuItem key={nav.title}>
                    <NavigationMenuLink
                      data-active={activeSection === nav.href.replace('#', '')}
                      className={navigationMenuTriggerStyle()}
                      href={nav.href}
                    >
                      {nav.title}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          )}

          <div className="flex items-center gap-2">
            {!resume && (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <a
                      href="/resume"
                      aria-label="Resume Builder"
                      className={buttonVariants({
                        variant: 'outline',
                        size: 'icon',
                      })}
                    />
                  }
                >
                  <RiFileUserLine className="size-[1.2rem]" />
                </TooltipTrigger>
                <TooltipContent side="bottom">Resume Builder</TooltipContent>
              </Tooltip>
            )}
            <ToggleButton />
          </div>
        </div>
      </header>

      {!resume && (
        <nav
          data-slot="bottom-nav"
          className="bg-background fixed inset-x-0 bottom-0 z-50 border-t sm:hidden"
        >
          <ul className="flex items-center justify-evenly">
            {NAVIGATIONS.map(nav => (
              <li key={nav.title}>
                <a
                  data-active={activeSection === nav.href.replace('#', '')}
                  className="text-muted-foreground hover:text-primary data-[active=true]:text-primary flex flex-col items-center justify-center p-4 text-sm"
                  href={nav.href}
                >
                  <nav.icon />
                  <span className="text-xs">{nav.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
};
