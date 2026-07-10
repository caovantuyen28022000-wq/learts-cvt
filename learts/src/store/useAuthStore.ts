import { create } from 'zustand';
import api from '../services/api';

interface AuthState {
  adminToken: string | null;
  adminUsername: string | null;
  loading: boolean;
  error: string | null;
  loginAdmin: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  registerAdmin: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logoutAdmin: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  adminToken: localStorage.getItem('adminToken'),
  adminUsername: localStorage.getItem('adminUsername'),
  loading: false,
  error: null,

  clearError: () => set({ error: null }),

  loginAdmin: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const response: any = await api.post('/auth/login', { username, password });
      
      const { token, username: returnedUser } = response.data;
      
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUsername', returnedUser);
      
      set({ 
        adminToken: token, 
        adminUsername: returnedUser, 
        loading: false 
      });
      
      return { success: true, message: response.message };
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  registerAdmin: async (username, password) => {
    set({ loading: true, error: null });
    try {
      const response: any = await api.post('/auth/register', { username, password });
      set({ loading: false });
      return { success: true, message: response.message };
    } catch (err: any) {
      set({ error: err.message, loading: false });
      return { success: false, message: err.message };
    }
  },

  logoutAdmin: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    set({ adminToken: null, adminUsername: null });
  },
}));
