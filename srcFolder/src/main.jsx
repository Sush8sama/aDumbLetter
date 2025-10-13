import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Home from './Home.jsx'
import React, { useMemo, useState } from 'react'

function Router() {
  const [path, setPath] = useState(() => window.location.pathname);

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

  if (path === '/letter1') {
    return <App />;
  }
  return <Home onStart={() => navigate('/letter1')} />;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router />
  </StrictMode>,
)
