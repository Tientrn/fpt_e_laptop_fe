import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      carts: {},
      currentUserId: null,

      initializeCart: (userId) => {
        set({ currentUserId: userId });
      },

      addToCart: (product) => {
        const { carts, currentUserId } = get();
        const userCart = carts[currentUserId] || [];
        const existingItem = userCart.find(item => item.productId === product.productId);
        
        if (existingItem) {
          const updatedCart = userCart.map(item =>
            item.productId === product.productId
              ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.price }
              : item
          );
          set({
            carts: {
              ...carts,
              [currentUserId]: updatedCart
            }
          });
        } else {
          set({
            carts: {
              ...carts,
              [currentUserId]: [...userCart, { ...product, quantity: 1, totalPrice: product.price }]
            }
          });
        }
      },

      decreaseQuantity: (productId) => {
        const { carts, currentUserId } = get();
        const userCart = carts[currentUserId] || [];

        const updatedCart = userCart.map(item =>
          item.productId === productId && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1, totalPrice: (item.quantity - 1) * item.price }
            : item
        );

        set({
          carts: {
            ...carts,
            [currentUserId]: updatedCart
          }
        });
      },

      removeFromCart: (productId) => {
        const { carts, currentUserId } = get();
        const userCart = carts[currentUserId] || [];

        set({
          carts: {
            ...carts,
            [currentUserId]: userCart.filter(item => item.productId !== productId)
          }
        });
      },

      getCartCount: () => {
        const { carts, currentUserId } = get();
        const userCart = carts[currentUserId] || [];
        return userCart.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        const { carts, currentUserId } = get();
        const userCart = carts[currentUserId] || [];
        return userCart.reduce((total, item) => total + item.totalPrice, 0);
      },

      getCurrentCart: () => {
        const { carts, currentUserId } = get();
        return carts[currentUserId] || [];
      }
    }),
    {
      name: "cart-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useCartStore;
