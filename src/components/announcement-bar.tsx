export const AnnouncementBar = () => {
  return (
    <div
      data-slot="announcement-bar"
      className="bg-primary text-primary-foreground"
    >
      <div className="container py-2 text-center text-xs">
        <p>
          New: free job search tools, from resume to cover letter.{' '}
          <a href="/tools" className="font-bold hover:underline">
            See the tools →
          </a>
        </p>
      </div>
    </div>
  );
};
