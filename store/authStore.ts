import { create } from 'zustand';
import { AuthState } from '@/types';

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAdmin: false,
    loading: true,
    setUser: (user) => set({ user }),
    setIsAdmin: (isAdmin) => set({ isAdmin }),
    setLoading: (loading) => set({ loading }),
}));
