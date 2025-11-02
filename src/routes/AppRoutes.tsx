import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import PrivateRoute from './PrivateRoute'
import GuestRoute from './GuestRoute'
import Home from '@/pages/Home/Home'
import Auth from '@/pages/Auth/Auth'
import Verify from '@/pages/Verify/Verify'
import Dashboard from '@/pages/Dashboard/Dashboard'
import Loader from '@/components/Loader/Loader'

const AppRoutes: React.FC = () => {
    const { loading } = useAuth()

    if (loading) return <Loader />

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

            <Route
                path="/dashboard"
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                }
            />
        </Routes>
    )
}

export default AppRoutes
