import SEO from '@/components/SEO';

export default function DashboardPrerender() {
    return (
        <>
            <SEO
                title="Dashboard"
                description="Manage your shortened URLs, track analytics, and customize links with NanoCut V2's user dashboard."
                path="/dashboard"
            />
            <div style={{ display: 'none' }}>
                <h1>NanoCut Dashboard</h1>
                <p>
                    The NanoCut V2 Dashboard lets users manage their short links, view statistics,
                    and customize URLs for better performance.
                </p>
                <ul>
                    <li>Track link performance with detailed analytics.</li>
                    <li>Deactivate, reactivate, or delete short URLs anytime.</li>
                    <li>Organize and manage your custom URLs easily.</li>
                </ul>
            </div>
        </>
    );
}
