import { cva } from 'class-variance-authority';

const navigationMenuTriggerStyle = cva(
  'text-foreground/50 hover:text-foreground group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center rounded-lg px-2.5 py-1.5 text-xs/relaxed font-medium transition-all outline-none focus:text-foreground focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-popup-open:text-foreground/80 data-popup-open:hover:text-foreground data-open:text-foreground/80 data-open:hover:text-foreground data-open:focus:text-foreground'
);

export { navigationMenuTriggerStyle };
