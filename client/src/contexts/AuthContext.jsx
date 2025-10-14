import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase/client.js'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      } catch (err) {
        console.error('Error getting initial session:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Handle different auth events
        if (event === 'SIGNED_IN' && session) {
          setUser(session.user)
          setError(null)
          // Navigate to home after successful sign in
          if (window.location.pathname === '/auth/callback') {
            window.history.pushState({}, '', '/')
            window.dispatchEvent(new PopStateEvent('popstate'))
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setError(null)
        } else if (event === 'TOKEN_REFRESHED' && session) {
          setUser(session.user)
        } else if (event === 'USER_UPDATED' && session) {
          setUser(session.user)
        }

        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('Starting Google OAuth...')
      console.log('Redirect URL:', `${window.location.origin}/auth/callback`)

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      })

      if (error) {
        console.error('Supabase OAuth error:', error)
        throw error
      }

      console.log('OAuth initiated successfully:', data)
    } catch (err) {
      console.error('Error signing in with Google:', err)
      setError(`OAuth Error: ${err.message}. This might be caused by an ad blocker or browser extension.`)
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)

      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
    } catch (err) {
      console.error('Error signing out:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
