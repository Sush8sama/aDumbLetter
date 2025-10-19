import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase/client.js'
import {User, AuthContextType} from '../types/AuthTypes.js'

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_URL = (import.meta.env.VITE_API_URL as string) ?? 'http://localhost:3001';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthContext.Provider');
  }
  return context;
}

type AuthProviderProps = {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = async (): Promise<void> => {
    try {
      setError(null);
      const res = await fetch(`${API_URL}/auth/session`, {
        method: 'GET',
        credentials: 'include', // important: send cookies
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        // If outside 2xx range, assume no session
        setUser(null);
        return;
      }

      const body = await res.json();
      setUser(body?.user ?? null);
    } catch (err: any) {
      console.error('Failed to fetch session:', err);
      setError(err?.message ?? 'Unknown error while fetching session');
      setUser(null);
    }
  };

  // called on mount, query server for current session
  useEffect(() => {
    // Get initial session
    let mounted = true;
    (async () => {
      try {
        await fetchSession();
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    // optional: refresh session when tab becomes visible (good UX)
    const onFocus = () => {
      // Don't block UI — refresh in background
      fetchSession().catch((err) => console.error('refreshSession error', err));
    };
    window.addEventListener('focus', onFocus);

    return () => {
      mounted = false;
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const refreshSession = async (): Promise<void> => {
    await fetchSession();
  };

  // redirects to Supabase OAuth endpoint through server
  const signInWithGoogle = (): void => {
    window.location.href = `${API_URL}/auth/login?provider=google`;
  };

  const signOut = async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)

      const res = await  fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include', // send cookies
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: 'Logout failed' }));
        throw new Error(body?.error ?? 'Logout failed');
      }
      // Clear local user state — cookies are cleared server-side
      setUser(null);
    } catch (err:any) {
      console.error('Error signing out:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut,
    refreshSession,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
