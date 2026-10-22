export const AnnouncementBar = () => {
  return (
    <div
      data-slot="announcement-bar"
      className="bg-primary text-primary-foreground"
    >
      <div className="container py-2 text-center text-xs">
        <p>
          New: build your resume with my template, live PDF preview included.{' '}
          <a href="/resume" className="font-bold hover:underline">
            Try the Resume Builder →
          </a>
        </p>
      </div>
    </div>
  );
};
