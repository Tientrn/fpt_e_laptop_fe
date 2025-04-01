import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // Thêm sản phẩm vào giỏ hàng
      addToCart: (product) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.productId === product.productId
        );

        if (existingItem) {
          // Nếu sản phẩm đã tồn tại, tăng số lượng
          set({
            items: items.map((item) =>
              item.productId === product.productId
                ? {
                    ...item,
                    quantity: item.quantity + 1,
                    totalPrice: (item.quantity + 1) * item.price,
                  }
                : item
            ),
          });
        } else {
          // Nếu sản phẩm chưa tồn tại, thêm mới
          set({
            items: [
              ...items,
              {
                ...product,
                quantity: 1,
                totalPrice: product.price,
              },
            ],
          });
        }
      },

      // Giảm số lượng sản phẩm
      decreaseQuantity: (productId) => {
        const items = get().items;
        const existingItem = items.find((item) => item.productId === productId);

        if (existingItem.quantity === 1) {
          // Nếu số lượng là 1, xóa sản phẩm
          set({
            items: items.filter((item) => item.productId !== productId),
          });
        } else {
          // Giảm số lượng
          set({
            items: items.map((item) =>
              item.productId === productId
                ? {
                    ...item,
                    quantity: item.quantity - 1,
                    totalPrice: (item.quantity - 1) * item.price,
                  }
                : item
            ),
          });
        }
      },

      // Xóa sản phẩm khỏi giỏ hàng
      removeFromCart: (productId) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        });
      },

      // Tính tổng tiền giỏ hàng
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.totalPrice, 0);
      },

      // Xóa toàn bộ giỏ hàng
      clearCart: () => {
        set({ items: [] });
      },

      // Lấy số lượng sản phẩm trong giỏ
      getCartCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage", // tên unique cho storage
      storage: createJSONStorage(() => sessionStorage), // sử dụng sessionStorage
    }
  )
);

export default useCartStore;
