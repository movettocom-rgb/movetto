import { create } from 'zustand';

const useStore = create((set) => ({
  user:     null,
  token:    localStorage.getItem('accessToken') || null,
  isLoaded: false,
  themeMode: localStorage.getItem('themeMode') || 'dark',

  setAuth: (user, token) => {
    localStorage.setItem('accessToken', token);
    set({ user, token, isLoaded: true });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    set({ user: null, token: null, isLoaded: true });
  },

  setUser:   (user) => set({ user }),
  setLoaded: ()     => set({ isLoaded: true }),
  setThemeMode: (themeMode) => {
    localStorage.setItem('themeMode', themeMode);
    set({ themeMode });
  },
  toggleThemeMode: () => set((state) => {
    const themeMode = state.themeMode === 'dark' ? 'light' : 'dark';
    localStorage.setItem('themeMode', themeMode);
    return { themeMode };
  }),
}));

export default useStore;
