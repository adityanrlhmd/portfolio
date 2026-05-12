import ShinyText from '@/components/shiny-text';

const Projects = () => {
  return (
    <section id="projects" className="border-b py-16">
      <div className="container">
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
          <p className="text-foreground/80 text-sm md:text-base">
            A curated collection of my journey in frontend engineering. Each
            project marks a milestone in mastering complex architectures and my
            commitment to crafting better digital experiences.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Projects;
