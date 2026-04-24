import React from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'lucide-react';
import AddToCartButton from './AddToCartButton';

export interface ProductType {
  id?: string | number;
  slug?: string;
  name: string;
  price: number;
  primary_color?: string;
  secondary_color?: string;
  material?: string;
  images?: string[];
  rating?: number;
  badge?: string;
  stock?: number;
  sizes?: string[];
  fit?: string;
  gender?: string;
}

export default function ProductCard({ product }: { product: ProductType }) {
  const mainImage = product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/400x400?text=Sock';

  const routeUrl = product.slug ? `/product/${product.slug}` : `/product/${product.id}`;

  // Use a stable fallback ID if none is provided
  const productId = product.id || product.slug || `generated-id-${product.name.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <Link to={routeUrl} className="w-[calc(100%+10px)] -ml-[5px] bg-white border-2 border-black rounded-lg p-1.5 shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] transition-all duration-300 group flex flex-col h-full min-h-[268px]">
      
      {/* Image Container */}
      <div className="relative w-full h-7/10 border-2 border-black rounded-md overflow-hidden mb-1.5 bg-white flex items-center justify-center">
        <img 
          src={mainImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {product.badge && (
          <span className="absolute top-1 left-1 bg-black text-white font-display font-bold text-[8px] uppercase px-1.5 py-0.5 rounded z-10">
            {product.badge}
          </span>
        )}
      </div>

      {/* Info Section */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-display text-[10px] md:text-[11px] font-bold text-black leading-snug line-clamp-2 mb-0.5">
            {product.name}
          </h3>
          <div className="mb-1.5 flex items-center gap-1">
            <Tag size={12} className="text-black fill-transparent" />
            <span className="font-sans font-normal text-[12px] md:text-[14px] text-black">
              ₹{product.price}
            </span>
          </div>
        </div>

        {/* Global Add to cart button replaces old hardcoded code */}
        <AddToCartButton 
          product={{
            id: productId,
            name: product.name,
            price: product.price,
            image: mainImage
          }} 
          className="!w-full !h-7 !px-0 !py-0 !text-[9px] !rounded-2xl !mt-1"
        />
      </div>
      
    </Link>
  );
}
