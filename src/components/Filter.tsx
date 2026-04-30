"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { X, FilterIcon, SlidersHorizontal, Check } from "lucide-react";
import { COLORS, MATERIALS, SORT_OPTIONS } from "../lib/constants/filter";

interface Category {
    _id: string;
    name: string;
    slug: string;
}

interface FilterProps {
    categories?: Category[];
}

export const Filter = ({ categories = [] }: FilterProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    // URL State
    const currentSearch = searchParams.get("q") ?? "";
    const currentCategory = searchParams.get("category") ?? "";
    const currentColor = searchParams.get("color") ?? "";
    const currentMaterial = searchParams.get("material") ?? "";
    const currentSort = searchParams.get("sort") ?? "name";
    const urlMinPrice = Number(searchParams.get("minPrice")) || 0;
    const urlMaxPrice = Number(searchParams.get("maxPrice")) || 5000;
    const currentInStock = searchParams.get("inStock") === "true";

    // Local state for price range (smooth dragging)
    const [minPrice, setMinPrice] = useState(urlMinPrice);
    const [maxPrice, setMaxPrice] = useState(urlMaxPrice);

    useEffect(() => {
        setMinPrice(urlMinPrice);
        setMaxPrice(urlMaxPrice);
    }, [urlMinPrice, urlMaxPrice]);

    const updateParams = useCallback(
        (updates: Record<string, string | number | null>) => {
            const params = new URLSearchParams(searchParams.toString());

            Object.entries(updates).forEach(([key, value]) => {
                if (value === null || value === "" || value === 0) {
                    params.delete(key);
                } else {
                    params.set(key, String(value));
                }
            });

            router.push(`?${params.toString()}`, { scroll: false });
        },
        [router, searchParams]
    );

    const handleClearFilters = () => {
        router.push("/socks", { scroll: false });
        setIsOpen(false);
    };

    const hasActiveFilters = searchParams.toString().length > 0;

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex relative items-center gap-2 p-1 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:scale-95 font-bold uppercase text-sm"
            >
                <FilterIcon />
                {hasActiveFilters && (
                    <span className="flex absolute h-5 w-5 -top-2 -right-2 items-center justify-center rounded-full bg-black text-[10px] text-white">
                        !
                    </span>
                )}
            </button>

            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <div
                className={`fixed inset-y-0 right-0 w-full md:w-[350px] bg-[#fbfbf2] border-l-4 border-black z-[100] transform transition-transform duration-300 ease-[cubic-bezier(0.8,0,0.2,1)] flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b-2 border-black bg-[#fbfbf2]">
                    <h2 className="font-luckiest text-3xl uppercase tracking-wider text-black">Filters</h2>
                    <button onClick={() => setIsOpen(false)} className="p-1 hover:rotate-90 transition-transform duration-200">
                        <X size={28} strokeWidth={3} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
                    {/* Sorting */}
                    <section>
                        <h3 className="font-pixel text-sm uppercase mb-4 text-black underline underline-offset-4 decoration-2">Sort By</h3>
                        <div className="grid grid-cols-1 gap-2">
                            {SORT_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => updateParams({ sort: option.value })}
                                    className={`px-4 py-2 text-left border-2 border-black rounded-lg text-sm font-bold transition-all ${currentSort === option.value
                                        ? "bg-black text-white shadow-none"
                                        : "bg-white text-black shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                                        }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Categories */}
                    <section>
                        <h3 className="font-pixel text-sm uppercase mb-4 text-black underline underline-offset-4 decoration-2">Category</h3>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => updateParams({ category: null })}
                                className={`px-3 py-1 border-2 border-black rounded-full text-xs font-bold transition-all ${currentCategory === "" ? "bg-black text-white" : "bg-white text-black hover:bg-neutral-100"
                                    }`}
                            >
                                All
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat._id}
                                    onClick={() => updateParams({ category: cat.slug })}
                                    className={`px-3 py-1 border-2 border-black rounded-full text-xs font-bold transition-all ${currentCategory === cat.slug ? "bg-black text-white" : "bg-white text-black hover:bg-neutral-100"
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Price Range */}
                    <section>
                        <h3 className="font-pixel text-sm uppercase mb-4 text-black underline underline-offset-4 decoration-2">
                            Price Range: ₹{minPrice} - ₹{maxPrice}
                        </h3>
                        <div className="space-y-4 px-2">
                            <input
                                type="range"
                                min="0"
                                max="5000"
                                step="100"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                onMouseUp={() => updateParams({ maxPrice })}
                                onTouchEnd={() => updateParams({ maxPrice })}
                                className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer accent-black"
                            />
                            <div className="flex justify-between text-[10px] font-bold uppercase">
                                <span>₹0</span>
                                <span>₹5000+</span>
                            </div>
                        </div>
                    </section>

                    {/* Colors */}
                    <section>
                        <h3 className="font-pixel text-sm uppercase mb-4 text-black underline underline-offset-4 decoration-2">Color</h3>
                        <div className="flex flex-wrap gap-3">
                            {COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => updateParams({ color: currentColor === color.value ? null : color.value })}
                                    title={color.label}
                                    className={`w-8 h-8 rounded-full border-2 border-black transition-all flex items-center justify-center ${currentColor === color.value ? "ring-2 ring-offset-2 ring-black scale-110" : "hover:scale-110"
                                        }`}
                                    style={{ backgroundColor: color.value === 'white' ? '#fff' : color.value }}
                                >
                                    {currentColor === color.value && (
                                        <Check size={16} className={['white', 'yellow', 'pink'].includes(color.value) ? 'text-black' : 'text-white'} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Materials */}
                    <section>
                        <h3 className="font-pixel text-sm uppercase mb-4 text-black underline underline-offset-4 decoration-2">Material</h3>
                        <div className="flex flex-wrap gap-2">
                            {MATERIALS.map((mat) => (
                                <button
                                    key={mat.value}
                                    onClick={() => updateParams({ material: currentMaterial === mat.value ? null : mat.value })}
                                    className={`px-3 py-1 border-2 border-black rounded-lg text-xs font-bold transition-all ${currentMaterial === mat.value
                                        ? "bg-black text-white"
                                        : "bg-[#fadadd] text-black shadow-[2px_2px_0px_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5"
                                        }`}
                                >
                                    {mat.label}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* In Stock */}
                    <section>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={currentInStock}
                                    onChange={(e) => updateParams({ inStock: e.target.checked ? "true" : null })}
                                    className="sr-only"
                                />
                                <div className={`w-6 h-6 border-2 border-black rounded shadow-[2px_2px_0px_#000] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none transition-all ${currentInStock ? 'bg-black' : 'bg-white'}`}>
                                    {currentInStock && <Check size={18} className="text-white" />}
                                </div>
                            </div>
                            <span className="font-bold uppercase text-sm">Show only in-stock</span>
                        </label>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-6 border-t-2 border-black bg-white space-y-3">
                    <button
                        onClick={handleClearFilters}
                        className="w-full py-3 bg-[#fbfbf2] border-2 border-black rounded-xl font-luckiest uppercase text-lg shadow-[4px_4px_0px_#000] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:scale-95"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full py-3 bg-black text-white border-2 border-black rounded-xl font-luckiest uppercase text-lg hover:opacity-90 active:scale-95 transition-all"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>
        </>
    );
};