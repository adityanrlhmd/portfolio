import { RiExternalLinkLine } from '@remixicon/react';

import cuantv from '@/assets/projects/cuantv.png';
import edotChat from '@/assets/projects/edot-chat.png';
import edotLP from '@/assets/projects/edot-landing-page.png';
import emitra from '@/assets/projects/emitra.png';
import esuite from '@/assets/projects/esuite.png';
import ework from '@/assets/projects/ework.png';
import hodler from '@/assets/projects/hodler.png';
import leslar from '@/assets/projects/leslar.png';
import phantom from '@/assets/projects/phantom.png';
import prestige from '@/assets/projects/prestige.png';
import qsr from '@/assets/projects/qsr.png';
import rooma from '@/assets/projects/rooma.png';

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

const PROJECTS = [
  {
    title: 'eDOT Landing Page',
    alter: 'Company Profile',
    category: 'Web',
    image: edotLP,
    img_padding: true,
    description:
      'A high-performance company landing page optimized for SEO. I implemented a Headless CMS integration using Directus, enabling the SEO team to manage and update content independently. Built with Next.js for superior performance and TanStack Query for efficient data fetching and caching.',
    link: 'https://edot.id/en',
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS['shadcn-ui'],
      SKILLS.typescript,
      SKILLS.directus,
      SKILLS['react-query'],
      SKILLS.jest,
      SKILLS['testing-library'],
      SKILLS.git,
    ],
  },
  {
    title: 'emitra',
    alter: 'Company Platform',
    category: 'Web',
    image: emitra,
    img_padding: true,
    description:
      'Contributed to the architectural migration from a monolithic Next.js setup to a Micro Frontend structure using Turborepo. I worked on modularizing components and features while implementing Zustand for lightweight state management and TanStack Query for efficient API integration and caching.',
    link: 'https://edot.id/en/products/emitra',
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS['shadcn-ui'],
      SKILLS.typescript,
      SKILLS['react-query'],
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
    alter: 'Company Platform',
    category: 'Web',
    image: esuite,
    img_padding: true,
    description:
      'An integrated business solution platform designed for corporate efficiency. I leveraged Next.js and Shadcn UI to build a cohesive interface, while utilizing TanStack Query for robust state management and Firebase for real-time features, all backed by comprehensive testing to ensure reliability.',
    link: 'https://edot.id/en/products/esuite',
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS['shadcn-ui'],
      SKILLS.typescript,
      SKILLS['react-query'],
      SKILLS.jest,
      SKILLS['testing-library'],
      SKILLS.firebase,
      SKILLS.sonarqube,
      SKILLS.git,
    ],
  },
  {
    title: 'ework',
    alter: 'Company Platform',
    category: 'Web',
    image: ework,
    img_padding: true,
    description:
      'A dynamic workforce management tool featuring real-time collaboration. I integrated Socket.io for live updates and Google Maps API for location-based services. The project utilizes a modern stack of Next.js and Tailwind CSS, focusing on a responsive and interactive user experience.',
    link: 'https://edot.id/en/products/ework',
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS['shadcn-ui'],
      SKILLS.typescript,
      SKILLS['react-query'],
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
    alter: 'Company Platform',
    category: 'Web',
    image: qsr,
    img_padding: true,
    description:
      'A specialized Point of Sale system tailored for fast-paced restaurant environments. Developed using Next.js within a Turborepo environment, I implemented complex business logic and state management with TanStack Query to ensure fast transaction processing and seamless UI responsiveness.',
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS['shadcn-ui'],
      SKILLS.typescript,
      SKILLS['react-query'],
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
    img_padding: true,
    description:
      'An enterprise-grade messaging platform designed for high-performance real-time communication. I integrated Socket.io for instant data synchronization and leveraged IndexedDB for persistent local storage, combined with TanStack Query to manage complex message caching and ensure seamless performance even with large conversation histories.',
    stacks: [
      SKILLS['next-js'],
      SKILLS.tailwindcss,
      SKILLS['shadcn-ui'],
      SKILLS.typescript,
      SKILLS['react-query'],
      SKILLS['socket-io'],
      SKILLS['indexed-db'],
      SKILLS.git,
    ],
  },
  {
    title: 'Prestige Promotions',
    alter: 'Company Profile',
    category: 'Web',
    image: prestige,
    description:
      'A high-performance Company Profile website built for an event promoter. I focused on creating a seamless user experience using Next.js and Framer Motion for fluid animations, while implementing Directus as a Headless CMS to allow the team to manage content dynamically and efficiently.',
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
    description:
      'A robust Booking Application designed for the nightlife and entertainment industry. I utilized Zustand for scalable state management and Supabase for real-time database capabilities and secure authentication, all wrapped in a clean UI powered by Ant Design.',
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
    alter: 'Cryptocurrency web.',
    category: 'Web',
    image: hodler,
    description:
      'A modern Cryptocurrency web platform built with a focus on speed and reliability. By using TypeScript and Next.js, I ensured a type-safe codebase and optimized performance, providing users with a fast and responsive interface to explore the crypto ecosystem.',
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
    description:
      'An Interior Design Reservation platform that streamlines the booking process between clients and designers. I leveraged Supabase for backend services to handle user data and reservations instantly, integrated with a sleek, responsive frontend built using Next.js.',
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
    alter: 'Multi-purpose video platform with Web3',
    category: 'Mobile',
    image: cuantv,
    description:
      'A Multi-purpose Video Platform that integrates Web3 technology into a mobile experience. Developed with React Native, this app features a cross-platform interface where users can interact with video content and blockchain assets through Moralis and Web3 integrations.',
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
    alter: 'Blockchain Web',
    category: 'Web',
    image: leslar,
    description:
      "A specialized Blockchain-integrated web platform. I implemented Web3 functionalities and Moralis to bridge the gap between blockchain smart contracts and the user interface, providing a gateway into the project's digital ecosystem.",
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
    <section id="projects" className="border-b py-16">
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
            A curated collection of my journey in frontend engineering. Each
            project marks a milestone in mastering complex architectures and my
            commitment to crafting better digital experiences.
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
                  <a
                    href={project.link}
                    target="_blank"
                    className={cn(
                      'flex items-center gap-2 text-xs',
                      project.link
                        ? 'hover:text-primary'
                        : 'pointer-events-none'
                    )}
                  >
                    {project.category}
                    {project.link && <RiExternalLinkLine size={20} />}
                  </a>
                </CardAction>
              </CardHeader>

              <CardContent className="text-muted-foreground">
                <p>{project.description}</p>
              </CardContent>

              <CardFooter>
                <ul className="flex flex-wrap gap-2">
                  {project.stacks.map((stack, index) => (
                    <li key={index}>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="border p-2">
                            <img
                              src={stack.icon}
                              alt={stack.name}
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
