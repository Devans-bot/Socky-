import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function useCarouselExpand() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      // Animate from a centered, narrower width to full screen width
      gsap.fromTo(element, 
        { 
          width: '65%',
          borderRadius: '24px'
        },
        {
          width: '100%',
          borderRadius: '0px', // Go to sharp edges for full screen feel
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%', // Start expanding when the top hits 80% of viewport
            end: 'top 20%',   // Fully expanded when the top hits 20%
            scrub: true,      // Smoothly link animation to scroll progress
          }
        }
      );
    }, element);

    return () => ctx.revert();
  }, []);

  return containerRef;
}
