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

import { NAVIGATIONS, TOOLS } from '@/lib/config';
import { cn } from '@/lib/utils';

import { ToggleButton } from './toggle-button';

// Tool pages keep the same header frame but swap the navigation for the tool's title
export const Header = ({ tool }: { tool?: string }) => {
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
                // a tool's Edit/Preview bar sticks right below and draws the line instead
                tool && 'max-lg:border-b-0'
              )
            : // see-through on mobile only over the home hero; a tool's form scrolls under it
              cn('sm:bg-background sm:border-b', tool && 'bg-background')
        )}
      >
        <div className="container flex w-full items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <a href="/" aria-label="Home" className="hover:text-primary">
              <Logo />
            </a>
            {tool && (
              <div className="min-w-0">
                <h1 className="truncate text-sm font-bold">{tool}</h1>
                <p className="text-muted-foreground hidden truncate text-xs sm:block">
                  Everything stays in your browser. Nothing is uploaded.
                </p>
              </div>
            )}
          </div>

          {!tool && (
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
            {!tool &&
              TOOLS.map(link => (
                <Tooltip key={link.href}>
                  <TooltipTrigger
                    render={
                      <a
                        href={link.href}
                        aria-label={link.title}
                        className={buttonVariants({
                          variant: 'outline',
                          size: 'icon',
                        })}
                      />
                    }
                  >
                    <link.icon className="size-[1.2rem]" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{link.title}</TooltipContent>
                </Tooltip>
              ))}
            <ToggleButton />
          </div>
        </div>
      </header>

      {!tool && (
        <nav
          data-slot="bottom-nav"
          className="bg-background/80 fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur-md sm:hidden"
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
