import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import firebase from 'src/firebase';
import { User, useUserStore } from 'src/store';

export const useAuthStateListener = () => {
  const [signIn, signOut] = useUserStore((state) => [state.signIn, state.signOut]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebase.auth, (user) => {
      if (user) {
        signIn(user.toJSON() as User);
      } else {
        signOut();
      }
    });

    return () => unsubscribe();
  }, [signOut, signIn]);
};
