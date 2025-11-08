import App from '../App.js'
import HomePage from '../pages/HomePage' 
import LoginPage from '../pages/LoginPage.js'
import { useAuth } from '../contexts/AuthContext'
import React, { useState, useEffect, use } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute'
import LetterWriterPage from '../pages/LetterWriterPage'
import EnvelopePage from '../pages/EnvelopePage'
import DumbLetterPage from '../pages/DumbLetterPage'


const safeWindowPath = (): string => {
  return typeof window !== 'undefined' ? window.location.pathname : '/';
};

const Router: React.FC = () => {
  const { user, isAuthenticated, loading, signOut } = useAuth(); // state changes trigger re-render
  const navigate = useNavigate();

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Routes>
      {/* Login page */}
      <Route 
        path="/login" 
        element={<LoginPage/>} 
      />

      {/* Home page */}
      <Route path="/" element={
        <ProtectedRoute>
          <HomePage onLogout={handleLogout} user={user}/>
        </ProtectedRoute>
        } 
      />

      {/* Letters viewing page */}
      <Route path="/write/letter" element={
        <ProtectedRoute>
          <LetterWriterPage user={user} />
        </ProtectedRoute>
        } 
      />

      {/* Letter writing page */}
      <Route path="/view/dumb-letter" element={
        <ProtectedRoute>
          <DumbLetterPage />
        </ProtectedRoute>
        } 
      />

      {/* Add new pages here */}

    </Routes>
  );

}

export default Router;