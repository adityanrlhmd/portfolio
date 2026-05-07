import { useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';

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
    stiffness: 50,
    damping: 10,
    restDelta: 0.001,
  });

  // We use progress from 0 to 1 to avoid framer-motion interpolating "100%" to "100px"
  const progress = useTransform(scrollYSpring, [0, 300], [0, 1]);
  const widthWrapper = useTransform(
    progress,
    (p) => `calc((100% * ${1 - p}) + (528px * ${p}))`
  );

  const [isHideLogo, setIsHideLogo] = useState(false);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (latest > 250) {
      setIsHideLogo(true);
    } else {
      setIsHideLogo(false);
    }
  });

  return (
    <header className="sticky top-0 z-100 flex w-full justify-center">
      <motion.div
        style={{
          width: widthWrapper,
        }}
        className="border-b p-4"
      >
        <div className="container mx-auto flex w-full items-center">
          <AnimatePresence initial={false}>
            {!isHideLogo && (
              <motion.h1
                layout
                initial={{ opacity: 0, width: 0, overflow: 'hidden' }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0, overflow: 'hidden' }}
                transition={{ duration: 0.3 }}
                className="text-2xl font-bold whitespace-nowrap"
              >
                ADITYA HAMDA
              </motion.h1>
            )}
          </AnimatePresence>

          <motion.div
            layout
            style={{
              margin: isHideLogo ? '0 auto' : '0 0 0 auto',
            }}
            className="flex items-center gap-4"
          >
            <NavigationMenu>
              <NavigationMenuList>
                {navigations.map((nav) => (
                  <NavigationMenuItem key={nav.title}>
                    <NavigationMenuLink
                      className={navigationMenuTriggerStyle()}
                    >
                      <a href={nav.href}>{nav.title}</a>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <ToggleButton />
          </motion.div>
        </div>
      </motion.div>
    </header>
  );
};
