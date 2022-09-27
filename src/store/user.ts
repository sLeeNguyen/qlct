import create from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface User {
  apiKey: string;
  appName: string;
  createdAt: string;
  displayName?: string;
  email: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  lastLoginAt: string;
  phoneNumber?: string;
  photoURL?: string;
  stsTokenManager: {
    accessToken: string;
    refreshToken: string;
    expirationTime: number;
  };
  uid: string;
}

export interface UserStore {
  user?: User;
  isAuthenticated: boolean;
  signIn: (user: User) => void;
  signOut: () => void;
}

export const useUserStore = create<UserStore, [['zustand/immer', never]]>(
  immer((set) => ({
    user: undefined,
    isAuthenticated: false,
    signIn: (user: User) => {
      window.localStorage.setItem('token', JSON.stringify(user.stsTokenManager));
      set((state: UserStore) => {
        state.user = user;
        state.isAuthenticated = true;
      });
    },
    signOut: () => {
      set((state: UserStore) => {
        state.user = undefined;
        state.isAuthenticated = false;
      });
    },
  }))
);

// useUserStore.subscribe((state) => {
//   console.log('useUserStore', state);
// });
