"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TopNavbar from '../../../components/layout/TopNavbar';
import { ProductGallery } from '../../../components/ProductGallery';
import AddToCartButton from '../../../components/AddToCartButton';
import ProductCard from '../../../components/ProductCard';
import { ProductTicker } from '../../../components/ProductTicker';
import { SizeSelector } from '../../../components/SizeSelector';
import Footer from '../../../components/Footer';
import SockyLoader from '../../../components/SockyLoader';
import { Star, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { client } from '../../../sanity/client';
import { PRODUCT_BY_SLUG_QUERY, BESTSELLERS_SOCKS_QUERY } from '../../../sanity/queries/products_query';

interface ExtendedProduct {
  _id: string;
  name: string;
  price: number;
  sale_price?: number;
  thumbnailUrl?: string;
  imageUrls?: string[];
  slug?: { current: string };
  rating?: number;
  material?: string;
  fit?: string;
  stock?: number;
  is_featured?: boolean;
  is_new?: boolean;
  gender?: string;
}

const FloatingEmojiBadge = ({ isNew }: { isNew: boolean }) => {
  const [emojis, setEmojis] = useState<{ id: number; emoji: string; rot: number }[]>([]);
  const emojiStr = isNew ? '🔥' : '🎖️';
  const text = isNew ? 'New Arrival' : 'Featured';

  const handleClick = () => {
    // Play a generic click sound
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);

    // Add emoji to float up with random rotation constraint
    const newEmoji = {
      id: Date.now() + Math.random(),
      emoji: emojiStr,
      rot: (Math.random() - 0.5) * 80, // Random rotation between -40deg and 40deg
    };

    setEmojis((prev) => [...prev, newEmoji]);

    // Remove emoji after 1 second
    setTimeout(() => {
      setEmojis((prev) => prev.filter((e) => e.id !== newEmoji.id));
    }, 1000);
  };

  return (
    <div className="relative self-start z-40">
      <button
        onClick={handleClick}
        className="self-start bg-black text-white font-bold text-sm uppercase px-4 py-1.5 rounded-lg shadow-[2px_2px_0px_#000] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[0px_0px_0px_#000] transition-all cursor-pointer relative z-10"
      >
        {text}{emojiStr}
      </button>

      {/* Floating Emojis */}
      {emojis.map((e) => (
        <span
          key={e.id}
          className="absolute left-1/2 -top-4 text-3xl animate-float-vanish pointer-events-none z-[60]"
          style={{
            '--rot': `${e.rot}deg`,
            textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          } as React.CSSProperties}
        >
          {e.emoji}
        </span>
      ))}
    </div>
  );
};

