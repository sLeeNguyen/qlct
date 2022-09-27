import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import firebase from 'src/firebase';
import { useDashboardStore, useManagementStore, User, useUserStore, useUtilsStore } from 'src/store';

export const useAuthStateListener = () => {
  const [signIn, signOut] = useUserStore((state) => [state.signIn, state.signOut]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebase.auth, (user) => {
      if (user) {
        signIn(user.toJSON() as User);
      } else {
        signOut();
        useDashboardStore.getState().reset();
        useManagementStore.getState().reset();
        useUtilsStore.getState().reset();
      }
    });

    return () => unsubscribe();
  }, [signOut, signIn]);
};
