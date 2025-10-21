// Define types related to authentication and user information

export interface User {
  id: string;
  email?: string | null;
  aud?: string;
  user_metadata?: Record<string, any> | null;
  [k: string]: any;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  signInWithGoogle: () => void;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}