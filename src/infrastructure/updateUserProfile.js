// Firebase Auth updateProfile helper
import { auth } from './firebase';
import { updateProfile as fbUpdateProfile } from 'firebase/auth';

export async function updateUserProfile({ displayName, photoURL }) {
  if (!auth.currentUser) throw new Error('No user logged in');
  await fbUpdateProfile(auth.currentUser, { displayName, photoURL });
}
