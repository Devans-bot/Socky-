import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function useTextReveal() {
  const elementRef = useRef<HTMLDivElement | HTMLHeadingElement | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Set initial state: moved down and invisible
    gsap.set(element, { 
      y: 100, 
      opacity: 0,
      visibility: 'visible' 
    });

    const ctx = gsap.context(() => {
      // Use fromTo with scrub for bidirectional scroll
      gsap.fromTo(element,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 95%',
            end: 'top 55%',
            // play on enter, reverse on leave back (scroll up)
            toggleActions: 'play none none reverse',
          }
        }
      );
    }, element);

    return () => ctx.revert();
  }, []);

  return elementRef;
}
