import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function ProductGallery({ images, productName }: { images: string[], productName: string }) {
  const [activeIdx, setActiveIdx] = useState(0);

  const displayImages = images.length > 0 ? images : ['https://via.placeholder.com/600x600?text=Sock'];

  // Auto-scroll logic
  useEffect(() => {
    if (displayImages.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % displayImages.length);
    }, 4000); // Auto-scroll every 4 seconds
    
    return () => clearInterval(interval);
  }, [displayImages.length]);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % displayImages.length);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image Container */}
      <div className="relative w-full aspect-[4/5] border-4 border-black rounded-3xl overflow-hidden bg-white shadow-[8px_8px_0px_#000] group">
        
        {/* Images with Crossfade */}
        {displayImages.map((img, idx) => (
          <img 
            key={idx}
            src={img} 
            alt={`${productName} view ${idx + 1}`} 
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
              idx === activeIdx ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          />
        ))}

        {/* Navigation Controls */}
        {displayImages.length > 1 && (
          <div className="absolute inset-0 z-20 pointer-events-none">
            {/* Left Box */}
            <button 
              onClick={handlePrev}
              className="pointer-events-auto absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/70 hover:bg-white backdrop-blur-sm rounded-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[2px_2px_0px_#000] border-2 border-black"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-black pr-0.5" />
            </button>
            
            {/* Right Box */}
            <button 
              onClick={handleNext}
              className="pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/70 hover:bg-white backdrop-blur-sm rounded-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[2px_2px_0px_#000] border-2 border-black"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-black pl-0.5" />
            </button>
            
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-auto bg-black/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
              {displayImages.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setActiveIdx(idx); }}
                  className={`w-2.5 h-2.5 rounded-full border-2 border-black ${idx === activeIdx ? 'bg-black w-4' : 'bg-white/90 hover:bg-white'} transition-all`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
