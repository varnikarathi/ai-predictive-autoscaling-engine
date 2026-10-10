import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            username: null,
            role: null,

            login: (token, username, role) => set({ token, username, role }),
            logout: () => set({ token: null, username: null, role: null }),
        }),
        {
            name: 'auth-storage', // saves token to localStorage safely
        }
    )
);

export default useAuthStore;
