import { useEffect, useState } from 'react';

import { Logo } from '@/assets/logo';

import { useLang } from '@/components/language-provider';
import { LanguageToggle } from '@/components/language-toggle';
import { ToolMenu } from '@/components/tool-nav';
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

import { backToPortfolio } from '@/lib/back-to-portfolio';
import { NAVIGATIONS, TOOLS_HUB } from '@/lib/config';
import { COMMON, type Lang } from '@/lib/i18n';
import { cn } from '@/lib/utils';

import { ToggleButton } from './toggle-button';

// Tool pages keep the same header frame but swap the navigation for the tool's title;
// a page of its own (a case study) does the same with its `page` title, without the tools menu
export const Header = ({
  tool,
  page,
}: {
  tool?: Record<Lang, string>;
  page?: Record<Lang, string>;
}) => {
  const { lang } = useLang();
  const title = tool ?? page;
  // the case study's own heading is the page's h1
  const Title = tool ? 'h1' : 'p';
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
              cn('sm:bg-background sm:border-b', title && 'bg-background')
        )}
      >
        <div className="container flex w-full items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            {/* a tool page's menu, on the left like the shadcn docs; wide screens have the sidebar */}
            {tool && <ToolMenu />}
            {/* off the home page it's a back button that's always in reach */}
            <a
              href="/"
              aria-label={lang === 'id' ? 'Beranda' : 'Home'}
              onClick={title ? backToPortfolio : undefined}
              className="hover:text-primary"
            >
              <Logo />
            </a>
            {title && (
              <div className="min-w-0">
                <Title className="truncate text-sm font-bold">
                  {title[lang]}
                </Title>
                {tool && (
                  <p className="text-muted-foreground hidden truncate text-xs sm:block">
                    {COMMON[lang].localOnly}
                  </p>
                )}
              </div>
            )}
          </div>

          {!title && (
            <NavigationMenu className="hidden sm:flex">
              <NavigationMenuList>
                {NAVIGATIONS.map(nav => (
                  <NavigationMenuItem key={nav.href}>
                    <NavigationMenuLink
                      data-active={activeSection === nav.href.replace('#', '')}
                      className={navigationMenuTriggerStyle()}
                      href={nav.href}
                    >
                      {nav.title[lang]}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          )}

          <div className="flex items-center gap-2">
            {/* the portfolio points to the hub to pick a tool */}
            {!tool && (
              <Tooltip>
                <TooltipTrigger
                  render={
                    <a
                      href={TOOLS_HUB.href}
                      aria-label={TOOLS_HUB.title[lang]}
                      className={buttonVariants({
                        variant: 'outline',
                        size: 'icon',
                      })}
                    />
                  }
                >
                  <TOOLS_HUB.icon className="size-[1.2rem]" />
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {TOOLS_HUB.title[lang]}
                </TooltipContent>
              </Tooltip>
            )}
            <LanguageToggle />
            <ToggleButton />
          </div>
        </div>
      </header>

      {!title && (
        <nav
          data-slot="bottom-nav"
          className="bg-background/80 fixed inset-x-0 bottom-0 z-50 border-t backdrop-blur-md sm:hidden"
        >
          <ul className="flex items-center justify-evenly">
            {NAVIGATIONS.map(nav => (
              <li key={nav.href}>
                <a
                  data-active={activeSection === nav.href.replace('#', '')}
                  className="text-muted-foreground hover:text-primary data-[active=true]:text-primary flex flex-col items-center justify-center p-4 text-sm"
                  href={nav.href}
                >
                  <nav.icon />
                  <span className="text-xs">{nav.title[lang]}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  );
};
