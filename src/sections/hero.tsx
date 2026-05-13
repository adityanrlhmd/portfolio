import AutoScroll from 'embla-carousel-auto-scroll';

import { GridBeam } from '@/components/grid-beam';
import Lanyard from '@/components/lanyard';
import TextType from '@/components/text-type';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

import { SKILLS } from '@/lib/config';
import { cn } from '@/lib/utils';

const HEADLINES = [
  'Welcome to **my digital space**',
  'A **frontend engineer** & typescript enthusiast',
  'Transforming complex logic into **seamless experiences**',
  "Let's create something **impactful** together",
];

const Hero = () => {
  return (
    <section id="home" className="scroll-mt-(--header-height)">
      <GridBeam>
        <div className="container flex flex-col items-center gap-8 lg:flex-row">
          <div className="h-[500px] w-full lg:h-[calc(100vh-calc(var(--header-height)+5rem))] lg:w-1/3">
            <div className="hidden h-full w-full lg:block">
              <Lanyard position={[-5, 0, 15]} gravity={[0, -40, 0]} />
            </div>

            <div className="h-full w-full lg:hidden">
              <Lanyard position={[-5, 0, 10]} gravity={[0, -40, 0]} />
            </div>
          </div>

          <div className="z-10 w-full space-y-4 pt-0 lg:w-2/3 lg:p-0">
            <TextType
              text={HEADLINES}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor
              cursorCharacter="_"
              deletingSpeed={50}
              variableSpeed={{ min: 60, max: 120 }}
              cursorBlinkDuration={0.5}
              className="text-3xl font-bold lg:text-6xl"
            />
            <h1 className="sr-only">
              A frontend engineer & typescript enthusiast
            </h1>

            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
              I develop scalable frontend architectures with a focus on
              type-safety and performance, ensuring every line of code
              contributes to a fast and reliable digital product.
            </p>

            <Button
              size="lg"
              className="cursor-target decrypted-btn hover:bg-primary h-12 px-4 text-base font-bold lg:h-14"
            >
              <span>My Resume</span>
            </Button>
          </div>
        </div>

        <Carousel
          plugins={[
            AutoScroll({
              stopOnInteraction: false,
              speed: 1.5,
            }),
          ]}
          opts={{ dragFree: true, loop: true, watchDrag: false }}
          className="mt-10 flex h-20 w-full items-center justify-center border-y md:mt-0"
        >
          <CarouselContent className="-ml-1 items-center">
            {Object.values(SKILLS).map((skill, index) => (
              <CarouselItem
                key={index}
                className="basis-[40%] pl-1 md:basis-1/6 lg:basis-1/9 xl:basis-1/11"
              >
                <div className="p-1">
                  <Card className="hover:text-primary h-fit border-none p-0 shadow-none">
                    <CardContent className="flex h-fit items-center justify-center gap-2 border-none px-2 py-2">
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        title={skill.name}
                        className={cn(
                          'size-4 object-contain sm:size-6',
                          skill.inverted && 'dark:invert'
                        )}
                      />
                      <span className="text-xs whitespace-nowrap">
                        {skill.name}
                      </span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </GridBeam>
    </section>
  );
};

export default Hero;
