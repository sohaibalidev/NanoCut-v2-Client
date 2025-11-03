import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface GuestRouteProps {
    children: React.ReactNode;
}

const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();

    return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

export default GuestRoute;
