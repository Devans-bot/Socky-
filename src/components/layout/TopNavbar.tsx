import MenuBar from './MenuBar';
import Cart from './Cart';

export default function TopNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white flex items-center justify-between px-4 sm:px-6 pt-2 border-b-4 border-neutral-100 shadow-sm">
      <MenuBar />

      <a href="/" className="flex items-center gap-1 group cursor-pointer active:scale-95 transition-transform duration-200">
        <div className="flex items-center">
          {["S", "o", "c", "k"].map((char, i) => (
            <span 
              key={`l1-${i}`}
              className="text-2xl md:text-5xl font-normal tracking-widest text-white [-webkit-text-stroke:2px_black] drop-shadow-[2px_2px_0_rgba(0,0,0,1)] animate-char-pulse inline-block"
              style={{ fontFamily: "'Luckiest Guy', cursive", animationDelay: `${i * 0.15}s` }}
            >
              {char}
            </span>
          ))}
          <span 
            className="text-[18px] pb-4 md:text-[41px] -rotate-12 translate-y-1 inline-block group-hover:rotate-0 transition-transform duration-300 animate-char-pulse mx-1 drop-shadow-[3px_3px_0_rgba(0,0,0,1)]"
            style={{ animationDelay: `${4 * 0.15}s` }}
          >
            🧦
          </span>
          {["Y"].map((char, i) => (
            <span 
              key={`l2-${i}`}
              className="text-2xl md:text-5xl font-normal tracking-widest text-white [-webkit-text-stroke:2px_black] drop-shadow-[2px_2px_0_rgba(0,0,0,1)] animate-char-pulse inline-block"
              style={{ fontFamily: "'Luckiest Guy', cursive", animationDelay: `${(5 + i) * 0.15}s` }}
            >
              {char}
            </span>
          ))}
        </div>
      </a>

      <Cart />
    </header>
  );
}
