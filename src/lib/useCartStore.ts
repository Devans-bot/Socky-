import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string | number) => void;
  incrementQuantity: (id: string | number) => void;
  decrementQuantity: (id: string | number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isCartOpen: false,

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.id === item.id);
        if (existingItem) {
          // If item exists, increase quantity
          return {
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            )
          };
        }
        // If item doesn't exist, add with quantity 1
        return {
          items: [...state.items, { ...item, quantity: 1 }]
        };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id)
      })),

      incrementQuantity: (id) => set((state) => ({
        items: state.items.map((i) =>
          i.id === id ? { ...i, quantity: i.quantity + 1 } : i
        )
      })),

      decrementQuantity: (id) => set((state) => ({
        items: state.items.map((i) =>
          i.id === id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i
        )
      })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'socky-cart-storage', // name of the item in the storage
      partialize: (state) => ({ items: state.items }), // ONLY persist the items array, skip UI state
    }
  )
);
