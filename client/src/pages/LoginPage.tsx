import React from 'react';
import SupabaseAuth from '../components/SupabaseAuth';

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-page-content">
        <div className="welcome-section">
          <h1 className="app-title">aDumbLetter</h1>
          <p className="welcome-text">
            temp (cursor'd) start page login screen
          </p>
        </div>

        <div className="auth-section">
          <SupabaseAuth />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
