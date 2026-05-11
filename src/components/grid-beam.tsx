import { motion } from 'framer-motion';

import React from 'react';

import { cn } from '@/lib/utils';

export const GridBeam: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn('bg-grid relative h-full w-full', className)}>
    <Beam />
    {children}
  </div>
);

export const Beam = () => {
  return (
    <svg
      width="156"
      height="63"
      viewBox="0 0 156 63"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute top-0 left-0 mt-8 ml-24"
    >
      <path
        d="M31 .5h32M0 .5h32m30 31h32m-1 0h32m-1 31h32M62.5 32V0m62 63V31"
        stroke="url(#grad1)"
        strokeWidth={1.5}
      />
      <defs>
        <motion.linearGradient
          id="grad1"
          variants={{
            initial: {
              x1: '40%',
              x2: '50%',
              y1: '160%',
              y2: '180%',
            },
            animate: {
              x1: '0%',
              x2: '10%',
              y1: '-40%',
              y2: '-20%',
            },
          }}
          animate="animate"
          initial="initial"
          transition={{
            duration: 1.8,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
            repeatDelay: 1,
          }}
        >
          <stop style={{ stopColor: 'var(--chart-5)' }} stopOpacity="0" />
          <stop style={{ stopColor: 'var(--chart-1)' }} />
          <stop offset="0.325" style={{ stopColor: 'var(--primary)' }} />
          <stop
            offset="1"
            style={{ stopColor: 'var(--primary)' }}
            stopOpacity="0"
          />
        </motion.linearGradient>
      </defs>
    </svg>
  );
};
