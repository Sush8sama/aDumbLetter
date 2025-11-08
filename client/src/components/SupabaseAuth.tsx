import React from 'react'
import { useAuth } from '../hooks/useAuth.js'
import './SupabaseAuth.css'

const SupabaseAuth = () => {
  const { user, loading, error, signInWithGoogle, signOut, isAuthenticated } = useAuth();

  // Call onLoginSuccess when user becomes authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      const userData = {
        id: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
        email: user.email,
        picture: user.user_metadata?.avatar_url || user.user_metadata?.picture
      };
    }
  }, [isAuthenticated, user])

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Login error:', err);
    }
  }

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
  }

  if (loading) {
    return <div className="google-auth-container">Loading authentication...</div>;
  }

  return (
    <div className="google-auth-container">
      {error && (
        <div style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>
          Error: {error}
        </div>
      )}

      {!isAuthenticated ? (
        <button
          className="google-login-button"
          onClick={handleLogin}
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a6.8 6.8 0 01-10.27-3.53H1.83v2.07A8 8 0 008.98 17z"/>
            <path fill="#FBBC05" d="M4.41 10.49a6.8 6.8 0 010-4.98V3.44H1.83a8 8 0 000 7.12l2.58-2.07z"/>
            <path fill="#EA4335" d="M8.98 4.83c1.17 0 2.23.4 3.06 1.2l2.3-2.3A7.5 7.5 0 008.98.5a8 8 0 00-7.15 4.42l2.58 2.07c.64-1.88 2.4-3.16 4.57-3.16z"/>
          </svg>
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      ) : (
        <div className="user-info">
          <img
            src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture}
            alt={user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email}
            className="user-avatar"
          />
          <span className="user-name">
            {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email}
          </span>
          <button onClick={handleLogout} className="logout-button" disabled={loading}>
            {loading ? 'Signing out...' : 'Logout'}
          </button>
        </div>
      )}
    </div>
  )
}

export default SupabaseAuth;
