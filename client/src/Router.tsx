import './index.css'
import App from './App.jsx'
import Home from './Home.jsx'
import StartPage from './pages/StartPage.jsx'
import { useAuth } from './contexts/AuthContext.js'
import React, { useState, useEffect } from 'react';
import {User} from './types/AuthTypes.js'

const safeWindowPath = (): string => {
  return typeof window !== 'undefined' ? window.location.pathname : '/';
};

const Router: React.FC = () => {
  const [path, setPath] = useState<string>(safeWindowPath);      // state changes trigger re-render
  const { user, isAuthenticated, loading, signOut } = useAuth(); // state changes trigger re-render

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []); // Remove path dependency to prevent infinite loop

  const navigate = React.useCallback((to) => {
    if (to !== window.location.pathname) {
      window.history.pushState({}, '', to);
      setPath(to); // Update local state to trigger re-render
    }
  }, []);

  const handleLoginSuccess = (userData: User) => {
    // Auth state change will handle navigation automatically
    console.log('Login success, auth state will handle navigation'); // no-op
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

  // Show auth callback if on callback path -- LEGACY
  // if (path === '/auth/callback') {
  //   return <AuthCallback />;
  // }

  // Show start page if not authenticated
  if (!isAuthenticated) {
    return <StartPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Show letter viewer if on letter path
  if (path === '/letter1') {
    return <App />;
  }

  // Show letter writer if on newletter path
  if (path === '/newletter') {
    return <App />;
  }

  // Show home page if authenticated
  return <Home onViewLetters={() => navigate('/letter1')} onWriteLetter={() => navigate('/newletter')} onLogout={handleLogout} user={user} />;
}

export default Router;