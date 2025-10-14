import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './Home.jsx'
import StartPage from './StartPage.jsx'
import AuthCallback from './auth/callback.jsx'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import React, { useState } from 'react'

function Router() {
  const [path, setPath] = useState(() => window.location.pathname);
  const { user, isAuthenticated, loading, signOut } = useAuth();

  React.useEffect(() => {
    const onPop = () => {
      const newPath = window.location.pathname;
      setPath(newPath);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []); // Remove path dependency to prevent infinite loop

  const navigate = React.useCallback((to) => {
    if (to !== window.location.pathname) {
      window.history.pushState({}, '', to);
      setPath(to); // Update local state to trigger re-render
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    // Auth state change will handle navigation automatically
    console.log('Login success, auth state will handle navigation');
  };

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Show loading state while checking authentication
  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  // Show auth callback if on callback path
  if (path === '/auth/callback') {
    return <AuthCallback />;
  }

  // Show start page if not authenticated
  if (!isAuthenticated) {
    return <StartPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Show letter viewer if on letter path
  if (path === '/letter1') {
    return <App />;
  }

  // Show home page if authenticated
  return <Home onStart={() => navigate('/letter1')} onLogout={handleLogout} user={user} />;
}

// Get the root element
const container = document.getElementById('root')

// Create root only if it doesn't exist (for HMR compatibility)
if (!container._reactRootContainer) {
  const root = createRoot(container)
  container._reactRootContainer = root
}

// Render the app
container._reactRootContainer.render(
  <StrictMode>
    <AuthProvider>
      <Router />
    </AuthProvider>
  </StrictMode>
)
