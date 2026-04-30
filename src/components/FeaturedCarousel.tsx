import React, { useEffect, useCallback, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export interface ProductType {
  id: string; // or _id mapped to id
  _id?: string;
  name: string;
  price: number;
  sale_price?: number;
  images?: string[];
  thumbnailUrl?: string;
  slug?: { current: string };
}

/** Hook to track a CSS media query */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    setMatches(mql.matches);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/** Chunk an array into groups of `size` */
function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

function getImageSrc(product: ProductType): string {
  return product.thumbnailUrl || (product.images && product.images.length > 0 ? product.images[0] : '/placeholder.jpg');
}

function getRouteUrl(product: ProductType): string {
  return product.slug?.current ? `/sock/${product.slug.current}` : `/product/${product._id || product.id}`;
}

/** A single product card inside a carousel slide */
function SlideProductCard({ product, solo }: { product: ProductType; solo?: boolean }) {
  return (
    <a
      href={getRouteUrl(product)}
      className={`relative block overflow-hidden bg-neutral-100 group/card ${solo ? 'w-full' : 'w-1/2'} h-full`}
      style={!solo ? { flex: '0 0 50%' } : undefined}
    >
      <img
        src={getImageSrc(product)}
        alt={product.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
      {/* Product info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 translate-y-2 group-hover/card:translate-y-0 transition-transform duration-300">
        <p className="text-white font-luckiest text-lg md:text-2xl drop-shadow-lg truncate">
          {product.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {product.sale_price && product.sale_price < product.price ? (
            <>
              <span className="text-white font-bold text-base md:text-lg">₹{product.sale_price}</span>
              <span className="text-white/60 line-through text-sm">₹{product.price}</span>
            </>
          ) : (
            <span className="text-white font-bold text-base md:text-lg">₹{product.price}</span>
          )}
        </div>
      </div>
    </a>
  );
}

export function FeaturedCarousel({ products }: { products: ProductType[] }) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000, stopOnInteraction: true })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // On desktop, pair products into groups of 2 per slide
  const desktopSlides = chunkArray(products, 2);
  const slideCount = isDesktop ? desktopSlides.length : products.length;

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

  // Re-init embla when the layout mode changes so slide sizes recalculate
  useEffect(() => {
    if (emblaApi) emblaApi.reInit();
  }, [isDesktop, emblaApi]);

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
    <div className="w-full mt-1 mb-7">
      <div className="relative w-full h-[70vh] md:h-[500px] lg:h-[600px] border-4 border-black rounded-2xl shadow-[8px_8px_0px_#000] overflow-hidden group">

        <div className="overflow-hidden h-full" ref={emblaRef}>
          <div className="flex h-full bg-[#fbfbf2] z-0">
            {isDesktop
              ? /* ── Desktop: 2 products per slide ── */
              desktopSlides.map((pair, idx) => (
                <div
                  key={`desktop-slide-${idx}`}
                  className="flex-[0_0_100%] min-w-0 h-full flex"
                >
                  {pair.map((product, pIdx) => (
                    <SlideProductCard
                      key={product.id || product._id}
                      product={product}
                      solo={pair.length === 1}
                    />
                  ))}
                  {/* Vertical divider between the two images */}
                  {pair.length === 2 && (
                    <div className="absolute left-1/2 top-0 bottom-0 w-[3px] bg-black z-[5] -translate-x-1/2" />
                  )}
                </div>
              ))
              : /* ── Mobile: 1 product per slide ── */
              products.map((product) => (
                <div
                  key={product.id || product._id}
                  className="flex-[0_0_100%] min-w-0 h-full relative"
                >
                  <SlideProductCard product={product} solo />
                </div>
              ))}
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-[#fbfbf2] border-2 border-black px-2.5 py-1.5 rounded-[20px] shadow-[2px_2px_0px_#000]">
          {Array.from({ length: slideCount }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-1.5 rounded-full border border-black cursor-pointer transition-all duration-300 ${index === selectedIndex ? 'w-4 bg-black' : 'w-1.5 bg-gray-200 hover:bg-gray-400'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={scrollPrev}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#fbfbf2] border-2 border-black rounded-full shadow-[4px_4px_0px_#000] flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition-colors opacity-0 group-hover:opacity-100 hidden md:flex z-10"
        >
          <ChevronLeft strokeWidth={3} className="w-6 h-6" />
        </button>

        <button
          onClick={scrollNext}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#fbfbf2] border-2 border-black rounded-full shadow-[4px_4px_0px_#000] flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition-colors opacity-0 group-hover:opacity-100 hidden md:flex z-10"
        >
          <ChevronRight strokeWidth={3} className="w-6 h-6" />
        </button>

      </div>
    </div>
  );
}
