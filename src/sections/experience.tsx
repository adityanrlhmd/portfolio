import ScrollVelocity from '@/components/scroll-velocity';
import { ShinyText } from '@/components/shiny-text';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { EXPERIENCES } from '@/lib/aditya';

const Experience = () => {
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
            {EXPERIENCES.map(exp => (
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
