import {
  RiGithubFill,
  RiLinkedinBoxFill,
  RiMailFill,
  RiReactjsFill,
  RiTailwindCssFill,
  RiVercelFill,
} from '@remixicon/react';

import { Logo } from '@/assets/logo';

import LetterGlitch from './letter-glitch';

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
    href: 'mailto:adityanurulhamda@gmail.com',
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

          <ul className="mt-5 space-y-1.5 md:mt-0">
            <li className="flex items-center gap-2">
              <span>Build with</span> <RiReactjsFill /> React.js
            </li>
            <li className="flex items-center gap-2">
              <span>Styled with</span> <RiTailwindCssFill /> Tailwind CSS
            </li>
            <li className="flex items-center gap-2">
              <span>Deployed on</span> <RiVercelFill /> Vercel
            </li>
          </ul>

          <div className="mt-10 max-w-md md:mt-0 lg:max-w-2xl">
            <LetterGlitch glitchColors={['#35530e', '#7ccf00']} />
          </div>
        </div>

        <div className="border-t py-4">
          <p className="text-center">
            Copyright © 2026 Aditya Hamda. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
