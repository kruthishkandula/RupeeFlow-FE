import { getFirebaseAuth } from '@/config/firebase';
import {
  createUserWithEmailAndPassword,
  FirebaseAuthTypes,
  signInWithEmailAndPassword,
  signOut,
  updateProfile
} from '@react-native-firebase/auth';
import { create } from 'zustand';

type AuthStore = {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
  initializing: boolean;
  setUser: (user: FirebaseAuthTypes.User | null) => void;
  setLoading: (loading: boolean) => void;
  setInitializing: (initializing: boolean) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, displayName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
};

const parseFirebaseError = (code: string): string => {
  switch (code) {
    case 'auth/invalid-credential':
      return 'Invalid credentials.';
    case 'auth/invalid-email':
      return 'Invalid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/user-not-found':
      return 'No account found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Check your internet connection.';
    default:
      return 'Something went wrong. Please try again.';
  }
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: false,
  initializing: true,

  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  setInitializing: (initializing) => set({ initializing }),

  login: async (email, password) => {
    set({ loading: true });
    try {
      const auth = getFirebaseAuth();
      if (!auth) {
        return { success: false, error: 'Authentication is not ready yet. Please restart the app.' };
      }
      await signInWithEmailAndPassword(auth, email.trim(), password);
      return { success: true };
    } catch (error: any) {
      console.log('error', error)
      return { success: false, error: parseFirebaseError(error?.code) };
    } finally {
      set({ loading: false });
    }
  },

  signup: async (email, password, displayName) => {
    set({ loading: true });
    try {
      const auth = getFirebaseAuth();
      if (!auth) {
        return { success: false, error: 'Authentication is not ready yet. Please restart the app.' };
      }
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(credential.user, { displayName });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: parseFirebaseError(error?.code) };
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    const auth = getFirebaseAuth();
    if (!auth) {
      set({ user: null });
      return;
    }
    await signOut(auth);
    set({ user: null });
  },
}));
