"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tag, ShoppingCart } from 'lucide-react';
import AddToCartButton from './AddToCartButton';
import { client } from '../sanity/client';
import { GET_STOCKS_OF_PRODUCT_BY_SLUG } from '../sanity/queries/products_query';


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
  const [stock, setStock] = useState<number | null>(product.stock ?? null);

  useEffect(() => {
    const fetchStock = async () => {
      if (!product.slug) return;
      try {
        const data = await client.fetch(GET_STOCKS_OF_PRODUCT_BY_SLUG, { slug: product.slug });
        if (data && typeof data.stock === 'number') {
          setStock(data.stock);
        }
      } catch (err) {
        console.error("Failed to fetch stock for product", err);
      }
    };
    fetchStock();
  }, [product.slug]);

  const mainImage = product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/400x400?text=Sock';

  const routeUrl = product.slug ? `/sock/${product.slug}` : `/sock/${product.id}`;

  // Use a stable fallback ID if none is provided
  const productId = product.id || product.slug || `generated-id-${product.name.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <Link href={routeUrl} className="w-full md:w-9/10 md:mx-auto bg-[#fbfbf2] border-2 border-black rounded-xl p-2.5 sm:p-2 md:p-1.5 shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] transition-shadow duration-300 group flex flex-col h-full">

      {/* Image Container */}
      <div className="relative w-full aspect-[2/3] border-2 border-black rounded-lg overflow-hidden mb-2 md:mb-1.5 bg-[#fbfbf2] flex items-center justify-center">
        <img
          src={mainImage}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {product.badge && (
          <span className="absolute top-1.5 left-1.5 bg-black text-white font-['Poppins'] font-bold text-[9px] md:text-[8px] uppercase px-2 py-0.5 rounded z-10">
            {product.badge}
          </span>
        )}
        {stock !== null && (
          <span className="absolute top-1.5 right-1.5 bg-red-500/80 backdrop-blur-md text-white font-['Poppins'] font-bold text-[9px] md:text-[8px] uppercase px-2 py-0.5 rounded-full z-10 border border-red-200/20 shadow-sm">
            Only {stock} Left
          </span>
        )}
      </div>

      {/* Info Section */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-['Poppins'] text-[12px] sm:text-[14px] md:text-[18px] font-bold text-black leading-snug line-clamp-2 mb-1">
            {product.name}
          </h3>
          <div className="mb-2 md:mb-1.5 flex items-center gap-1">
            <Tag size={14} className="text-black fill-transparent" />
            <span className="font-['Poppins'] font-semibold text-[13.5px] md:text-[14px] text-black">
              ₹{product.price}
            </span>
          </div>
        </div>

        {/* Global Add to cart button replaces old hardcoded code */}
        <AddToCartButton
          product={{
            slug: product.slug,
            id: productId,
            name: product.name,
            price: product.price,
            image: mainImage
          }}
          className="!w-full !h-8.5 md:!h-7 !px-0 !py-0 !text-[10px] md:!text-[9px] !rounded-2xl !mt-1"
        />
      </div>

    </Link>
  );
}
