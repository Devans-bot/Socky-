import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface CarouselAnimatedWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function CarouselAnimatedWrapper({ children, className }: CarouselAnimatedWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // Select the inner carousel container to also animate its border radius if needed
      const innerCarousel = container.querySelector('.rounded-2xl');

      // Animate the wrapper to fill the screen (100% width, 0 padding)
      gsap.fromTo(container,
        {
          scale: 0.85,
          y: -10,
        },
        {
          scale: 1,

          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: 'top 25%',
            end: 'top 80%',
            scrub: 1,
          },
        }
      );
      // Flatten the borders for a full-bleed effect as it expands

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
