import { useLang } from '@/components/language-provider';
import ScrollVelocity from '@/components/scroll-velocity';
import { ShinyText } from '@/components/shiny-text';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { EXPERIENCES } from '@/lib/aditya';
import { translations } from '@/lib/i18n';

const T = translations(
  {
    eyebrow: '⚡︎ Work History',
    title: 'Experience',
    intro:
      "Where I've worked and what I did there, from government and banking to enterprise platforms.",
    years: 'Years of Shipping Web & Mobile Products',
    summary:
      'From national procurement to core banking and enterprise platforms. These days most of my time goes into architecture, PR reviews, and helping new teammates get up to speed.',
  },
  {
    eyebrow: '⚡︎ Riwayat Kerja',
    title: 'Pengalaman',
    intro:
      'Pernah kerja di mana aja dan ngapain aja di sana, dari pemerintahan, perbankan, sampai platform enterprise.',
    years: 'Tahun Bikin Produk Web & Mobile',
    summary:
      'Dari pengadaan nasional sampai core banking dan platform enterprise. Sekarang waktuku lebih banyak habis buat arsitektur, review PR, dan bantu rekan baru cepat nyambung sama codebase.',
  }
);

const Experience = () => {
  const { lang } = useLang();
  const t = T[lang];

  return (
    <section
      id="experience"
      className="space-y-10 border-b py-16 sm:scroll-mt-(--header-height)"
    >
      <div className="container grid grid-cols-1 gap-6 md:grid-cols-5">
        <div className="relative md:col-span-2">
          <div className="sticky top-[calc(var(--header-height)+2rem)] space-y-4">
            <ShinyText
              text={t.eyebrow}
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
            <h2 className="text-4xl font-bold lg:text-5xl">{t.title}</h2>
            <p className="text-muted-foreground text-sm md:text-base">
              {t.intro}
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
                    {exp.duration[lang]}
                  </span>
                </AccordionTrigger>

                <AccordionContent>
                  <ul className="text-muted-foreground list-disc space-y-2 pl-4">
                    {exp.jobdesc[lang].map((desc, index) => (
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
            <span className="sr-only">5⁺</span> {t.years}
          </h3>

          <p className="text-muted-foreground text-sm md:text-base">
            {t.summary}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Experience;
