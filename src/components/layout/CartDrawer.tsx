"use client";
import React from 'react';
import { X, Plus, Minus, Trash } from 'lucide-react';
import { useCartStore } from '../../lib/useCartStore';
import Link from 'next/link';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    incrementQuantity,
    decrementQuantity,
    removeItem
  } = useCartStore();

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={closeCart}
      />

      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[30%] h-full bg-[#fbfbf2] md:border-l-4 border-black z-[100] transform transition-transform duration-300 ease-[cubic-bezier(0.8,0,0.2,1)] flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:px-6 border-b-2 border-black bg-[#fbfbf2] shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="font-pixel text-2xl md:text-3xl font-black uppercase tracking-wider text-black mt-1">YOUR CART</h2>
            <span className="font-sans text-black text-xs md:text-sm font-medium whitespace-nowrap">({totalItems} items)</span>
          </div>
          <button
            onClick={closeCart}
            className="p-1 hover:opacity-70 transition-opacity cursor-pointer"
          >
            <X size={28} strokeWidth={3} className="text-black" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
              <span className="text-5xl mb-4">🧦</span>
              <p className="font-pixel text-lg uppercase text-black">Cart is Empty</p>
              <button
                onClick={closeCart}
                className="mt-4 font-sans text-sm font-bold underline underline-offset-4 hover:text-gray-600 transition-colors text-black"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="max-w-[700px] w-full mx-auto flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="relative flex gap-3 p-3.5 md:p-4 border-2 border-black rounded-[20px] bg-[#fbfbf2] shadow-[4px_4px_0px_#000]">
                  {/* Delete Button (Top Right) */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-3.5 right-3.5 p-1 hover:text-red-500 transition-colors"
                  >
                    <Trash size={20} strokeWidth={2.5} className="text-black" />
                  </button>

                  {/* Image */}
                  <Link
                    href={`/sock/${item.slug}`}
                    onClick={closeCart}
                    className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] border-2 border-black rounded-[12px] overflow-hidden flex-shrink-0 bg-neutral-100 group block"
                  >
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between py-0.5 pr-8">
                    <div>
                      <h3 className="font-pixel text-[11px] md:text-xs leading-[1.4] tracking-wide text-black">{item.name}</h3>
                      <p className="font-sans font-bold text-sm text-black mt-1">₹{item.price}</p>
                    </div>

                    {/* Quantity Controls Pill */}
                    <div className="flex items-center w-fit border-2 border-black rounded-full mt-2 overflow-hidden bg-[#fbfbf2]">
                      <button
                        onClick={() => decrementQuantity(item.id)}
                        className="px-2.5 py-0.5 hover:bg-neutral-100 transition-colors border-r-2 border-black disabled:opacity-30"
                      >
                        <Minus size={14} strokeWidth={2.5} className="text-black" />
                      </button>
                      <span className="font-sans font-bold text-sm w-8 text-center text-black">{item.quantity}</span>
                      <button
                        onClick={() => incrementQuantity(item.id)}
                        className="px-2.5 py-0.5 hover:bg-neutral-100 transition-colors border-l-2 border-black"
                      >
                        <Plus size={14} strokeWidth={2.5} className="text-black" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-4 py-2 md:px-8 md:py-6 border-t-2 border-black bg-[#fbfbf2] flex flex-col shrink-0">
            <div className="max-w-[700px] w-full mx-auto">
              <div className="flex justify-between items-center mb-1 font-sans text-base text-black">
                <span>Subtotal</span>
                <span className="font-bold">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between items-center mb-1 font-sans text-sm text-gray-600">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>

              <hr className="border-t-[2px] border-black mb-4" />

              <div className="flex items-center justify-between font-pixel text-2xl md:text-3xl uppercase mb-5 text-black">
                <span>TOTAL</span>
                <span>₹{totalAmount}</span>
              </div>

              <div className="flex items-center justify-center relative">
                <button className="w-full bg-black text-white py-3.5 px-6 rounded-[24px] hover:bg-neutral-800 active:scale-[0.98] transition-all font-display font-black uppercase tracking-widest text-base md:text-lg text-center shadow-[4px_4px_0px_transparent] hover:shadow-[4px_4px_0px_#000] border-2 border-black border-transparent hover:border-black">
                  CHECKOUT
                </button>
              </div>

              <button onClick={closeCart} className="mt-4 font-sans text-sm font-medium text-center w-full hover:text-gray-600 transition-colors text-black pb-1">
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
