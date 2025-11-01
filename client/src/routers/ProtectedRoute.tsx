import {Navigate} from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import React from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedUserTypes?: string[]; // optional array of allowed user types
}

/**
 * ProtectedRoute component to guard routes based on authentication and user type.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedUserTypes }) => {
    const { isAuthenticated, user, loading, error } = useAuth();
    if (loading) {
        return <div className="loading-container">Loading...</div>;
    }

    if (error) {
        return <div className="error-container">Error: {error}</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedUserTypes && !allowedUserTypes.includes(user.type)) {
        return <Navigate to="/unauthorized" replace />;  //TODO: create unauthorized page
    }   
    return <>{children}</>;
};
export default ProtectedRoute;