import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    <section className="w-full max-w-[1400px] mx-auto px-4 py-8">
      <div className="bg-[#cffafe]/20 border-4 border-black rounded-[32px] p-6 md:p-12 shadow-[8px_8px_0px_#000]">
        <div className="flex justify-start mb-10 pb-4 border-black">
          <h2 className="text-3xl md:text-5xl lg:text-6xl uppercase text-black font-normal tracking-wide font-luckiest">
            Shop Sockss 🧦
          </h2>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {loading ? (
            <div className="col-span-2 sm:col-span-3 lg:col-span-6 py-10 text-center font-luckiest text-2xl">
               Loading Categories... 🧦
            </div>
          ) : (
            <>
              {categories.slice(0, 5).map((category) => (
                <Link to={`/category/${category.slug}`} key={category._id}>
                  <div className="relative cursor-pointer border-4 border-black rounded-[24px] overflow-hidden aspect-[4/5] bg-black shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 group">
                    {category.imageUrl ? (
                      <img 
                        src={category.imageUrl} 
                        alt={category.name} 
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500" 
                      />
                    ) : (
                      <div className="absolute inset-0 w-full h-full bg-black/40"></div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center px-4">
                      <h3 
                        className="text-lg lg:text-xl text-white text-center font-normal tracking-wider  group-hover:scale-110 transition-transform duration-300"
                        style={{ fontFamily: "'Luckiest Guy', cursive" }}
                      >
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
              <Link to="/shop">
                <div className="relative cursor-pointer border-4 border-black rounded-[24px] overflow-hidden aspect-[4/5] bg-[#fadadd] shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 group flex flex-col items-center justify-center">
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
                     <span className="text-4xl md:text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)]">🛒</span>
                     <h3 
                       className="text-lg lg:text-xl text-black text-center font-normal tracking-wider group-hover:scale-110 transition-transform duration-300"
                       style={{ fontFamily: "'Luckiest Guy', cursive" }}
                     >
                       Shop All
                     </h3>
                  </div>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
