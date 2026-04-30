import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HeroAnimatedTextProps {
  children: React.ReactNode;
  className?: string;
}

export function HeroAnimatedText({ children, className }: HeroAnimatedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const text = textRef.current;
    if (!container || !text) return;

    const ctx = gsap.context(() => {
      // 1. Entrance Animation (on reload): Animates the inner text from bottom to top
      gsap.fromTo(
        text,
        { y: 100, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1.5, ease: 'expo.out' }
      );

      // 2. Scroll Animation: Animates the outer container pushing upward and hiding
      // Isolated from the inner text animation to prevent conflicts.

    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="will-change-transform">
      <h1 ref={textRef} className={className} style={{ visibility: 'hidden' }} // Prevent FOUC, GSAP will handle opacity
      >
        {children}
      </h1>
    </div>
  );
}
