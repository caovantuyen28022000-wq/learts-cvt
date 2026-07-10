import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  stock: number;
  categoryId: number;
  category_id?: number; // Supabase uses underscore
}

export interface Category {
  id: number;
  name: string;
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

export type PageType = 'home' | 'shop' | 'cart' | 'checkout' | 'orders' | 'admin-login' | 'admin-register' | 'admin-products' | 'admin-orders';

interface CartContextType {
  products: Product[];
  categories: Category[];
  cart: CartData;
  orders: any[];        // public user orders
  adminOrders: any[];   // protected admin orders list
  loading: boolean;
  error: string | null;
  page: PageType;
  setPage: (page: PageType) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  fetchProducts: (params?: { page?: number; limit?: number; categoryId?: number }) => Promise<any>;
  fetchCategories: () => Promise<void>;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => Promise<void>;
  checkout: (customerName: string, customerPhone: string, customerAddress: string) => Promise<{ success: boolean; order?: any; message: string }>;
  fetchOrders: () => Promise<void>;
  clearError: () => void;

  // Admin Auth states
  adminToken: string | null;
  adminUsername: string | null;
  loginAdmin: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  registerAdmin: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logoutAdmin: () => void;

  // Admin Products CRUD APIs
  createProduct: (product: Omit<Product, 'id'>) => Promise<boolean>;
  updateProduct: (productId: number, product: Partial<Product>) => Promise<boolean>;
  deleteProduct: (productId: number) => Promise<boolean>;

  // Admin Orders APIs
  fetchAdminOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: string) => Promise<boolean>;
}

