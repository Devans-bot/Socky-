import { useState } from 'react';

export function SizeSelector() {
  const sizes = ['S', 'M', 'L', 'XL'];
  const [selected, setSelected] = useState<string>('M');

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <span className="font-bold uppercase text-sm tracking-widest text-black">Select Size</span>
        <button className="underline text-xs text-gray-500 hover:text-black">Size Guide</button>
      </div>
      <div className="flex gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => setSelected(size)}
            className={`flex-1 h-12 flex items-center justify-center font-display text-lg border-2 border-black rounded-xl transition-all ${
              selected === size 
                ? 'bg-black text-white shadow-[2px_2px_0px_#000]' 
                : 'bg-white text-black hover:bg-gray-100 hover:shadow-[2px_2px_0px_#000]'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}
