import ScrollVelocity from '@/components/scroll-velocity';
import ShinyText from '@/components/shiny-text';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const Experience = () => {
  const experience = [
    {
      id: 'edot',
      company: 'PT. Elektronik Distribusi Otomatisasi Terkemuka (eDOT)',
      role: 'Front End Developer',
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
        'Develop user interfaces for web and mobile applications using ReactJS, React Native, Next.js, Vue.js, and Tailwind CSS.',
        'Build server-side applications using Node.js, including data processing and integration with databases or external services.',
        'Utilize Supabase for data storage, real-time updates, and user authentication.',
        'Develop cross-platform mobile applications using React Native (Expo).',
        'Develop native iOS applications using Swift and SwiftUI.',
        'Implement animations and transitions using Framer Motion.',
        'Optimize application performance through caching and minimizing network requests.',
        'Write clean and maintainable code using TypeScript, Swift, and relevant languages.',
      ],
    },
    {
      id: 'leslar',
      company: 'LESLAR Metaverse',
      role: 'Front End Developer',
      duration: 'Aug 2022 - Mar 2023',
      jobdesc: [
        'Develop web and mobile user interfaces using ReactJS, React Native, and Next.js.',
        'Integrate with Moralis and Web3 for blockchain interaction and dApp handling.',
        'Build server-side applications using Node.js, including data processing and database integration.',
        'Design and implement optimized GraphQL APIs, defining schemas and resolving queries and mutations.',
        'Develop cross-platform mobile applications using React Native (Expo), leveraging platform-specific features and UI components.',
        'Collaborate with designers to implement UI/UX designs and ensure consistency across applications.',
      ],
    },
    {
      id: 'trees-studio',
      company: 'Trees Studio',
      role: 'Web Developer',
      duration: 'Sep 2021 - Aug 2022',
      jobdesc: [
        'Build a full stack website project with the team.',
        'Create user friendly Front End Web App.',
        'Create responsive layout website and mobile app.',
        'Collaborate with designer dan other programmer to build great apps.',
        'Implementation of javascript frameworks like Reactjs and Nextjs.',
      ],
    },
    {
      id: 'omindtech',
      company: 'OmindTech',
      role: 'Front End Developer',
      duration: 'Apr 2021 - Nov 2021',
      jobdesc: [
        "Designing and building a landing page for the agency's company profile information system.",
        'Implement CSS and JavaScript frameworks such as Bootstrap and VueJS.',
        'Using CSS preprocessor, namely SASS (Syntactically Awesome Style Sheets).',
        'Ensuring web design is optimized for mobile devices.',
        'Developing features to enhance web user experience.',
      ],
    },
  ];

  return (
    <section id="experience" className="space-y-10 border-b py-16">
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
