import { create } from 'zustand';

const STORAGE_KEY = 'cmp309_cart_items';

/**
 * Safely reads the initial cart items from localStorage.
 */
function getInitialCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Failed to parse initial cart from localStorage:', err);
    return [];
  }
}

export const useCartStore = create((set) => ({
  items: getInitialCart(),

  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        items: [
          ...state.items,
          {
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: 1,
            thumbnail: product.thumbnail,
          },
        ],
      };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  setQuantity: (id, quantity) =>
    set((state) => {
      const parsedQty = parseInt(quantity, 10);
      if (isNaN(parsedQty) || parsedQty < 1) {
        return {
          items: state.items.filter((item) => item.id !== id),
        };
      }
      return {
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity: parsedQty } : item
        ),
      };
    }),

  clear: () => set({ items: [] }),
}));

// Derived value selectors returning primitives
export const selectTotalItems = (state) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectTotalPrice = (state) =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

// Cart actions selector
export const selectCartActions = (state) => ({
  addItem: state.addItem,
  removeItem: state.removeItem,
  setQuantity: state.setQuantity,
  clear: state.clear,
});

// Outside-React persistence subscription
useCartStore.subscribe((state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  } catch (err) {
    console.error('Failed to sync cart to localStorage:', err);
  }
});
