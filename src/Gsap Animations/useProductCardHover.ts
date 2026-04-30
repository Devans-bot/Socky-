import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export function useProductCardHover() {
  const cardRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // We use matchMedia to only apply the animation on desktop (md breakpoint: 768px)
    const isDesktop = window.matchMedia('(min-width: 768px)');
    
    // We use gsap.context to ensure cleanup of all tweens created within it
    const ctx = gsap.context(() => {
      const onMouseEnter = () => {
        if (!isDesktop.matches) return;
        
        // Generate a random tilt between -5 and 5 degrees, excluding values close to 0
        const randomTilt = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 3 + 2); 
        
        gsap.to(card, {
          rotation: randomTilt,
          scale: 1.1,
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto"
        });
      };
      
      const onMouseLeave = () => {
        if (!isDesktop.matches) return;
        
        gsap.to(card, {
          rotation: 0,
          scale: 1,
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto"
        });
      };
      
      card.addEventListener('mouseenter', onMouseEnter);
      card.addEventListener('mouseleave', onMouseLeave);
      
      return () => {
        card.removeEventListener('mouseenter', onMouseEnter);
        card.removeEventListener('mouseleave', onMouseLeave);
      };
    }, card);

    return () => ctx.revert(); // Cleanup GSAP tweens and events
  }, []);

  return cardRef;
}
