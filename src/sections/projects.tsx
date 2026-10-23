import { RiExternalLinkLine } from '@remixicon/react';

import cuantv from '@/assets/projects/cuantv.webp';
import edotChat from '@/assets/projects/edot-chat.webp';
import edotLP from '@/assets/projects/edot-landing-page.webp';
import emitra from '@/assets/projects/emitra.webp';
import esuite from '@/assets/projects/esuite.webp';
import ework from '@/assets/projects/ework.webp';
import hodler from '@/assets/projects/hodler.webp';
import leslar from '@/assets/projects/leslar.webp';
import phantom from '@/assets/projects/phantom.webp';
import prestige from '@/assets/projects/prestige.webp';
import qsr from '@/assets/projects/qsr.webp';
import rooma from '@/assets/projects/rooma.webp';

import { ShinyText } from '@/components/shiny-text';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { SKILLS } from '@/lib/config';
import { cn } from '@/lib/utils';

// stacks render in the same group order as SKILLS in config
const SKILL_ORDER = Object.values(SKILLS);

const PROJECTS = [
  {
    title: 'emitra',
    alter: 'B2B Marketplace',
    category: 'Web',
    image: emitra,
    imageSize: [1600, 915],
    img_padding: true,
    description:
      'A B2B marketplace where suppliers and large businesses order plant-based products in bulk and track each order live. The single Next.js app kept hitting conflicts on almost every merge request, so I helped split it into micro frontends in Turborepo, giving each part a cleaner home of its own. Zustand for light state, TanStack Query for API calls.',
    link: 'https://edot.id/en/products/emitra',
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS['shadcn-ui'],
      SKILLS.typescript,
      SKILLS.tanstack,
      SKILLS.zustand,
      SKILLS.jest,
      SKILLS.vitest,
      SKILLS['testing-library'],
      SKILLS.firebase,
      SKILLS.sonarqube,
      SKILLS.turborepo,
      SKILLS.git,
    ],
  },
  {
    title: 'esuite',
    alter: 'Distribution Management System',
    category: 'Web',
    image: esuite,
    imageSize: [1076, 608],
    img_padding: true,
    description:
      'Puts sales, purchasing, inventory, and finance in one place for distributors, so stock and orders stop living in spreadsheets and manual notes. I built the UI with Next.js and shadcn/ui, used TanStack Query and Firebase for live data, and covered the important flows with tests.',
    link: 'https://edot.id/en/products/esuite',
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS['shadcn-ui'],
      SKILLS.typescript,
      SKILLS.tanstack,
      SKILLS.jest,
      SKILLS['testing-library'],
      SKILLS.firebase,
      SKILLS.sonarqube,
      SKILLS.git,
    ],
  },
  {
    title: 'ework',
    alter: 'Sales Force Automation',
    category: 'Web',
    image: ework,
    imageSize: [1056, 601],
    img_padding: true,
    description:
      "Gives sales managers a live view of their field team: where they are, which stores they've visited, and what orders came in. I added real-time updates with Socket.io and visit routes and locations with the Google Maps API, on top of Next.js and Tailwind CSS.",
    link: 'https://edot.id/en/products/ework',
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS['shadcn-ui'],
      SKILLS.typescript,
      SKILLS.tanstack,
      SKILLS['socket-io'],
      SKILLS['google-maps'],
      SKILLS.jest,
      SKILLS['testing-library'],
      SKILLS.firebase,
      SKILLS.sonarqube,
      SKILLS.git,
    ],
  },
  {
    title: 'QSR (Quick Service Restaurant) POS System',
    alter: 'Restaurant POS',
    category: 'Web',
    image: qsr,
    imageSize: [974, 550],
    img_padding: true,
    description:
      'A cashier system for busy restaurants, where every second at checkout counts during rush hour. I worked on the transaction logic in Next.js inside Turborepo, using TanStack Query to keep it quick and responsive.',
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS['shadcn-ui'],
      SKILLS.typescript,
      SKILLS.tanstack,
      SKILLS.zustand,
      SKILLS.vitest,
      SKILLS['testing-library'],
      SKILLS.firebase,
      SKILLS.sonarqube,
      SKILLS.turborepo,
      SKILLS.git,
    ],
  },
  {
    title: 'eDOT Chat (Desktop)',
    alter: 'Company Platform',
    category: 'Web',
    image: edotChat,
    imageSize: [1176, 576],
    img_padding: true,
    description:
      'An internal chat app, so companies can keep work conversations in their own tool. Socket.io keeps messages in sync, IndexedDB stores chats locally, and TanStack Query handles caching, so even long histories open quickly.',
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS['shadcn-ui'],
      SKILLS.typescript,
      SKILLS.tanstack,
      SKILLS['socket-io'],
      SKILLS['indexed-db'],
      SKILLS.git,
    ],
  },
  {
    title: 'eDOT Landing Page',
    alter: 'Company Profile',
    category: 'Web',
    image: edotLP,
    imageSize: [1600, 915],
    img_padding: true,
    description:
      'The eDOT company site, where marketing needed to publish and tune content for search without waiting on developers. I connected it to Directus as a headless CMS so the SEO team can do that on their own, with Next.js keeping pages fast.',
    link: 'https://edot.id/en',
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS['shadcn-ui'],
      SKILLS.typescript,
      SKILLS.directus,
      SKILLS.tanstack,
      SKILLS.jest,
      SKILLS['testing-library'],
      SKILLS.git,
    ],
  },
  {
    title: 'Prestige Promotions',
    alter: 'Company Profile',
    category: 'Web',
    image: prestige,
    imageSize: [1600, 965],
    description:
      'A site for an event promoter to show off their events and keep them up to date without calling a developer. Built with Next.js and Framer Motion, with Directus as a headless CMS so the team can update content themselves.',
    link: 'https://prestigepromotions.id',
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS['framer-motion'],
      SKILLS.typescript,
      SKILLS.directus,
      SKILLS.zustand,
      SKILLS.git,
    ],
  },
  {
    title: 'Phantom',
    alter: 'Booking App',
    category: 'Web',
    image: phantom,
    imageSize: [1600, 965],
    description:
      'Lets guests book at nightlife and entertainment venues online, so reservations no longer go through back-and-forth chats. Zustand for state, Supabase for the real-time database and auth, and Ant Design for the UI.',
    link: 'https://phantomclub.id',
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS['ant-design'],
      SKILLS.zustand,
      SKILLS.supabase,
      SKILLS.git,
    ],
  },
  {
    title: 'Hodler',
    alter: 'Crypto Website',
    category: 'Web',
    image: hodler,
    imageSize: [1600, 965],
    description:
      'The front door for a crypto community project: it explains the token and points new holders to where they can buy and join the community. Built with Next.js and TypeScript, kept light so it loads fast.',
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS.typescript,
      SKILLS.zustand,
      SKILLS.git,
    ],
  },
  {
    title: 'Rooma',
    alter: 'Interior Design Reservations',
    category: 'Web',
    image: rooma,
    imageSize: [1600, 965],
    description:
      'Connects clients with interior designers, so booking a consultation takes a few clicks instead of a long back-and-forth. Supabase handles users and reservations, with a responsive Next.js frontend on top.',
    link: 'https://rooma.co.id',
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS.supabase,
      SKILLS.zustand,
      SKILLS.git,
    ],
  },
  {
    title: 'Cuan TV',
    alter: 'Web3 Video Platform',
    category: 'Mobile',
    image: cuantv,
    imageSize: [1600, 965],
    description:
      "Brings the project's video content and Web3 assets together in one mobile app, so users don't need a separate wallet site. Built with React Native for Android and iOS, using Moralis and Web3 for the blockchain side.",
    link: 'https://play.google.com/store/apps/details?id=com.leslarmetaverse.cuantv&pli=1',
    stacks: [
      SKILLS['react-native'],
      SKILLS.expo,
      SKILLS.moralis,
      SKILLS.web3,
      SKILLS.git,
    ],
  },
  {
    title: 'Leslar Metaverse',
    alter: 'Blockchain Website',
    category: 'Web',
    image: leslar,
    imageSize: [1600, 965],
    description:
      'The main entry point into a blockchain project, where users go from reading about it to actually using it. I used Web3 and Moralis to connect the smart contracts to the UI.',
    link: 'https://www.leslarmetaverse.com',
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS.moralis,
      SKILLS.web3,
      SKILLS.git,
    ],
  },
];

