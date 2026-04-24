import React, { useEffect, useCallback, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export interface ProductType {
  id: string; // or _id mapped to id
  _id?: string;
  name: string;
  price: number;
  images?: string[];
  thumbnailUrl?: string;
  slug?: { current: string };
}

export function FeaturedCarousel({ products }: { products: ProductType[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: true })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    // Explicitly call it once without adding it directly into the render execution synchronously
    setTimeout(() => onSelect(), 0);
  }, [emblaApi, onSelect]);

  if (!products || products.length === 0) {
    return (
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 mt-8 mb-16">
        <div className="relative w-full h-[70vh] md:h-[500px] lg:h-[600px] border-4 border-black rounded-2xl shadow-[8px_8px_0px_#000] overflow-hidden bg-neutral-200 flex items-center justify-center">
          <p className="font-pixel text-xl animate-pulse">Loading Featured Socks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mt-1 mx-auto px-4 md:px-8 mb-16">
      <div className="relative w-full h-[70vh] md:h-[500px] lg:h-[600px] border-4 border-black rounded-2xl shadow-[8px_8px_0px_#000] overflow-hidden group">
        
        <div className="overflow-hidden h-full" ref={emblaRef}>
          <div className="flex h-full bg-white z-0">
            {products.map((product) => {
              const imageSrc = product.thumbnailUrl || (product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg');
              const routeUrl = product.slug?.current ? `/product/${product.slug.current}` : `/product/${product._id || product.id}`;
              return (
              <a key={product.id || product._id} href={routeUrl} className="flex-[0_0_100%] min-w-0 h-full relative bg-white block">
                <img
                  src={imageSrc}
                  alt={product.name}
                  className="w-full h-full object-cover absolute inset-0"
                />
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
              </a>
            )})}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-white border-2 border-black px-2.5 py-1.5 rounded-[20px] shadow-[2px_2px_0px_#000]">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-1.5 rounded-full border border-black cursor-pointer transition-all duration-300 ${
                index === selectedIndex ? 'w-4 bg-black' : 'w-1.5 bg-gray-200 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={scrollPrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border-2 border-black rounded-full shadow-[4px_4px_0px_#000] flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition-colors opacity-0 group-hover:opacity-100 hidden md:flex z-10"
        >
          <ChevronLeft strokeWidth={3} className="w-6 h-6" />
        </button>

        <button
          onClick={scrollNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white border-2 border-black rounded-full shadow-[4px_4px_0px_#000] flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition-colors opacity-0 group-hover:opacity-100 hidden md:flex z-10"
        >
          <ChevronRight strokeWidth={3} className="w-6 h-6" />
        </button>

      </div>
    </div>
  );
}
