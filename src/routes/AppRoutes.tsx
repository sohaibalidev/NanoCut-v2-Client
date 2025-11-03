import React from 'react';
import GuestRoute from './GuestRoute';
import PrivateRouteWithSEO from './PrivateRouteWithSEO';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/Loader';
import Home from '@/pages/Home/';
import Auth from '@/pages/Auth/';
import Verify from '@/pages/Verify/';
import Dashboard from '@/pages/Dashboard/';
import UrlRedirect from '@/pages/UrlRedirect/';

const AppRoutes: React.FC = () => {
    const { loading } = useAuth();

    if (loading) return <Loader />;

    return (
        <Routes>
            <Route path="/" element={<Home />} />

            <Route
                path="/auth"
                element={
                    <GuestRoute>
                        <Auth />
                    </GuestRoute>
                }
            />
            <Route
                path="/auth/verify/"
                element={
                    <GuestRoute>
                        <Verify />
                    </GuestRoute>
                }
            />

            <Route path="/u/:shortCode" element={<UrlRedirect />} />

            <Route
                path="/dashboard"
                element={
                    <PrivateRouteWithSEO>
                        <Dashboard />
                    </PrivateRouteWithSEO>
                }
            />
        </Routes>
    );
};

export default AppRoutes;
