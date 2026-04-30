import React from 'react';
import { Star } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    rating: 5,
    text: "Absolutely love these striped crews! They're soft, breathable, and the colors are even better in person. I wear them to work and they still look brand new after 2 months.",
    name: "MIKE T.",
    verified: true,
  },
  {
    id: 2,
    rating: 5,
    text: "Finally found socks that don't slip down! The arch support is perfect for long days. Bought 5 more pairs immediately.",
    name: "EMMA K.",
    verified: true,
  },
  {
    id: 3,
    rating: 4,
    text: "Great quality for the price. My partner loves them and keeps stealing mine. Guess I need to order more!",
    name: "ALEX R.",
    verified: false,
  },
  {
    id: 4,
    rating: 5,
    text: "Minimalist, bold, and so comfortable. The material is thick but not too hot. Highly recommend these for everyday wear.",
    name: "SAMUEL D.",
    verified: true,
  },
  {
    id: 5,
    rating: 5,
    text: "I was skeptical about ordering socks online, but these exceeded all my expectations. The packaging was also super premium.",
    name: "JESSICA L.",
    verified: true,
  }
];

export default function ReviewsCarousel() {
  return (
    <section className="py-16 bg-[#fbfbf2] w-full overflow-hidden border-t-4 border-black">
      <div className="max-w-[1400px] mx-auto text-center mb-8 px-4">
        <h2 className="font-display text-3xl md:text-5xl uppercase text-black mb-4 font-black">WHAT OUR CUSTOMERS SAY</h2>
        <p className="font-sans text-lg font-bold text-black flex items-center justify-center gap-2">
          ★★★★★ 4.8/5 from 2,847 reviews
        </p>
      </div>

      <div className="w-full relative overflow-hidden flex pb-12 pt-4 group">
        {/* Two identical blocks to create the seamless infinite scroll effect */}
        {[0, 1].map((blockIdx) => (
          <div
            key={blockIdx}
            aria-hidden={blockIdx === 1 ? "true" : "false"}
            className="flex flex-shrink-0 animate-marquee gap-6 px-3"
          >
            {REVIEWS.map((review) => (
              <div
                key={review.id}
                className="shrink-0 w-[85vw] md:w-[400px] min-h-[280px] p-6 bg-[#fbfbf2] border-4 border-black rounded-2xl shadow-[8px_8px_0px_#000] hover:shadow-[12px_12px_0px_#000] hover:-translate-y-2 transition-all flex flex-col"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${i < review.rating ? 'fill-black text-black' : 'fill-white text-black'}`}
                    />
                  ))}
                </div>

                <p className="font-sans text-lg font-medium text-black leading-relaxed flex-1 mb-4 italic">
                  "{review.text}"
                </p>

                <div className="mt-auto flex items-center gap-2">
                  <span className="font-display text-lg font-bold text-black uppercase">{review.name}</span>
                  {review.verified && (
                    <span className="font-sans text-xs flex items-center text-black font-bold border-2 border-black bg-[#fadadd] rounded-full px-2 py-0.5">
                      ✓ Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
      `}} />
    </section>
  );
}
