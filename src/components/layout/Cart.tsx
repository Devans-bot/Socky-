import { ShoppingBag } from "lucide-react";
import { useCartStore } from "../../lib/useCartStore";

export default function Cart() {
  const items = useCartStore((state) => state.items);
  const openCart = useCartStore((state) => state.openCart);
  
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <button 
      onClick={openCart}
      className="relative flex items-center justify-center p-2 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
    >
      <ShoppingBag size={20} strokeWidth={2.5} className="text-black" />
      {totalItems > 0 && (
        <span className="absolute top-1 right-0 flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-black rounded-full border-[2px] border-white translate-x-1 outline outline-1 outline-white z-10 shadow-sm leading-none">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
}
