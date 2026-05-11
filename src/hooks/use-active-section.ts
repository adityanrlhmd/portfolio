import { useEffect, useRef, useState } from 'react';

export function useActiveSection(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);
  // Track which sections are currently intersecting
  const intersectingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const updateActive = () => {
      // Among all currently intersecting sections, pick the one
      // that appears first (topmost) in the sectionIds order.
      const topmost = sectionIds.find((id) => intersectingRef.current.has(id));
      if (topmost) {
        setActiveId(topmost);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.65) {
            intersectingRef.current.add(entry.target.id);
          } else {
            intersectingRef.current.delete(entry.target.id);
          }
        });
        updateActive();
      },
      // Section is only considered active when at least 65% of it is visible.
      { threshold: 0.65 }
    );

    sectionIds?.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      sectionIds?.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, [sectionIds]);

  return activeId;
}
