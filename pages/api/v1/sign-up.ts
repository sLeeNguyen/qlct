import { createUserWithEmailAndPassword } from 'firebase/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import firebase from 'src/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }
  const { email, password, confirmedPassword } = req.body;
  if (!email || !password || !confirmedPassword) {
    res.status(400).json({ message: 'email, password and confirmedPassword are required' });
    return;
  }
  if (password !== confirmedPassword) {
    res.status(400).json({ message: 'Confirmed password does not match with password' });
    return;
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(firebase.auth, email, password);
    res.status(200).json(userCredential.user);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: (error as Error).message });
  }
}
