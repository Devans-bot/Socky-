import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopNavbar from '../components/layout/TopNavbar';
import CartDrawer from '../components/layout/CartDrawer';
import ProductPage from './product/[slug]/page';
import { ProductTicker } from '../components/ProductTicker';
import { FeaturedCarousel } from '../components/FeaturedCarousel';
import ProductCard from '../components/ProductCard';
import SockyLoader from '../components/SockyLoader';
import SanityStudio from '../components/SanityStudio';
import { client } from '../sanity/client';
import { FEATURED_SOCKS_QUERY, BESTSELLERS_SOCKS_QUERY, NEW_ARRIVALS_QUERY } from '../sanity/queries/products_query';

import { ShopCategories } from '../components/ShopCategories';
import Footer from '../components/Footer';
import ReviewsCarousel from '../components/ReviewsCarousel';
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
    <div className="min-h-screen bg-neutral-50 overflow-hidden flex flex-col">
      {isLoading && <SockyLoader onComplete={() => setIsLoading(false)} />}

      
      <TopNavbar />
      
      <main className="flex-1 w-full flex flex-col items-center">
        <ProductTicker text="🔥 Trending Now • ⚡ Selling Fast • 🧦 Premium Quality • 🚀 New Drops Live" />
        
        {/* Hero Section */}
        <FeaturedCarousel products={featured.map(p => ({ ...p, id: p._id }))} />

         <div className="w-full max-w-[1400px] mx-auto px-8">
          <hr className="border-t-4 border-black border-dashed opacity-20" />
        </div>

        {/* Shop Categories Section */}
        <ShopCategories />

         <div className="w-full mt-1 mb-10 max-w-[1400px] mx-auto px-8">
          <hr className="border-t-4 border-black border-dashed opacity-20" />
        </div>

        {/* Bestsellers Section */}
        <section className="w-full max-w-[1400px] mx-auto px-4 pb-14">
          <div className="bg-[#fadadd]/20 border-4 border-black rounded-[32px] p-6 md:p-12 shadow-[8px_8px_0px_#000]">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-3xl md:text-6xl uppercase text-black font-normal tracking-wide font-luckiest">
                Most Loved 
              </h2>
              <span className="text-2xl md:text-4xl">🔥</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px]">
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
        </section>

        {/* Divider */}
        <div className="w-full max-w-[1400px] mx-auto px-8">
          <hr className="border-t-4 border-black border-dashed opacity-20" />
        </div>

        {/* New Arrivals Section */}
        <section className="w-full max-w-[1400px] mx-auto px-4 py-14">
          <div className="bg-[#eef2ff] border-4 border-black rounded-[32px] p-6 md:p-12 shadow-[3px_3px_0px_#000]">
            <div className="flex items-center gap-4 mb-10 border-b-4 border-black pb-4">
              <h2 className="text-3xl md:text-6xl font-normal tracking-wide uppercase text-black font-luckiest ">
                Just Dropped !
              </h2>
              <span className="text-2xl md:text-4xl">✨</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[25px]">
              {newArrivals.map((product) => (
                <ProductCard 
                  key={`new-${product._id}`} 
                  product={{
                    id: product._id,
                    slug: product.slug?.current,
                    name: product.name,
                    price: product.sale_price || product.price,
                    images: [product.thumbnailUrl || ''],
                    badge: "NEW"
                  }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Reviews Carousel */}
        <ReviewsCarousel />
      </main>

      <Footer />

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartDrawer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/studio/*" element={<SanityStudio />} />
      </Routes>
    </BrowserRouter>
  );
}


