import { signInWithEmailAndPassword } from 'firebase/auth';
import { addDoc } from 'firebase/firestore';
import { useState } from 'react';
import { toast } from 'react-toastify';
import firebase from 'src/firebase';
import { collections } from 'src/firebase/collections';
import { User, useUserStore } from 'src/store';

export default function SignInPage() {
  const [email, setEmail] = useState('nguyenngoc1311999@gmail.com');
  const [password, setPassword] = useState('123456');
  const [signIn, signOut] = useUserStore((state) => [state.signIn, state.signOut]);

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(firebase.auth, email, password);
      signIn(userCredential.user.toJSON() as User);
      toast.success('Signed In!');
    } catch (error) {
      console.error(error);
      signOut();
      toast.error('Failed to sign in');
    }
  };

  const addRecord = async () => {
    try {
      const data = {
        title: 'Luong thang 8/22',
        value: 18000000,
        time: new Date().getTime(),
        categories: ['salary'],
        uid: 'c9suLShUrCMnynfOANdLMuFPTzO2',
      };
      await addDoc(collections.inOut, data);
      toast.success('Added successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed');
    }
  };

  return (
    <div>
      <button onClick={handleSignIn}>Sign In</button>
      <button onClick={addRecord}>Add</button>
    </div>
  );
}
