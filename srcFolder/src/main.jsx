import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './Home.jsx'
import StartPage from './StartPage.jsx'
import React, { useMemo, useState } from 'react'

function Router() {
  const [path, setPath] = useState(() => window.location.pathname);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if user is already authenticated (stored in localStorage)
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [user, setUser] = useState(() => {
    // Get user info from localStorage
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });

  React.useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = React.useCallback((to) => {
    if (to !== window.location.pathname) {
      window.history.pushState({}, '', to);
      const navEvent = new PopStateEvent('popstate');
      window.dispatchEvent(navEvent);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('user', JSON.stringify(userData));
    // Navigate to home after successful login
    navigate('/home');
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/');
  };

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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
