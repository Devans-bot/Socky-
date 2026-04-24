import { useState, useEffect } from 'react';

interface SockyLoaderProps {
  onComplete?: () => void;
}

export default function SockyLoader({ onComplete }: SockyLoaderProps) {
  const fullText = "Warming up your socks...";
  const [text, setText] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      setText(fullText.substring(0, currentIndex + 1));
      currentIndex++;
      
      if (currentIndex === fullText.length) {
        clearInterval(intervalId);
        
        // Wait for a brief moment after typing completes before removing the overlay
        if (onComplete) {
          setTimeout(onComplete, 800);
        }
      }
    }, 100); // Typewriter speed

    return () => clearInterval(intervalId);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
      <div className="text-7xl mb-6 animate-bounce">
        🧦
      </div>
      <h2 className="font-pixel text-xl sm:text-2xl text-white h-8">
        {text}
        <span className="animate-pulse">_</span>
      </h2>
    </div>
  );
}
