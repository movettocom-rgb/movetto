import { create } from 'zustand';

const useStore = create((set) => ({
  user:     null,
  token:    localStorage.getItem('accessToken') || null,
  isLoaded: false,

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
}));

export default useStore;