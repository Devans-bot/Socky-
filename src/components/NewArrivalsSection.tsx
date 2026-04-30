import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import ProductCard from './ProductCard';
import type { BaseProduct } from '../app/page';

export function NewArrivalsSection({ products }: { products: BaseProduct[] }) {
  // We use align: 'start' so that items align to the left side of the container.
  const [emblaRef] = useEmblaCarousel({ loop: true, align: 'start' }, [
    Autoplay({ delay: 3000, stopOnInteraction: true }),
  ]);

  return (
    <section className="w-full w-9/10 md:w-9/10 mx-auto px-4 py-14">
      <div className=" border-4 border-black rounded-[32px] p-6 md:p-10 shadow-[10px_10px_0px_#000]">
        <div className="flex items-center gap-4 mb-10 border-black ">
          <h2 className="text-3xl md:text-6xl font-normal tracking-wide uppercase text-black font-luckiest ">
            Just Dropped !
          </h2>
          <span className="text-2xl md:text-4xl">✨</span>
        </div>

        {/* Universal Horizontal Carousel */}
        <div className="overflow-hidden py-10 px-6 " ref={emblaRef}>
          <div className="flex -ml-4 md:-ml-6">
            {products.map((product) => (
              <div
                key={`new-arrivals-${product._id}`}
                className="pl-4 md:pl-6 min-w-0 flex-[0_0_100%] md:flex-[0_0_33.333%] lg:flex-[0_0_25%]"
              >
                <ProductCard
                  product={{
                    id: product._id,
                    slug: product.slug?.current,
                    name: product.name,
                    price: product.sale_price || product.price,
                    images: [product.thumbnailUrl || ''],
                    badge: "NEW"
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
