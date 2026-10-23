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
        <linearGradient id="grad1" x1="40%" x2="50%" y1="160%" y2="180%">
          {/* native SMIL instead of framer-motion: 1.8s sweep, then 1s hold before looping */}
          {(
            [
              ['x1', '40%', '0%'],
              ['x2', '50%', '10%'],
              ['y1', '160%', '-40%'],
              ['y2', '180%', '-20%'],
            ] as const
          ).map(([attr, from, to]) => (
            <animate
              key={attr}
              attributeName={attr}
              values={`${from};${to};${to}`}
              keyTimes="0;0.643;1"
              dur="2.8s"
              repeatCount="indefinite"
            />
          ))}
          <stop style={{ stopColor: 'var(--chart-5)' }} stopOpacity="0" />
          <stop style={{ stopColor: 'var(--chart-1)' }} />
          <stop offset="0.325" style={{ stopColor: 'var(--primary)' }} />
          <stop
            offset="1"
            style={{ stopColor: 'var(--primary)' }}
            stopOpacity="0"
          />
        </linearGradient>
      </defs>
    </svg>
  );
};
