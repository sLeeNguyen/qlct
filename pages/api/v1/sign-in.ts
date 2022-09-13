import { signInWithEmailAndPassword } from 'firebase/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import firebase from 'src/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    res.status(400).json({ message: 'email and password are required' });
    return;
  }
  try {
    const userCredential = await signInWithEmailAndPassword(firebase.auth, email, password);
    res.status(200).json(userCredential.user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: 'email and password are incorrect' });
  }
}
