import { RiDownloadLine } from '@remixicon/react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { toast } from 'sonner';

import { Suspense, lazy, useEffect, useState } from 'react';

import { GridBeam } from '@/components/grid-beam';
import { TextType } from '@/components/text-type';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Spinner } from '@/components/ui/spinner';

import { useMediaQuery } from '@/hooks/use-media-query';

import { SKILLS } from '@/lib/config';
import { ADITYA_RESUME } from '@/lib/resume/aditya';
import { cn } from '@/lib/utils';

// three.js + rapier live in their own chunk so the page renders before the 3D card
const Lanyard = lazy(() =>
  import('@/components/lanyard').then(m => ({ default: m.Lanyard }))
);

const HEADLINES = [
  'Welcome to **my digital space**',
  'A **frontend engineer** who sweats the details',
  'Turning messy business logic into **simple UIs**',
  "Let's **build something** together",
];

const Hero = () => {
  const isLarge = useMediaQuery('(min-width: 1024px)');
  const [downloading, setDownloading] = useState(false);
  // start fetching the 3D card once the page has painted, so it doesn't compete with the first render
  const [show3d, setShow3d] = useState(false);

  useEffect(() => {
    const ric =
      window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 200));
    const cic = window.cancelIdleCallback ?? clearTimeout;
    const id = ric(() => setShow3d(true));
    return () => cic(id);
  }, []);

  const downloadCv = async () => {
    setDownloading(true);
    try {
      // the PDF library only loads when someone actually asks for the CV
      const { downloadResume } = await import('@/pages/resume/download');
      await downloadResume(ADITYA_RESUME);
    } catch {
      toast.error("Couldn't create the CV. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section id="home" className="scroll-mt-(--header-height)">
      <GridBeam>
        <div className="container flex flex-col items-center gap-8 lg:flex-row">
          <div className="h-125 w-full lg:h-[calc(100vh-var(--header-height)-var(--announcement-height)-5rem)] lg:w-1/3">
            <Suspense>
              {/* key remounts the canvas, since the camera is only read on mount */}
              {show3d && (
                <Lanyard
                  key={isLarge ? 'lg' : 'sm'}
                  position={[-5, 0, isLarge ? 15 : 10]}
                  gravity={[0, -40, 0]}
                />
              )}
            </Suspense>
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
              pauseWhenHidden
            />
            <h1 className="sr-only">Aditya Hamda, frontend engineer</h1>

            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
              I build frontends for government, banking, and enterprise
              products. I like owning a feature from the first discussion all
              the way to production, and keeping big codebases tidy enough that
              the next person can work on them without guessing.
            </p>

            <div className="flex flex-wrap gap-3">
              <a
                href="#contact"
                className={cn(
                  buttonVariants({
                    variant: 'default',
                    size: 'lg',
                    className:
                      'decrypted-btn hover:bg-primary h-12 px-4 text-sm/relaxed',
                  })
                )}
              >
                <span>Let's Connect</span>
              </a>
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-12 px-4 text-sm/relaxed"
                disabled={downloading}
                onClick={downloadCv}
              >
                {downloading ? <Spinner /> : <RiDownloadLine />}
                My Resume
              </Button>
            </div>
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
          className="mt-10 flex h-20 w-full items-center justify-center border-y lg:mt-0"
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
                      <span className="line-clamp-1 text-xs">{skill.name}</span>
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
