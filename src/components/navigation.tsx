import {
  RiBarChartHorizontalLine,
  RiFolderLine,
  RiHomeLine,
  RiSendPlaneLine,
} from '@remixicon/react';

import { Logo } from '@/assets/logo';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

import { useActiveSection } from '@/hooks/use-active-section';

import { ToggleButton } from './toggle-button';

const navigations = [
  {
    title: 'Home',
    href: '#home',
    icon: <RiHomeLine />,
  },
  {
    title: 'Experience',
    href: '#experience',
    icon: <RiBarChartHorizontalLine />,
  },
  {
    title: 'Projects',
    href: '#projects',
    icon: <RiFolderLine />,
  },
  {
    title: 'Contact',
    href: '#contact',
    icon: <RiSendPlaneLine />,
  },
] as const;

export const Navigation = () => {
  const activeSection = useActiveSection(
    navigations.map(nav => nav.href.replace('#', ''))
  );

  return (
    <>
      <header className="sm:bg-background sticky top-0 z-50 flex h-(--header-height) justify-center sm:border-b">
        <div className="container flex w-full items-center justify-between">
          <div className="hover:text-primary">
            <Logo />
          </div>

          <NavigationMenu className="hidden sm:flex">
            <NavigationMenuList>
              {navigations.map(nav => (
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

          <ToggleButton />
        </div>
      </header>

      <nav className="bottom-t bg-background fixed inset-x-0 bottom-0 z-50 sm:hidden">
        <ul className="flex items-center justify-evenly">
          {navigations.map(nav => (
            <li key={nav.title}>
              <a
                data-active={activeSection === nav.href.replace('#', '')}
                className="text-foreground/80 hover:text-primary data-[active=true]:text-primary flex flex-col items-center justify-center p-4 text-sm"
                href={nav.href}
              >
                {nav.icon}
                <span className="text-xs">{nav.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};
