import { RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react';

import { buttonVariants } from '@/components/ui/button';

// Back keeps the visitor's scroll spot on the portfolio; only when they came from it,
// otherwise (opened directly, from another site, or from the other tool) the link just goes home.
const backToPortfolio = (event: React.MouseEvent) => {
  try {
    const from = new URL(document.referrer);
    if (from.origin !== window.location.origin || from.pathname !== '/') return;
  } catch {
    return; // no referrer
  }
  event.preventDefault();
  window.history.back();
};

export const BackToPortfolio = () => (
  <a
    href="/"
    onClick={backToPortfolio}
    className={buttonVariants({ variant: 'ghost', className: '-ms-2' })}
  >
    <RiArrowLeftLine /> Back to portfolio
  </a>
);

// Back on the left, the other tool on the right, so the two pages link to each other.
export const ToolNav = ({
  next,
}: {
  next: { href: string; label: string };
}) => (
  <div className="flex items-center justify-between gap-2">
    <BackToPortfolio />
    <a
      href={next.href}
      className={buttonVariants({ variant: 'ghost', className: '-me-2' })}
    >
      {next.label} <RiArrowRightLine />
    </a>
  </div>
);
