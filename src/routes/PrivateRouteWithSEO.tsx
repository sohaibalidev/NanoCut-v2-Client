import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import DashboardPrerender from '@/prerender/DashboardPrerender';
import SEO from '@/components/SEO';

const prerenderComponents: Record<string, React.FC> = {
    '/dashboard': DashboardPrerender,
};

interface PrivateRouteWithSEOProps {
    children: React.ReactNode;
}

const PrivateRouteWithSEO: React.FC<PrivateRouteWithSEOProps> = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    const isCrawler = (): boolean => {
        if (typeof navigator === 'undefined') return true;
        return /bot|crawler|spider|googlebot|bingbot|yandex/i.test(
            navigator.userAgent.toLowerCase()
        );
    };

    if (loading) {
        return (
            <div className="container">
                <SEO
                    title="Loading"
                    description="Please wait while NanoCut loads your dashboard."
                    path={location.pathname}
                />
                <div>Loading...</div>
            </div>
        );
    }

    if (user) {
        return <>{children}</>;
    }

    if (isCrawler() && prerenderComponents[location.pathname]) {
        const PrerenderComponent = prerenderComponents[location.pathname];
        return <PrerenderComponent />;
    }

    return <Navigate to="/auth" replace />;
};

export default PrivateRouteWithSEO;
