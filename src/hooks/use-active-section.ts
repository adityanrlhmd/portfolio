import { useEffect, useState } from 'react';

// How much of the VIEWPORT must be covered by a section to be "active".
// This is viewport-coverage based, not element-coverage based —
// so it works correctly even when sections are taller than the viewport (mobile).
const VIEWPORT_COVERAGE_THRESHOLD = 0.65;

export function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const updateActive = () => {
      const viewportHeight = window.innerHeight;
      let bestId: string | null = null;
      let bestCoverage = 0;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;

        const { top, bottom } = el.getBoundingClientRect();

        // Pixels of this section that are currently inside the viewport
        const visibleTop = Math.max(0, top);
        const visibleBottom = Math.min(viewportHeight, bottom);
        const visiblePx = Math.max(0, visibleBottom - visibleTop);

        // Coverage = how much of the VIEWPORT this section fills
        const coverage = visiblePx / viewportHeight;

        if (coverage > bestCoverage) {
          bestCoverage = coverage;
          bestId = id;
        }
      }

      if (bestId && bestCoverage >= VIEWPORT_COVERAGE_THRESHOLD) {
        setActiveId(bestId);
      }
    };

    // IntersectionObserver fires whenever any section enters/leaves —
    // use it to trigger recalculation without blocking the main thread.
    const observer = new IntersectionObserver(() => updateActive(), {
      threshold: Array.from({ length: 21 }, (_, i) => i * 0.05),
    });

    sectionIds?.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Scroll listener for smooth mid-section transitions
    window.addEventListener('scroll', updateActive, { passive: true });

    updateActive(); // initial check on mount

    return () => {
      sectionIds?.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
      window.removeEventListener('scroll', updateActive);
    };
  }, [sectionIds]);

  return activeId;
}
