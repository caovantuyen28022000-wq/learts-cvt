import { create } from 'zustand';
import api from '../services/api';

interface UserAuthState {
  userToken: string | null;
  userUsername: string | null;
  userEmail: string | null;
  loading: boolean;
  error: string | null;
  loginUser: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  registerUser: (username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logoutUser: () => void;
  clearError: () => void;
}

// Request interceptor helper to append USER Bearer token if present
api.interceptors.request.use(
  (config) => {
    // If the request is for public endpoints or guest orders, but userToken is available, we attach it
    const token = localStorage.getItem('userToken');
    if (token && config.headers && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const useUserAuthStore = create<UserAuthState>((set) => ({
  userToken: localStorage.getItem('userToken'),
  userUsername: localStorage.getItem('userUsername'),
  userEmail: localStorage.getItem('userEmail'),
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  loginUser: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response: any = await api.post('/users/login', { email, password });
      const { token, username, email: returnedEmail } = response.data;

      localStorage.setItem('userToken', token);
      localStorage.setItem('userUsername', username);
      localStorage.setItem('userEmail', returnedEmail);

      set({
        userToken: token,
        userUsername: username,
        userEmail: returnedEmail,
        loading: false
      });

      return { success: true, message: response.message };
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  registerUser: async (username, email, password) => {
    set({ loading: true, error: null });
    try {
      const response: any = await api.post('/users/register', { username, email, password });
      set({ loading: false });
      return { success: true, message: response.message };
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  logoutUser: () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userUsername');
    localStorage.removeItem('userEmail');
    set({ userToken: null, userUsername: null, userEmail: null });
  }
}));
