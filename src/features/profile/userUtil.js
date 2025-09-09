// Utility to get current user id from Firebase Auth
import { auth } from '../../infrastructure/firebase';

export function getCurrentUserId() {
  const user = auth.currentUser;
  return user ? user.uid : null;
}