const Projects = () => {
  return (
    <section
      id="projects"
      className="border-b py-16 sm:scroll-mt-(--header-height)"
    >
      <div className="container space-y-10">
        <div className="max-w-3xl space-y-4">
          <ShinyText
            text="⚡︎ Selected Works"
            speed={2}
            delay={0}
            color="var(--primary)"
            shineColor="#ffffff"
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
            className="text-primary font-bold"
          />
          <h2 className="text-4xl font-bold lg:text-5xl lg:leading-tight">
            Projects
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Some of the things I've worked on, from enterprise platforms to
            client sites, and what I handled on each.
          </p>
        </div>

        <div className="group/grid grid grid-cols-1 gap-4 md:grid-cols-2">
          {PROJECTS.map((project, index) => (
            <Card
              key={index}
              className="group/card hover:border-primary border-b ring-0 transition-opacity lg:group-has-[*:hover]/grid:opacity-40 lg:hover:opacity-100"
            >
              <div
                className={cn(
                  'relative overflow-hidden',
                  project.img_padding && 'py-4'
                )}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  width={project.imageSize[0]}
                  height={project.imageSize[1]}
                  loading="lazy"
                  decoding="async"
                  className="relative w-full object-cover transition-transform lg:group-hover/card:scale-105"
                />
              </div>

              <CardHeader>
                <CardTitle>
                  <h3>{project.title}</h3>
                </CardTitle>
                <CardDescription>
                  <p>{project.alter}</p>
                </CardDescription>
                <CardAction>
                  {project.link ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${project.title} (${project.category}, opens in a new tab)`}
                      className="hover:text-primary flex items-center gap-2 text-xs"
                    >
                      {project.category}
                      <RiExternalLinkLine size={20} />
                    </a>
                  ) : (
                    <span className="text-xs">{project.category}</span>
                  )}
                </CardAction>
              </CardHeader>

              <CardContent className="text-muted-foreground">
                <p>{project.description}</p>
              </CardContent>

              <CardFooter>
                <ul className="flex flex-wrap gap-2">
                  {[...project.stacks]
                    .sort(
                      (a, b) => SKILL_ORDER.indexOf(a) - SKILL_ORDER.indexOf(b)
                    )
                    .map((stack, index) => (
                      <li key={index}>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="border p-2">
                              <img
                                src={stack.icon}
                                alt={stack.name}
                                loading="lazy"
                                title={stack.name}
                                className={cn(
                                  'size-4 object-contain sm:size-6',
                                  stack.inverted && 'dark:invert'
                                )}
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{stack.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      </li>
                    ))}
                </ul>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
