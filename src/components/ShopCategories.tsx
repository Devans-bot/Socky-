"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { client } from '../sanity/client';
import { GET_ALL_CATEGORY } from '../sanity/queries/categoriesQueries';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
}

export function ShopCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await client.fetch(GET_ALL_CATEGORY);
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="w-full py-10 overflow-hidden">
      <div className="px-4 mb-8">
        <h2 className="text-2xl md:text-5xl uppercase text-black font-luckiest tracking-wide">
          Shop Categories 🧦
        </h2>
      </div>

      <div className="flex overflow-x-auto w-full gap-6 px-4 pb-8 no-scrollbar snap-x snap-mandatory">
        {loading ? (
          <div className="w-full py-12 text-center font-luckiest text-3xl animate-pulse">
            Loading Categories...
          </div>
        ) : (
          <>
            {categories.map((category) => (
              <Link
                href={`/socks?category=${category.slug}`}
                key={category._id}
                className="flex-shrink-0 w-7/10 md:w-3/10 snap-start"
              >
                <div className="relative aspect-[16/9] border-4 border-black rounded-[32px] overflow-hidden group shadow-[8px_8px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-300">
                  {/* Background Image */}
                  {category.imageUrl ? (
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full bg-neutral-200" />
                  )}

                  {/* Faded Black Overlay */}
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-300" />

                  {/* Category Name */}
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <h3 className="text-3xl md:text-4xl text-white text-center font-luckiest drop-shadow-[3px_3px_0px_rgba(0,0,0,0.8)] tracking-wider">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}

            {/* View All Card */}
            <Link href="/socks" className="flex-shrink-0 w-[200px] md:w-[250px] snap-start">
              <div className="relative h-full border-4 border-black rounded-[32px] overflow-hidden group bg-[#fadadd] shadow-[8px_8px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-300 flex flex-col items-center justify-center p-8">
                <div className="bg-white border-2 border-black rounded-full p-4 mb-4 shadow-[2px_2px_0px_#000] group-hover:scale-110 transition-transform">
                  <span className="text-4xl">🛒</span>
                </div>
                <h3 className="text-xl md:text-2xl text-black text-center font-luckiest uppercase">
                  Shop All
                </h3>
              </div>
            </Link>
          </>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  );
}

