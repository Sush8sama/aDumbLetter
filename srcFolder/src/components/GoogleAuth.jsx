import React, { useEffect, useState } from 'react';

const GoogleAuth = ({ onLoginSuccess }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Google script loaded');
      setIsLoaded(true);
      initializeGoogleAuth();
    };
    script.onerror = () => {
      console.error('Failed to load Google script');
      setError('Failed to load Google authentication script');
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const initializeGoogleAuth = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
    console.log('Client ID:', clientId);
    console.log('Current origin:', window.location.origin);
    console.log('Current hostname:', window.location.hostname);
    console.log('Current port:', window.location.port);
    console.log('All env vars:', import.meta.env);
    console.log('Google object:', window.google);

    if (!clientId) {
      console.error('No client ID found');
      setError('Google Client ID not found. Please check your .env file.');
      return;
    }

    if (window.google && window.google.accounts) {
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: false,
          ux_mode: 'popup'
        });
        console.log('Google Auth initialized successfully');
      } catch (err) {
        console.error('Error initializing Google Auth:', err);
        setError('Error initializing Google Auth: ' + err.message);
      }
    } else {
      console.error('Google object not available');
      setError('Google authentication not available');
    }
  };

  const handleCredentialResponse = (response) => {
    // Decode the JWT token to get user info
    const payload = JSON.parse(atob(response.credential.split('.')[1]));

    setUser({
      name: payload.name,
      email: payload.email,
      picture: payload.picture
    });

    setIsLoggedIn(true);

    // Call the success callback
    if (onLoginSuccess) {
      onLoginSuccess({
        name: payload.name,
        email: payload.email,
        picture: payload.picture
      });
    }
  };

  const handleLogin = () => {
    console.log('Login button clicked');
    console.log('Google object available:', !!window.google);
    console.log('Google accounts available:', !!(window.google && window.google.accounts));

    if (window.google && window.google.accounts && window.google.accounts.id) {
      try {
        window.google.accounts.id.prompt();
        console.log('Google prompt called');
      } catch (err) {
        console.error('Error calling Google prompt:', err);
        setError('Error starting Google login: ' + err.message);
      }
    } else {
      console.error('Google authentication not properly initialized');
      setError('Google authentication not properly initialized');
    }
  };

  const handleLogout = () => {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
    }
    setIsLoggedIn(false);
    setUser(null);
  };

  if (!isLoaded) {
    return <div>Loading Google Auth...</div>;
  }

  return (
    <div className="google-auth-container">
      {/* Debug Information */}
      {debugInfo && (
        <div style={{ color: 'green', fontSize: '12px', marginBottom: '10px' }}>
          {debugInfo}
        </div>
      )}
      {error && (
        <div style={{ color: 'red', fontSize: '12px', marginBottom: '10px' }}>
          Error: {error}
        </div>
      )}

      {!isLoggedIn ? (
        <button
          className="google-login-button"
          onClick={handleLogin}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.04a6.8 6.8 0 01-10.27-3.53H1.83v2.07A8 8 0 008.98 17z"/>
            <path fill="#FBBC05" d="M4.41 10.49a6.8 6.8 0 010-4.98V3.44H1.83a8 8 0 000 7.12l2.58-2.07z"/>
            <path fill="#EA4335" d="M8.98 4.83c1.17 0 2.23.4 3.06 1.2l2.3-2.3A7.5 7.5 0 008.98.5a8 8 0 00-7.15 4.42l2.58 2.07c.64-1.88 2.4-3.16 4.57-3.16z"/>
          </svg>
          Sign in with Google
        </button>
      ) : (
        <div className="user-info">
          <img src={user.picture} alt={user.name} className="user-avatar" />
          <span className="user-name">{user.name}</span>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      )}
    </div>
  );
};

export default GoogleAuth;
