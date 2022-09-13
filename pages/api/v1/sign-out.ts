import { signOut } from 'firebase/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import firebase from 'src/firebase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }
  try {
    await signOut(firebase.auth);
    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: (error as Error).message });
  }
}
