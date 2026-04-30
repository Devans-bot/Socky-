"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TopNavbar from '../components/layout/TopNavbar';
import SearchBar from '../components/SearchBar';
import { ProductTicker } from '../components/ProductTicker';
import { FeaturedCarousel } from '../components/FeaturedCarousel';
import ProductCard from '../components/ProductCard';
import SockyLoader from '../components/SockyLoader';
import SanityStudio from '../components/SanityStudio';
import { HeroAnimatedText } from '../Gsap Animations/HeroAnimatedText';
import { CarouselAnimatedWrapper } from '../Gsap Animations/CarouselAnimatedWrapper';

import { client } from '../sanity/client';
import { FEATURED_SOCKS_QUERY, BESTSELLERS_SOCKS_QUERY, NEW_ARRIVALS_QUERY } from '../sanity/queries/products_query';

import { ShopCategories } from '../components/ShopCategories';
import Footer from '../components/Footer';
import ReviewsCarousel from '../components/ReviewsCarousel';
import { NewArrivalsSection } from '../components/NewArrivalsSection';
import './app.css';

export interface BaseProduct {
  _id: string;
  id?: string;
  name: string;
  price: number;
  sale_price?: number;
  thumbnailUrl?: string;
  slug?: { current: string };
  ordered_numbers?: number;
  rating?: number;
  reviews_count?: number;
}

function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  // Data State
  const [featured, setFeatured] = useState<BaseProduct[]>([]);
  const [bestsellers, setBestsellers] = useState<BaseProduct[]>([]);
  const [newArrivals, setNewArrivals] = useState<BaseProduct[]>([]);




  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Featured
        const featuredData = await client.fetch(FEATURED_SOCKS_QUERY);
        if (featuredData && featuredData.length > 0) {
          setFeatured(featuredData);
        } else {
          // Fallback: If no products are marked 'is_featured', just grab the first 3 products
          const fallbackData = await client.fetch(`*[_type == "product"][0...3] {
            _id, name, slug, price, sale_price,
            "thumbnailUrl": thumbnail.asset->url
          }`);
          setFeatured(fallbackData);
        }

        // Fetch Bestsellers & New Arrivals based on Sanity queries
        const bestsellersData = await client.fetch(BESTSELLERS_SOCKS_QUERY);
        const newArrivalsData = await client.fetch(NEW_ARRIVALS_QUERY);

        // Strictly bind to what the database returns, no front-end simulation
        setBestsellers(bestsellersData || []);

        if (newArrivalsData && newArrivalsData.length > 0) {
          setNewArrivals(newArrivalsData);
        } else {
          const genericProducts2 = await client.fetch(`*[_type == "product"] | order(_createdAt desc)[0...8] {
            _id, name, slug, price, sale_price, rating, reviews_count,
            "thumbnailUrl": thumbnail.asset->url
          }`);
          setNewArrivals(genericProducts2);
        }

      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#fbfbf2] overflow-hidden flex flex-col">
      {isLoading && <SockyLoader onComplete={() => setIsLoading(false)} />}

      <ProductTicker text="🔥 Trending Now • ⚡ Selling Fast • 🧦 Premium Quality • 🚀 New Drops Live" />
      <TopNavbar />

      <div className='md:hidden '>
        <SearchBar />
      </div>


      <main className="flex-1 w-full flex flex-col items-center">

        {/* Hero Section */}

        <div className='flex pt-5 md:pt-10 justify-start gap-2 items-start w-full mx-auto px-5 md:px-25 pt-4'>
          <HeroAnimatedText className='text-xl md:text-5xl font-normal tracking-wide uppercase text-black font-luckiest'>
            Socks that don’t feel basic.
          </HeroAnimatedText>
        </div>
        <CarouselAnimatedWrapper className="mx-auto overflow-hidden ">
          <FeaturedCarousel products={featured.map(p => ({ ...p, id: p._id }))} />
        </CarouselAnimatedWrapper>

        {/* Below-Carousel Text */}
        <h2 className='text-lg md:text-4xl w-full px-5 md:px-25 flex justify-start font-normal tracking-wide uppercase text-black font-luckiest'>Built for comfort.</h2>

        <h2 className='text-lg md:text-4xl pt-10 w-full px-5 md:px-25 font-normal flex justify-end tracking-wide uppercase text-black font-luckiest'>Designed to stand out.</h2>


        <div className="w-full max-w-[1400px] mx-auto pt-8 px-8">
          <hr className="border-t-4 border-black border-dashed opacity-20" />
        </div>

        {/* Shop Categories Section */}
        <div className="w-full max-w-[1400px] px-3">
          <ShopCategories />
        </div>

        <div className="w-full max-w-[1400px] mx-auto px-8 -mt-10 pb-8">
          <hr className="border-t-4 border-black border-dashed opacity-20" />
        </div>

        {/* Bestsellers Section */}
        <div className="w-full w-9/10 md:w-9/10 mx-auto px-4 py-14 ">
          <div className="border-4 border-black rounded-[32px] p-6 md:p-8 shadow-[8px_8px_0px_#000]">
            <div className="flex items-center gap-4 mb-10 pb-4 border-black">
              <h2 className="text-3xl md:text-6xl uppercase text-black font-normal tracking-wide font-luckiest">
                Most Loved
              </h2>
              <span className="text-2xl md:text-5xl">🔥</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {bestsellers.map((product) => (
                <ProductCard
                  key={`bestseller-${product._id}`}
                  product={{
                    id: product._id,
                    slug: product.slug?.current,
                    name: product.name,
                    price: product.sale_price || product.price,
                    images: [product.thumbnailUrl || ''],
                    badge: "HOT"
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full max-w-[1400px] mx-auto px-8">
          <hr className="border-t-4 border-black border-dashed opacity-20" />
        </div>

        {/* New Arrivals Section */}
        <NewArrivalsSection products={newArrivals} />

        {/* Reviews Carousel */}
        <ReviewsCarousel />
      </main>

      <Footer />

    </div>
  );
}

export default HomePage;
