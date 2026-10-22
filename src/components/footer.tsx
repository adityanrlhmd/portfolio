import { RiGithubFill, RiLinkedinBoxFill, RiMailFill } from '@remixicon/react';

import { Logo } from '@/assets/logo';

import { NAVIGATIONS } from '@/lib/config';

import { LetterGlitch } from './letter-glitch';

const LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/adityanrlhmd',
    icon: <RiGithubFill size={32} />,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/adityanurulhamda',
    icon: <RiLinkedinBoxFill size={32} />,
  },
  {
    label: 'Gmail',
    href: 'mailto:aditya.nrlhamda@gmail.com',
    icon: <RiMailFill size={32} />,
  },
];

export const Footer = () => {
  return (
    <footer className="border-t">
      <div className="text-muted-foreground container text-xs lg:text-sm">
        <div className="flex flex-col items-center py-8 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col items-center gap-4">
            <div className="group/flex flex items-center gap-8 md:gap-4 lg:gap-8">
              {LINKS.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="hover:text-foreground transition-all lg:group-has-[*:hover]/flex:opacity-40 lg:hover:opacity-100"
                >
                  {link.icon}
                </a>
              ))}
            </div>

            <a href="/" className="hover:text-foreground transition-all">
              <Logo size={100} />
            </a>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 md:mt-0">
            <p className="text-foreground font-semibold">Navigate</p>
            <ul className="flex gap-4 text-center md:flex-col md:gap-1.5">
              {NAVIGATIONS.map(nav => (
                <li key={nav.href}>
                  <a
                    href={nav.href}
                    className="hover:text-foreground transition-all"
                  >
                    {nav.title}
                  </a>
                </li>
              ))}
            </ul>
            <p>Frontend Engineer based in Indonesia</p>
          </div>

          <div className="mt-10 max-w-md md:mt-0 lg:max-w-2xl">
            <LetterGlitch glitchColors={['#35530e', '#7ccf00']} />
          </div>
        </div>

        <div className="border-t py-4">
          <p className="text-center">
            Copyright © {new Date().getFullYear()} Aditya Hamda. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
