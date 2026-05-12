import ShinyText from '@/components/shiny-text';

const Projects = () => {
  return (
    <section id="projects" className="border-b py-16">
      <div className="container">
        <div className="max-w-3xl space-y-4">
          <ShinyText
            text="⚡︎ My Work"
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
            A showcase of my journey and evolution in frontend engineering. Each
            project represents a milestone in mastering complex architectures
            and my continuous commitment to building better, more efficient
            digital experiences.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Projects;