const API_BASE_URL = 'http://localhost:5000/api';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartData>({
    items: [],
    subtotal: 0,
    shipping: 0,
    discount: 0,
    total: 0,
    appliedCoupon: null
  });
  const [orders, setOrders] = useState<any[]>([]);
  const [adminOrders, setAdminOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPageState] = useState<PageType>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Admin authentication states initialized from local storage
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [adminUsername, setAdminUsername] = useState<string | null>(localStorage.getItem('adminUsername'));

  const clearError = () => setError(null);

  // Sync body scroll when cart offcanvas is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.classList.add('offcanvas-open');
    } else {
      document.body.classList.remove('offcanvas-open');
    }
    return () => {
      document.body.classList.remove('offcanvas-open');
    };
  }, [isCartOpen]);

  // Protected Route setter helper
  const setPage = (newPage: PageType) => {
    // Client-side protect /admin/* pages: push to login if token is missing
    const token = localStorage.getItem('adminToken');
    if (newPage.startsWith('admin-') && newPage !== 'admin-login' && newPage !== 'admin-register' && !token) {
      setPageState('admin-login');
      window.location.hash = '/admin/login';
    } else {
      setPageState(newPage);
      // Update hash in address bar
      if (newPage === 'admin-login') window.location.hash = '/admin/login';
      else if (newPage === 'admin-register') window.location.hash = '/admin/register';
      else if (newPage === 'admin-products') window.location.hash = '/admin/products';
      else if (newPage === 'admin-orders') window.location.hash = '/admin/orders';
      else if (newPage === 'cart') window.location.hash = '/cart';
      else if (newPage === 'checkout') window.location.hash = '/checkout';
      else if (newPage === 'orders') window.location.hash = '/orders';
      else if (newPage === 'shop') window.location.hash = '/shop';
      else window.location.hash = '/';
    }
  };

  // Sync state on hash changes (e.g. back buttons or direct URL visits)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const token = localStorage.getItem('adminToken');

      if (hash === '#/admin/login') {
        setPageState('admin-login');
      } else if (hash === '#/admin/register') {
        setPageState('admin-register');
      } else if (hash === '#/admin/products') {
        if (!token) {
          setPageState('admin-login');
          window.location.hash = '/admin/login';
        } else {
          setPageState('admin-products');
        }
      } else if (hash === '#/admin/orders') {
        if (!token) {
          setPageState('admin-login');
          window.location.hash = '/admin/login';
        } else {
          setPageState('admin-orders');
        }
      } else if (hash === '#/cart') {
        setPageState('cart');
      } else if (hash === '#/checkout') {
        setPageState('checkout');
      } else if (hash === '#/orders') {
        setPageState('orders');
      } else if (hash === '#/shop') {
        setPageState('shop');
      } else {
        setPageState('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial run on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch categories list
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/categories`);
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err: any) {
      console.error("Categories fetch error:", err.message);
    }
  };

  // Fetch products catalog (supports Pagination, Filtering)
  const fetchProducts = async (params?: { page?: number; limit?: number; categoryId?: number }) => {
    try {
      setLoading(true);
      let url = `${API_BASE_URL}/products?`;
      if (params) {
        if (params.page) url += `page=${params.page}&`;
        if (params.limit) url += `limit=${params.limit}&`;
        if (params.categoryId) url += `categoryId=${params.categoryId}&`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch products");

      // Normalize products data key categories
      const normalizedProducts = data.data.products.map((p: any) => ({
        id: p.id,
        name: p.name,
        price: parseFloat(p.price),
        image: p.image,
        description: p.description || '',
        stock: p.stock || 0,
        categoryId: p.category_id !== undefined ? p.category_id : p.categoryId
      }));

      setProducts(normalizedProducts);
      return data.data; // contains total, totalPages, page, limit
    } catch (err: any) {
      setError(err.message || 'An error occurred fetching products.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/cart`);
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setCart(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred fetching cart.');
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred fetching orders.');
    }
  };

  const addToCart = async (productId: number, quantity: number) => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.message || "Failed to add item to cart");
      }
      await fetchCart();
      setIsCartOpen(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE_URL}/cart/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.message || "Failed to update quantity");
      }
      await fetchCart();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE_URL}/cart/${productId}`, {
        method: 'DELETE'
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || data.message || "Failed to remove item");
      }
      await fetchCart();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const applyCoupon = async (code: string) => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE_URL}/cart/coupon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to apply coupon");
      }
      await fetchCart();
      return { success: true, message: data.message };
    } catch (err: any) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const removeCoupon = async () => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE_URL}/cart/coupon`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error("Failed to remove coupon");
      await fetchCart();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // checkout maps to POST /api/orders
  const checkout = async (customerName: string, customerPhone: string, customerAddress: string) => {
    try {
      setError(null);
      setLoading(true);

      const items = cart.items.map(item => ({
        id: item.id,
        quantity: item.quantity
      }));

      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          customerAddress,
          items,
          couponCode: cart.appliedCoupon ? cart.appliedCoupon.code : null
        })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Checkout failed");
      }
      
      // Reset local cart state since order is completed
      setCart({
        items: [],
        subtotal: 0,
        shipping: 0,
        discount: 0,
        total: 0,
        appliedCoupon: null
      });

      return { success: true, order: data.data, message: data.message };
    } catch (err: any) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ADMIN AUTHENTICATION METHODS
  // ==========================================
  const loginAdmin = async (username: string, password: string) => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Login failed");
      }

      const token = data.data.token;
      const user = data.data.username;

      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUsername', user);

      setAdminToken(token);
      setAdminUsername(user);
      setPage('admin-products'); // Send to products dashboard after success

      return { success: true, message: data.message };
    } catch (err: any) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const registerAdmin = async (username: string, password: string) => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Registration failed");
      }

      return { success: true, message: data.message };
    } catch (err: any) {
      setError(err.message);
      return { success: false, message: err.message };
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    setAdminToken(null);
    setAdminUsername(null);
    setPage('home');
  };

  // ==========================================
  // ADMIN PRODUCTS CRUD METHODS
  // ==========================================
  const createProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to create product");
      }
      await fetchProducts(); // Refresh catalog list
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const updateProduct = async (productId: number, productData: Partial<Product>) => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update product");
      }
      await fetchProducts(); // Refresh catalog list
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  const deleteProduct = async (productId: number) => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to delete product");
      }
      await fetchProducts(); // Refresh catalog list
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // ==========================================
  // ADMIN ORDERS METHODS
  // ==========================================
  const fetchAdminOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/orders`, {
        headers: { 
          'Authorization': `Bearer ${adminToken}`
        }
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch admin orders");
      }
      setAdminOrders(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      setError(null);
      const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to update order status");
      }
      await fetchAdminOrders(); // Refresh admin orders list
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  };

  // Initial runs
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchCart();
    fetchOrders();
  }, []);

  return (
    <CartContext.Provider value={{
      products,
      categories,
      cart,
      orders,
      adminOrders,
      loading,
      error,
      page,
      setPage,
      isCartOpen,
      setIsCartOpen,
      fetchProducts,
      fetchCategories,
      fetchCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      applyCoupon,
      removeCoupon,
      checkout,
      fetchOrders,
      clearError,

      // Admin Auth
      adminToken,
      adminUsername,
      loginAdmin,
      registerAdmin,
      logoutAdmin,

      // Admin Products
      createProduct,
      updateProduct,
      deleteProduct,

      // Admin Orders
      fetchAdminOrders,
      updateOrderStatus
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
