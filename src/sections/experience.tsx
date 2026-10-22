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
        'Government E-Procurement Platform: Building features across multiple apps in a large Next.js, React, and TypeScript monorepo (Turborepo) for a national-scale procurement platform.',
        'Order & Contract Lifecycle: Own end-to-end order flows, including order review, contract approval, and contract amendments with before/after comparison previews and payment schedule changes.',
        'Legacy Migration: Migrated key flows from a legacy app into a new app, reusing shared modules to keep behaviour consistent.',
        'PDF Document Generation: Generated official, print-ready contract documents with React PDF, handling page breaks, long-text wrapping, and font coverage.',
        'Typed Data Layer: Built against GraphQL APIs with typed codegen, React Query, and Zod-validated forms, working closely with backend, QA, and product teams.',
        'Code Quality: Kept quality high through code reviews, CI checks (typecheck, lint, build), static analysis fixes, and shared UI components over one-off styling.',
      ],
    },
    {
      id: 'bank-jakarta',
      company: 'Bank Jakarta',
      role: 'Frontend Engineer',
      duration: 'Jun 2026 - Jul 2026',
      jobdesc: [
        'Core Banking Feature Delivery: Built Branch Delivery System (BDS) modules that let tellers process cash deposits, withdrawals, and internal/external transfers.',
        'Architecture & Project Setup: Initialized the frontend project from scratch in full compliance with enterprise development guidelines.',
        "Custom UI Implementation: Translated Figma designs into pixel-perfect interfaces by customizing Ant Design components to match the bank's design system.",
        'Multi-Transaction State Flow: Engineered a global state flow that lets tellers run multiple concurrent transactions within a single session.',
        'Optimization & Clean Code: Applied code-splitting and clean code principles to reduce bundle size, speed up load times, and keep the codebase maintainable.',
      ],
    },
    {
      id: 'edot',
      company: 'PT. Elektronik Distribusi Otomatisasi Terkemuka (eDOT)',
      role: 'Frontend Engineer',
      duration: 'Jan 2024 - May 2026',
      jobdesc: [
        'SEO & Headless CMS Integration: Developed a high-performance company landing page integrated with a Headless CMS, enabling the SEO team to manage and update content independently while maintaining optimal search engine visibility.',
        'Micro Frontend Architecture: Engineered and maintained scalable web applications using Micro Frontend architecture to improve modularity and streamline cross-team development.',
        'Document Management System (DMS): Developed a robust DMS module focusing on complex file handling, versioning, and high-performance data rendering using React/Next.js.',
        'Automated Testing & Quality Assurance: Implemented comprehensive Unit Testing and integration tests to ensure code reliability, reducing bugs and maintaining a stable production environment.',
        'Real-time Interaction: Developed low-latency real-time chatting features, ensuring seamless user communication and synchronized data states.',
        'Performance Optimization: Optimized application performance by implementing code-splitting, lazy loading, and efficient State Management, resulting in faster load times and a smoother user experience.',
        'Clean Architecture: Applied Clean Architecture principles and integrated GraphQL/REST APIs to ensure a clean, maintainable, and scalable codebase.',
        'AI-Enhanced Workflow: Leveraged AI-assisted coding to accelerate development cycles and deliver high-quality features with maximum efficiency.',
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
              Here's a look at my professional journey and the impactful roles
              I've undertaken.
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
            <span className="sr-only">5⁺</span> Years of Building Better Web &
            Mobile Apps
          </h3>

          <p className="text-muted-foreground text-sm md:text-base">
            Over half a decade of experience in driving digital transformation.
            Specialized in crafting SEO-friendly landing pages and
            high-performance applications through modern micro-frontend
            architectures and seamless API integrations.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Experience;
