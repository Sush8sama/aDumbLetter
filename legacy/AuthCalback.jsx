import React, { useEffect } from 'react'
import { supabase } from '../lib/supabase/client.js'

const AuthCallback = () => {
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the URL hash and search params
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const searchParams = new URLSearchParams(window.location.search)

        // Check for auth code in URL
        const code = searchParams.get('code') || hashParams.get('code')
        const error = searchParams.get('error') || hashParams.get('error')

        if (error) {
          console.error('OAuth error:', error)
          window.location.href = '/'
          return
        }

        if (code) {
          // Exchange code for session
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

          if (exchangeError) {
            console.error('Error exchanging code for session:', exchangeError)
            window.location.href = '/'
            return
          }

          if (data.session) {
            // Session is established, the auth state change listener will handle navigation
            console.log('Session established successfully')
          } else {
            window.location.href = '/'
          }
        } else {
          // No code, try to get existing session
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            console.log('Existing session found')
          } else {
            window.location.href = '/'
          }
        }
      } catch (err) {
        console.error('Auth callback error:', err)
        window.location.href = '/'
      }
    }

    handleAuthCallback()
  }, [])

  return (
    <div className="auth-callback">
      <div className="auth-callback-content">
        <h2>Completing authentication...</h2>
        <p>Please wait while we finish setting up your account.</p>
      </div>
    </div>
  )
}

export default AuthCallback
