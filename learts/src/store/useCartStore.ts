import { create } from 'zustand';
import api from '../services/api';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  stock: number;
  categoryId: number;
  category_id?: number;
}

export interface CartItem extends Product {
  quantity: number;
  subtotal: number;
}

export interface Coupon {
  code: string;
  discountType: 'percent' | 'flat' | 'freeship';
  value: number;
}

export interface CartData {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  appliedCoupon: Coupon | null;
}

interface CartState {
  cart: CartData;
  isCartOpen: boolean;
  loading: boolean;
  error: string | null;
  setIsCartOpen: (open: boolean) => void;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<boolean>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => Promise<void>;
  checkout: (customerName: string, customerPhone: string, customerAddress: string, email: string) => Promise<{ success: boolean; order?: any; message: string }>;
  clearError: () => void;
}

const getSavedCart = (): CartData => {
  const saved = localStorage.getItem('cartData');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      // ignore parsing error
    }
  }
  return {
    items: [],
    subtotal: 0,
    shipping: 0,
    discount: 0,
    total: 0,
    appliedCoupon: null
  };
};

export const useCartStore = create<CartState>((set, get) => ({
  cart: getSavedCart(),
  isCartOpen: false,
  loading: false,
  error: null,

  setIsCartOpen: (open) => {
    set({ isCartOpen: open });
    if (open) {
      document.body.classList.add('offcanvas-open');
    } else {
      document.body.classList.remove('offcanvas-open');
    }
  },

  clearError: () => set({ error: null }),

  fetchCart: async () => {
    try {
      const response: any = await api.get('/cart');
      set({ cart: response });
      localStorage.setItem('cartData', JSON.stringify(response));
    } catch (err: any) {
      console.error("Cart fetch error:", err.message);
    }
  },

  addToCart: async (productId, quantity) => {
    set({ error: null });
    try {
      await api.post('/cart', { productId, quantity });
      await get().fetchCart();
      set({ isCartOpen: true });
      return true;
    } catch (err: any) {
      set({ error: err.message });
      return false;
    }
  },

  updateQuantity: async (productId, quantity) => {
    set({ error: null });
    try {
      await api.put(`/cart/${productId}`, { quantity });
      await get().fetchCart();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  removeFromCart: async (productId) => {
    set({ error: null });
    try {
      await api.delete(`/cart/${productId}`);
      await get().fetchCart();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  applyCoupon: async (code) => {
    set({ error: null });
    try {
      const response: any = await api.post('/cart/coupon', { code });
      await get().fetchCart();
      return { success: true, message: response.message };
    } catch (err: any) {
      set({ error: err.message });
      return { success: false, message: err.message };
    }
  },

  removeCoupon: async () => {
    set({ error: null });
    try {
      await api.delete('/cart/coupon');
      await get().fetchCart();
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  checkout: async (customerName, customerPhone, customerAddress, email) => {
    set({ loading: true, error: null });
    try {
      const items = get().cart.items.map(item => ({
        id: item.id,
        quantity: item.quantity
      }));
      const couponCode = get().cart.appliedCoupon?.code || null;

      const response: any = await api.post('/orders', {
        customerName,
        customerPhone,
        customerAddress,
        email,
        items,
        couponCode
      });

      // Reset local cart store and localStorage
      const emptyCart: CartData = {
        items: [],
        subtotal: 0,
        shipping: 0,
        discount: 0,
        total: 0,
        appliedCoupon: null
      };

      set({ cart: emptyCart, loading: false });
      localStorage.setItem('cartData', JSON.stringify(emptyCart));

      return { success: true, order: response.data, message: response.message };
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },
}));
