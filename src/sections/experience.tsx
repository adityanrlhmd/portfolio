import ScrollVelocity from '@/components/scroll-velocity';
import { ShinyText } from '@/components/shiny-text';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const Experience = () => {
  const experience = [
    {
      id: 'govtech-procurement',
      company: 'GovTech Procurement',
      role: 'Frontend Engineer',
      duration: 'Jul 2026 - Present',
      jobdesc: [
        'Government E-Procurement Platform: Building features across several apps in a large Next.js, React, and TypeScript monorepo (Turborepo) for a national procurement platform.',
        'Order & Contract Flows: Own the order and contract flows end to end, from order review and contract approval to amendments with before/after previews and payment schedule changes.',
        'Legacy Migration: Moved key flows from the old app to the new one, reusing shared modules so everything still behaves the same.',
        'Contract PDFs: Generate official, print-ready contract documents with React PDF, sorting out page breaks, long text, and font coverage along the way.',
        'Typed Data Layer: Work with GraphQL APIs using typed codegen, TanStack Query, and Zod-validated forms, together with the backend, QA, and product teams.',
        'Code Reviews & Quality: Review PRs to make sure both the code and the business logic hold up, keep CI checks (typecheck, lint, build) green, and push for shared UI components over one-off styling.',
      ],
    },
    {
      id: 'bank-jakarta',
      company: 'Bank Jakarta',
      role: 'Frontend Engineer',
      duration: 'Jun 2026 - Jul 2026',
      jobdesc: [
        'Core Banking Features: Built Branch Delivery System (BDS) modules so tellers can handle cash deposits, withdrawals, and internal/external transfers.',
        "Project Setup: Set up the frontend project from scratch, following the bank's development guidelines.",
        "UI Implementation: Turned Figma designs into working screens by customizing Ant Design components to fit the bank's design system.",
        'Multi-Transaction Flow: Designed the state flow that lets a teller run several transactions at once in a single session.',
        'Performance & Maintainability: Used code-splitting to keep the bundle small and pages quick to load, and kept the code easy to work on.',
      ],
    },
    {
      id: 'edot',
      company: 'PT. Elektronik Distribusi Otomatisasi Terkemuka (eDOT)',
      role: 'Frontend Engineer',
      duration: 'Jan 2024 - May 2026',
      jobdesc: [
        'Micro Frontends: Built and maintained apps on a micro frontend setup, so each team could work on and ship its part without stepping on the others.',
        "Architecture Discussions: Talked through architecture options with the team, weighing what fits and what doesn't before we committed to one.",
        "Onboarding: Walked new teammates through how the codebase is structured, why it's set up that way, and how new features should fit in.",
        'Landing Page & Headless CMS: Built the company landing page on a headless CMS, so the SEO team could update content on their own without hurting search visibility.',
        'Document Management System: Built the DMS module, covering file handling, versioning, and rendering large amounts of data smoothly.',
        'Real-time Chat: Built the real-time chat, keeping messages and state in sync for everyone in the conversation.',
        'Testing & Performance: Wrote unit and integration tests to catch bugs before production, and used code-splitting and lazy loading to keep things fast.',
      ],
    },
    {
      id: 'kodx',
      company: 'KodX',
      role: 'Software Engineer',
      duration: 'Apr 2023 - Dec 2023',
      jobdesc: [
        'Built web and mobile interfaces with React, Next.js, Vue.js, React Native, and Tailwind CSS.',
        'Developed Node.js services for data processing and integration with databases and third-party APIs.',
        'Used Supabase for data storage, real-time updates, and user authentication.',
        'Shipped cross-platform mobile apps with React Native (Expo) and native iOS apps with Swift and SwiftUI.',
        'Crafted smooth animations and transitions with Framer Motion.',
        'Improved performance through caching and reducing redundant network requests.',
      ],
    },
    {
      id: 'leslar',
      company: 'LESLAR Metaverse',
      role: 'Frontend Engineer',
      duration: 'Aug 2022 - Mar 2023',
      jobdesc: [
        'Built web and mobile interfaces with React, Next.js, and React Native (Expo).',
        'Integrated Moralis and Web3 for blockchain interactions and dApp features.',
        'Designed GraphQL schemas, queries, and mutations backed by Node.js services.',
        'Worked closely with designers to keep UI/UX consistent across web and mobile.',
      ],
    },
    {
      id: 'trees-studio',
      company: 'Trees Studio',
      role: 'Web Developer',
      duration: 'Sep 2021 - Aug 2022',
      jobdesc: [
        'Delivered full-stack website projects as part of a cross-functional team.',
        'Built responsive, user-friendly web apps with React and Next.js.',
        'Collaborated with designers and engineers from design handoff to release.',
      ],
    },
    {
      id: 'omindtech',
      company: 'OmindTech',
      role: 'Frontend Engineer (Internship)',
      duration: 'Apr 2021 - Nov 2021',
      jobdesc: [
        'Designed and built the company profile landing page for the agency.',
        'Developed mobile-first, responsive layouts with Vue.js, Bootstrap, and Sass.',
        'Shipped UI improvements to enhance the overall user experience.',
      ],
    },
  ];

  return (
    <section
      id="experience"
      className="space-y-10 border-b py-16 sm:scroll-mt-(--header-height)"
    >
      <div className="container grid grid-cols-1 gap-6 md:grid-cols-5">
        <div className="relative md:col-span-2">
          <div className="sticky top-[calc(var(--header-height)+2rem)] space-y-4">
            <ShinyText
              text="⚡︎ Work History"
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
            <h2 className="text-4xl font-bold lg:text-5xl">Experience</h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Where I've worked and what I did there, from government and
              banking to enterprise platforms.
            </p>
          </div>
        </div>

        <div className="md:col-span-3">
          <Accordion>
            {experience.map(exp => (
              <AccordionItem key={exp.id} value={exp.id}>
                <AccordionTrigger hideArrow className="items-end">
                  <div className="flex flex-col text-base">
                    {exp.company}
                    <span className="text-muted-foreground text-xs">
                      {exp.role}
                    </span>
                  </div>

                  <span className="text-muted-foreground whitespace-nowrap">
                    {exp.duration}
                  </span>
                </AccordionTrigger>

                <AccordionContent>
                  <ul className="text-muted-foreground list-disc space-y-2 pl-4">
                    {exp.jobdesc.map((desc, index) => (
                      <li key={index}>{desc}</li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      <div className="flex flex-col space-y-2 text-center">
        <div className="relative">
          <ScrollVelocity
            texts={['DEVELOPMENT • ARCHITECTURE • INTERFACE •']}
            velocity={100}
            className="text-stroke pointer-events-none text-[14rem] leading-[0.8] font-black md:text-[17rem]"
            numCopies={2}
            damping={50}
            stiffness={400}
          />

          <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 translate-y-[-45%]">
            <ShinyText
              text="5⁺"
              speed={2}
              delay={0}
              color="var(--primary)"
              shineColor="#ffffff"
              spread={120}
              direction="left"
              yoyo={false}
              pauseOnHover={false}
              disabled={false}
              className="text-primary text-[8rem] font-bold md:text-[10rem]"
            />
          </div>
        </div>

        <div className="container max-w-4xl space-y-4">
          <h3 className="text-3xl font-bold md:text-4xl">
            <span className="sr-only">5⁺</span> Years of Shipping Web & Mobile
            Products
          </h3>

          <p className="text-muted-foreground text-sm md:text-base">
            From national procurement to core banking and enterprise platforms.
            These days most of my time goes into architecture, PR reviews, and
            helping new teammates get up to speed.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Experience;
