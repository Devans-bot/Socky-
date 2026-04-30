"use client";
import { useState, useEffect, Suspense } from 'react';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

function SearchBarInner() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }
    
    router.push(`/socks?${params.toString()}`);
  };

  return (
    <div className="w-full mx-auto px-2 sm:px-8 pb-2">
      <form onSubmit={handleSubmit}>
        <div
          className={`
            flex items-center gap-3 px-5 py-1.5
            bg-[#fbfbf2]
            border-[3px] border-black
            rounded-2xl
            transition-all duration-200 ease-out
            ${isFocused
              ? 'shadow-[6px_6px_0px_#000] -translate-x-[2px] '
              : 'shadow-[4px_4px_0px_#000]'
            }
          `}
        >
          {/* Search Icon */}
          <Search
            size={20}
            strokeWidth={2.5}
            className={`shrink-0 transition-colors duration-200 ${isFocused ? 'text-black' : 'text-neutral-400'
              }`}
          />

          {/* Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Search..."
            className="
              flex-1 bg-transparent outline-none border-none
              text-base text-black placeholder-neutral-400
              font-medium tracking-wide
            "
          />

          {/* Clear button */}
          {query?.length > 0 && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="
                shrink-0 w-6 h-6 flex items-center justify-center
                rounded-full bg-neutral-200 hover:bg-neutral-300
                text-neutral-600 text-xs font-bold
                transition-colors duration-150
              "
            >
              ✕
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default function SearchBar() {
  return (
    <Suspense fallback={<div className="w-full h-10 animate-pulse bg-neutral-200 rounded-2xl"></div>}>
      <SearchBarInner />
    </Suspense>
  );
}
