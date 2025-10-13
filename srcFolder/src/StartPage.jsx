import React from 'react';
import GoogleAuth from './components/GoogleAuth';

const StartPage = ({ onLoginSuccess }) => {
  return (
    <div className="start-page">
      <div className="start-page-content">
        <div className="welcome-section">
          <h1 className="app-title">aDumbLetter</h1>
          <p className="welcome-text">
            temp (cursor'd) start page login screen
          </p>
        </div>

        <div className="auth-section">
          <GoogleAuth onLoginSuccess={onLoginSuccess} />
        </div>
      </div>
    </div>
  );
};

export default StartPage;
