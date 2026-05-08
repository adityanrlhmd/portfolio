import Lanyard from '@/components/lanyard';
import TextType from '@/components/text-type';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const headlines = [
    'Welcome to **my digital space**',
    'A **frontend engineer** & typescript enthusiast',
    'Transforming complex logic into **seamless experiences**',
    "Let's create something **impactful** together",
  ];

  return (
    <section id="home" className="container mx-auto">
      <div className="flex flex-col items-center gap-8 lg:flex-row">
        <div className="h-[600px] w-full lg:h-[calc(100vh-var(--header-height))] lg:w-1/3">
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
            A frontend engineer & TypeScript enthusiast
          </h1>

          <p className="text-sm md:text-base lg:text-lg">
            I develop scalable frontend architectures with a focus on
            type-safety and performance, ensuring every line of code contributes
            to a fast and reliable digital product.
          </p>

          <Button
            size="lg"
            className="decrypted-btn hover:bg-primary h-12 px-4 text-base lg:h-14"
          >
            <span>My Resume</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
