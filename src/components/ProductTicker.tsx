import React from 'react';

export function ProductTicker({ text }: { text: string }) {
  return (
    <div className="w-full rounded-b-xl h-[25px] px-10 bg-black overflow-hidden flex items-center">
      <div className="animate-marquee whitespace-nowrap flex">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="font-display text-[8px] md:text-[9px] text-white uppercase tracking-widest px-4">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