const DescriptionAccordion = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#fbfbf2] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] overflow-hidden text-base md:text-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 md:p-6 flex justify-between font-bold items-center  text-sm hover:bg-gray-50 transition-colors"
      >
        <span>🧦 Product Description</span>
        <span className="text-xl font-bold leading-none">{isOpen ? '-' : '+'}</span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 md:p-6 pt-0 text-gray-700 leading-relaxed text-sm md:text-base border-t-2 border-black/10 mt-2">
              <p className="mb-4">Step into everyday comfort with our premium unisex custom socks, crafted for those who value style, durability, and performance.</p>
              <p className="mb-4">Made from high-quality materials, these socks offer a soft, breathable feel while staying strong for daily wear. The quick-dry fabric keeps your feet fresh, while the regular fit ensures all-day comfort.</p>
              <p className="mb-4">Finished with exclusive, no-fade prints, each pair delivers long-lasting style that stays sharp wash after wash.</p>

              <p className="font-bold text-lg mt-6 mb-2 text-black">✨ Product Details</p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li><strong>Material:</strong> Premium, breathable, quick-dry fabric</li>
                <li><strong>Fit:</strong> Regular fit for everyday comfort</li>
                <li><strong>Gender:</strong> Unisex</li>
                <li><strong>Design:</strong> Exclusive high-definition prints</li>
                <li><strong>Durability:</strong> Fade-resistant, wash-safe</li>
                <li><strong>Comfort:</strong> Soft, lightweight, skin-friendly</li>
                <li><strong>Performance:</strong> Moisture-wicking & odor-resistant</li>
                <li><strong>Use:</strong> Daily wear, casual, active lifestyle</li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ShippingAccordion = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#fbfbf2] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] overflow-hidden text-base md:text-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 md:p-6 flex justify-between items-center font-bold text-sm hover:bg-gray-50 transition-colors"
      >
        <span>🚚 Shipping & Delivery</span>
        <span className="text-xl font-bold leading-none">{isOpen ? '-' : '+'}</span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 md:p-6 pt-0 text-gray-700 leading-relaxed text-sm md:text-base border-t-2 border-black/10 mt-2">
              <p className="mb-4">We keep it fast, simple, and seamless.</p>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li><strong>Free shipping</strong> on orders above <strong>₹999</strong></li>
                <li>Flat <strong>₹120 shipping fee</strong> on orders below ₹999</li>
                <li><strong>Dispatched within 48 hours</strong></li>
                <li><strong>Delivered in 5–7 business days</strong></li>
              </ul>
              <p>From checkout to doorstep — smooth, reliable, and right on time.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ReturnsAccordion = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#fbfbf2] border-2 border-black rounded-2xl shadow-[4px_4px_0px_#000] overflow-hidden text-base md:text-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 md:p-6 flex justify-between items-center font-bold text-sm hover:bg-gray-50 transition-colors"
      >
        <span>🔄 Returns & Exchanges</span>
        <span className="text-xl font-bold leading-none">{isOpen ? '-' : '+'}</span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 md:p-6 pt-0 text-gray-700 leading-relaxed text-sm md:text-base border-t-2 border-black/10 mt-2">
              <p className="mb-4">Shop with confidence—your satisfaction comes first.</p>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li><strong>15-day easy returns & exchanges</strong></li>
                <li>Not satisfied? We’ll <strong>replace it—no hassle</strong></li>
                <li>Quick, smooth, and customer-first support</li>
              </ul>
              <p>Because you deserve products you truly love.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function ProductPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();


  const [product, setProduct] = useState<ExtendedProduct | null>(null);
  const [bestsellers, setBestsellers] = useState<ExtendedProduct[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      setLoading(true);
      try {
        const fetchedProduct = await client.fetch(PRODUCT_BY_SLUG_QUERY, { slug });
        if (!fetchedProduct) {
          router.push('/'); // Redirect if product not found
          return;
        }
        setProduct(fetchedProduct);

        const fetchedBestsellers = await client.fetch(BESTSELLERS_SOCKS_QUERY);
        setBestsellers(fetchedBestsellers || []);
      } catch (error) {
        console.error("Error loading product:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50/30 flex justify-center items-center font-sans relative z-50">
        <SockyLoader />
      </div>
    );
  }

  if (!product) return null;

  const relatedProducts = bestsellers.filter(p => p.slug?.current !== slug).slice(0, 4);

  // Map product to standardized format for AddToCartButton and other components
  const displayProduct = {
    slug: product.slug?.current,
    id: product._id,
    name: product.name,
    price: product.price,
    image: product.imageUrls?.[0] || product.thumbnailUrl || 'https://via.placeholder.com/600x600?text=Sock'
  };

  // Fallbacks for display
  const rating = product.rating || 4.5;

  return (
    <div className="min-h-screen bg-[#fbfbf2] flex flex-col font-sans">
      <TopNavbar />
      <ProductTicker text="Use ⭐ COUPON CODE GET10 to get 10% off on first order 😁" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-6 lg:px-8  md:py-12">


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          <div className="w-full mt-2 flex flex-col gap-4">
            <ProductGallery images={product.imageUrls || (product.thumbnailUrl ? [product.thumbnailUrl] : [])} productName={product.name} />
            {(product.is_featured || product.is_new) && (
              <FloatingEmojiBadge isNew={!!product.is_new} />
            )}
          </div>

          {/* Right Column: Product Details */}
          <div className="flex flex-col gap-6 md:gap-8 lg:sticky lg:top-24">

            {/* Header Details */}
            <div className="flex flex-col gap-2">
              <h1 className="font-sans font-black text-2xl md:text-4xl lg:text-5xl text-black uppercase leading-tight drop-shadow-sm -mt-[10px] ">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 ">
                {product.price && (
                  <div className="font text-xl md:text-4xl text-gray-500 line-through">Rs.{product.price}</div>
                )}
                <div className="flex items-center gap-3">
                  <div className="font text-xl md:text-2xl text-black bg-[#fadadd] px-2 border-2 border-black rounded-lg shadow-[2px_2px_0px_#000]">Rs.{product.sale_price}</div>
                  <div className="bg-red-500 text-white font-bold p-1 rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000] text-xs md:text-sm uppercase tracking-wider">
                    SALE
                  </div>
                </div>
              </div>
              <div className="text-xs md:text-base font-medium text-gray-500 mt-5 flex items-center gap-1">
                Shipping charge calculated at checkout <ShoppingBag className="w-4 h-2 inline-block" />
              </div>
            </div>

            {/* Separator */}
            <hr className="border-t-4 border-black border-dotted mb-3 opacity-20" />

            {/* Accordions */}






            {/* Add To Cart */}
            <div className="border-4 border-black p-6 md:p-8 rounded-3xl shadow-[8px_8px_0px_#000] bg-[#fbfbf2]">
              <SizeSelector />
              <div className="mt-6">
                <AddToCartButton product={displayProduct} className="w-full text-lg md:text-xl h-16 md:h-16" />
              </div>
            </div>

            {/* Guarantee markers */}
            <div className="flex justify-center gap-6 mt-2 pt-6 border-t-2 border-black/10 text-[10px] md:text-xs font-bold uppercase tracking-widest text-center text-gray-500">
              <span className="flex items-center gap-1 shadow-[2px_2px_0px_#ccc] bg-[#fbfbf2] px-2 py-1 rounded-md border-2 border-gray-200">🚀 Fast Shipping</span>
              <span className="flex items-center gap-1 shadow-[2px_2px_0px_#ccc] bg-[#fbfbf2] px-2 py-1 rounded-md border-2 border-gray-200">🛡️ Premium Quality</span>
            </div>

            <div className="flex flex-col gap-4">
              <DescriptionAccordion />
              <ShippingAccordion />
              <ReturnsAccordion />
            </div>


          </div>

        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t-4 border-black border-solid">
            <div className="flex justify-between items-end mb-8">
              <h2 className="font-sans font-black text-3xl md:text-4xl lg:text-5xl uppercase leading-none">
                You May <br />Also Like
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[20px]">
              {relatedProducts.map(relProduct => {
                const mappedRel = {
                  id: relProduct._id,
                  name: relProduct.name,
                  price: relProduct.price,
                  images: relProduct.thumbnailUrl ? [relProduct.thumbnailUrl] : [],
                  slug: relProduct.slug?.current
                };
                return <ProductCard key={mappedRel.id} product={mappedRel} />;
              })}
            </div>
          </div>
        )}

        {/* Customer Reviews Full Width */}
        <div className="mt-24 pt-12 border-t-4 border-black border-solid">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-sans font-black text-3xl md:text-4xl lg:text-5xl uppercase leading-none">
              Customer <br />Reviews
            </h2>
            <div className="flex self-end bg-black text-white p-3 rounded-lg shadow-[4px_4px_0px_#ccc] items-center gap-2">
              <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-xl">{rating}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { name: "Alex M.", text: "Best socks I've ever bought! Super comfy.", rating: 5, date: "2 days ago" },
              { name: "Jordan K.", text: "The colors are incredibly vibrant.", rating: 5, date: "1 week ago" },
              { name: "Casey R.", text: "Perfect fit, doesn't slide down at all.", rating: 4, date: "1 month ago" },
            ].map((review, idx) => (
              <div key={idx} className="bg-[#fbfbf2] border-2 border-black rounded-2xl p-6 shadow-[6px_6px_0px_#000] flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="font-bold text-xl">{review.name}</span>
                    <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">{review.date}</span>
                  </div>
                  <div className="flex text-yellow-500">
                    {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                  </div>
                </div>
                <p className="text-gray-700 italic text-lg leading-relaxed">"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
