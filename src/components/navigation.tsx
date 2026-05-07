import { motion, useScroll, useSpring, useTransform } from 'motion/react';

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
  },
  {
    title: 'Experience',
    href: '#experience',
  },
  {
    title: 'Projects',
    href: '#projects',
  },
  {
    title: 'Contact',
    href: '#contact',
  },
] as const;

export const Navigation = () => {
  const { scrollY } = useScroll();
  const scrollYSpring = useSpring(scrollY, {
    stiffness: 300,
    damping: 20,
    restDelta: 0.001,
  });

  // We use progress from 0 to 1 to avoid framer-motion interpolating "100%" to "100px"
  const progress = useTransform(scrollYSpring, [0, 400], [0, 1]);
  const widthWrapper = useTransform(
    progress,
    (p) => `calc((100% * ${1 - p}) + (578px * ${p}))`
  );

  const activeSection = useActiveSection(
    navigations.map((nav) => nav.href.replace('#', ''))
  );

  return (
    <header className="sticky top-0 z-100 flex w-full justify-center">
      <motion.div
        style={{
          width: widthWrapper,
        }}
        className="border-b px-8 py-4"
      >
        <div className="container mx-auto flex w-full items-center justify-between">
          <Logo />

          <NavigationMenu>
            <NavigationMenuList>
              {navigations.map((nav) => (
                <NavigationMenuItem key={nav.title}>
                  <NavigationMenuLink
                    data-active={activeSection === nav.href.replace('#', '')}
                    className={navigationMenuTriggerStyle()}
                  >
                    <a href={nav.href}>{nav.title}</a>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <ToggleButton />
        </div>
      </motion.div>
    </header>
  );
};
