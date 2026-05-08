import AutoScroll from 'embla-carousel-auto-scroll';

import cssIcon from '@/assets/skills/css.svg';
import expoIcon from '@/assets/skills/expo.svg';
import expressIcon from '@/assets/skills/expressjs.svg';
import framermotionIcon from '@/assets/skills/framer-motion.svg';
import gitIcon from '@/assets/skills/git.svg';
import htmlIcon from '@/assets/skills/html.svg';
import javascriptIcon from '@/assets/skills/javascript.svg';
import mongodbIcon from '@/assets/skills/mongodb.svg';
import mysqlIcon from '@/assets/skills/mysql.svg';
import nextjsIcon from '@/assets/skills/nextjs.svg';
import nodejsIcon from '@/assets/skills/nodejs.svg';
import reactIcon from '@/assets/skills/react.svg';
import reduxIcon from '@/assets/skills/redux.svg';
import supabaseIcon from '@/assets/skills/supabase.svg';
import swiftIcon from '@/assets/skills/swift.svg';
import swiftuiIcon from '@/assets/skills/swiftui.svg';
import tailwindIcon from '@/assets/skills/tailwindcss.svg';
import typescriptIcon from '@/assets/skills/typescript.svg';
import zustandIcon from '@/assets/skills/zustand.svg';
import Lanyard from '@/components/lanyard';
import TextType from '@/components/text-type';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

const SKILLS = [
  { name: 'HTML', icon: htmlIcon },
  { name: 'CSS', icon: cssIcon },
  { name: 'JavaScript', icon: javascriptIcon },
  { name: 'TypeScript', icon: typescriptIcon },
  { name: 'Node.js', icon: nodejsIcon },
  { name: 'React.js', icon: reactIcon },
  { name: 'Next.js', icon: nextjsIcon },
  { name: 'React Native', icon: reactIcon },
  { name: 'Expo', icon: expoIcon },
  { name: 'Redux', icon: reduxIcon },
  { name: 'Zustand', icon: zustandIcon },
  { name: 'TailwindCSS', icon: tailwindIcon },
  { name: 'Framer Motion', icon: framermotionIcon },
  { name: 'Express.js', icon: expressIcon },
  { name: 'Supabase', icon: supabaseIcon },
  { name: 'MongoDB', icon: mongodbIcon },
  { name: 'MySQL', icon: mysqlIcon },
  { name: 'Swift', icon: swiftIcon },
  { name: 'SwiftUI', icon: swiftuiIcon },
  { name: 'GIT', icon: gitIcon },
];

const Hero = () => {
  const headlines = [
    'Welcome to **my digital space**',
    'A **frontend engineer** & typescript enthusiast',
    'Transforming complex logic into **seamless experiences**',
    "Let's create something **impactful** together",
  ];

  return (
    <section id="home" className="relative">
      <div className="container mx-auto flex flex-col items-center gap-8 lg:flex-row">
        <div className="h-[600px] w-full lg:h-[calc(100vh-calc(var(--header-height)+5rem))] lg:w-1/3">
          <Lanyard position={[-5, 0, 15]} gravity={[0, -40, 0]} />
        </div>

        <div className="z-10 w-full space-y-4 p-6 pt-0 lg:w-2/3 lg:p-0">
          <TextType
            text={headlines}
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

          <p className="text-sm md:text-base lg:text-lg">
            I develop scalable frontend architectures with a focus on
            type-safety and performance, ensuring every line of code contributes
            to a fast and reliable digital product.
          </p>

          <Button
            size="lg"
            className="decrypted-btn hover:bg-primary h-12 px-4 text-base font-bold lg:h-14"
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
        className="flex h-20 w-full items-center justify-center border-y"
      >
        <CarouselContent className="-ml-1 items-center">
          {SKILLS.map((skill, index) => (
            <CarouselItem
              key={index}
              className="basis-1/3 pl-1 md:basis-1/6 lg:basis-1/11"
            >
              <div className="p-1">
                <Card className="hover:text-primary h-fit border-none bg-transparent p-0 shadow-none">
                  <CardContent className="flex h-fit items-center justify-center gap-2 px-3 py-2">
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      title={skill.name}
                      className="size-6 object-contain"
                    />
                    <span>{skill.name}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default Hero;
