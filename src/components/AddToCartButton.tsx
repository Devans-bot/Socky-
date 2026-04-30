"use client";
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useCartStore } from '../lib/useCartStore';
import { useUser, useClerk } from '@clerk/nextjs';

interface AddToCartButtonProps {
  product: {
    id: string | number;
    name: string;
    price: number;
    image: string;
    slug: string;
  };
  className?: string; // Allow passing custom classes if needed
}

export default function AddToCartButton({ product, className = "" }: AddToCartButtonProps) {
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  const [addingState, setAddingState] = useState<'idle' | 'adding' | 'success'>('idle');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents clicking the Link wrapper in ProductCard

    if (!user) {
      openSignIn();
      return;
    }

    setAddingState('adding');

    // Simulate a tiny network delay for the UI animation
    setTimeout(() => {
      setAddingState('success');
      addItem(product);
      openCart(); // Auto-open cart drawer on add!
      setTimeout(() => setAddingState('idle'), 1000);
    }, 200);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={addingState !== 'idle'}
      className={`bg-black text-white font-display font-bold uppercase border-2 border-black rounded-2xl shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:bg-[#fbfbf2] hover:text-black active:shadow-[1px_1px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group-hover:bg-[#fbfbf2] group-hover:text-black disabled:opacity-80 px-6 py-4 text-sm md:text-base ${className}`}
    >
      {addingState === 'idle' && 'ADD TO CART'}
      {addingState === 'adding' && 'ADDING...'}
      {addingState === 'success' && <><Check className="w-5 h-5" /> ADDED</>}
    </button>
  );
}
