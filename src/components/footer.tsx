import { RiGithubFill, RiLinkedinBoxFill, RiMailFill } from '@remixicon/react';

import { Logo } from '@/assets/logo';

import { NAVIGATIONS, TOOLS } from '@/lib/config';
import { cn } from '@/lib/utils';

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

export const Footer = ({ minimal = false }: { minimal?: boolean }) => {
  return (
    <footer className="border-t">
      <div className="text-muted-foreground container text-xs lg:text-sm">
        {/* equal columns keep "Navigate" on the page's center line, aligned with the copyright */}
        {!minimal && (
          <div className="flex flex-col items-center py-8 md:grid md:grid-cols-3 md:items-start">
            <div className="flex flex-col items-center gap-4 md:justify-self-start">
              <div className="group/flex flex items-center gap-8 md:gap-4 lg:gap-8">
                {LINKS.map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    aria-label={link.label}
                    className="hover:text-foreground transition-all lg:group-has-[*:hover]/flex:opacity-40 lg:hover:opacity-100"
                  >
                    {link.icon}
                  </a>
                ))}
              </div>

              <a
                href="/"
                aria-label="Home"
                className="hover:text-foreground transition-all"
              >
                <Logo size={100} />
              </a>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3 md:mt-0">
              <p className="text-foreground font-semibold">Navigate</p>
              <ul className="flex gap-4 text-center md:flex-col md:gap-2.5">
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
              <p className="text-center">
                Frontend Engineer based in Indonesia
              </p>
            </div>

            <div className="mt-10 w-full max-w-xs md:mt-0 md:justify-self-end">
              <div className="md:h-36">
                <LetterGlitch glitchColors={['#35530e', '#7ccf00']} />
              </div>
              {/* label on its own line, so a narrow column never splits a tool's name */}
              <div className="mt-3 text-center md:text-end">
                <p>Free tools</p>
                <ul className="flex justify-center gap-2 md:justify-end">
                  {TOOLS.map((tool, i) => (
                    <li key={tool.href} className="whitespace-nowrap">
                      {i > 0 && <span aria-hidden>· </span>}
                      <a
                        href={tool.href}
                        className="text-foreground font-semibold hover:underline"
                      >
                        {tool.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className={cn('py-4', !minimal && 'border-t')}>
          <p className="text-center">
            Copyright © {new Date().getFullYear()} Aditya Hamda. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
