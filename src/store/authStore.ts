import { create } from 'zustand';
import { User } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut 
} from 'firebase/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  },
  signUp: async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  },
  signOut: async () => {
    await firebaseSignOut(auth);
    set({ user: null });
  },
}));