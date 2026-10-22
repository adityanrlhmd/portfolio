import { Logo } from '@/assets/logo';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

import { useActiveSection } from '@/hooks/use-active-section';

import { NAVIGATIONS } from '@/lib/config';

import { ToggleButton } from './toggle-button';

export const Header = () => {
  const activeSection = useActiveSection(
    NAVIGATIONS.map(nav => nav.href.replace('#', ''))
  );

  return (
    <>
      <header className="sm:bg-background sticky top-0 z-50 flex h-(--header-height) justify-center sm:border-b">
        <div className="container flex w-full items-center justify-between">
          <a href="/" className="hover:text-primary">
            <Logo />
          </a>

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

          <ToggleButton />
        </div>
      </header>

      <nav className="bg-background fixed inset-x-0 bottom-0 z-50 border-t sm:hidden">
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
    </>
  );
};
