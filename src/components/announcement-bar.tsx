const AnnouncementBar = () => {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="container py-2 text-center text-xs">
        <p>
          <span className="hidden sm:inline-block">
            Building a better showcase for my work.
          </span>{' '}
          Curious about what I've been up to?{' '}
          <a
            href="https://www.linkedin.com/in/adityanurulhamda/"
            target="_blank"
            className="font-bold hover:underline"
          >
            Catch me on LinkedIn →
          </a>
        </p>
      </div>
    </div>
  );
};

export default AnnouncementBar;
