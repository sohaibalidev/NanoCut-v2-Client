import React from 'react';
import {
    LogOut,
    Sun,
    Moon,
    Link2,
    Calendar,
    Copy,
    Trash2,
    ExternalLink,
    Plus,
    BarChart3,
    Clock,
    Hash,
    Loader,
    AlertCircle,
    CheckCircle,
} from 'lucide-react';
import { useDashboard } from './useDashboard';
import styles from './Dashboard.module.css';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';

const Dashboard: React.FC = () => {
    const {
        user,
        isDarkTheme,
        originalUrl,
        setOriginalUrl,
        customName,
        setCustomName,
        expiresIn,
        setExpiresIn,
        urls,
        loading,
        creating,
        error,
        success,
        handleLogout,
        handleToggle,
        handleThemeToggle,
        handleSubmit,
        handleCopy,
        handleDelete,
        getFullShortUrl,
        totalClicks,
        activeUrls,
    } = useDashboard();

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Loader className={styles.spinner} size={32} />
                <p>Loading your URLs...</p>
            </div>
        );
    }

    return (
        <>
            <SEO
                title="Dashboard"
                description="Manage your links, view analytics, and customize short URLs all from your NanoCut V2 dashboard."
                path="/dashboard"
            />

            <div className={styles.container}>
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <div className={styles.brandSection}>
                            <div className={styles.logo}>
                                <Link to={'/'}>NanoCut</Link>
                            </div>
                            <div className={styles.userWelcome}>Welcome, {user?.email}</div>
                        </div>
                        <div className={styles.actionsSection}>
                            <button
                                onClick={handleThemeToggle}
                                className={styles.iconActionBtn}
                                title={
                                    isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'
                                }
                            >
                                {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
                            </button>
                            <button onClick={handleLogout} className={styles.textActionBtn}>
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </div>
                </header>

                <div className={styles.mainLayout}>
                    <aside className={styles.sidebar}>
                        <div className={styles.statsSection}>
                            <h3 className={styles.statsTitle}>Overview</h3>
                            <div className={styles.statsGrid}>
                                <div className={styles.statCard}>
                                    <div className={styles.statIconWrapper}>
                                        <BarChart3 size={20} />
                                    </div>
                                    <div className={styles.statContent}>
                                        <span className={styles.statNumber}>{activeUrls}</span>
                                        <span className={styles.statLabel}>Active URLs</span>
                                    </div>
                                </div>
                                <div className={styles.statCard}>
                                    <div className={styles.statIconWrapper}>
                                        <Link2 size={20} />
                                    </div>
                                    <div className={styles.statContent}>
                                        <span className={styles.statNumber}>{totalClicks}</span>
                                        <span className={styles.statLabel}>Total Clicks</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.quickCreateSection}>
                            <h3 className={styles.sectionTitle}>Create Short URL</h3>
                            <form onSubmit={handleSubmit} className={styles.quickForm}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="originalUrl" className={styles.inputLabel}>
                                        Long URL
                                    </label>
                                    <input
                                        id="originalUrl"
                                        type="url"
                                        value={originalUrl}
                                        onChange={(e) => setOriginalUrl(e.target.value)}
                                        placeholder="https://example.com/very-long-url"
                                        required
                                        className={styles.input}
                                        disabled={creating}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="customName" className={styles.inputLabel}>
                                        Custom Alias (Optional)
                                    </label>
                                    <input
                                        id="customName"
                                        type="text"
                                        value={customName}
                                        onChange={(e) => setCustomName(e.target.value)}
                                        placeholder="my-custom-link"
                                        className={styles.input}
                                        disabled={creating}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="expiresIn" className={styles.inputLabel}>
                                        Expires In
                                    </label>
                                    <select
                                        id="expiresIn"
                                        value={expiresIn}
                                        onChange={(e) => setExpiresIn(e.target.value)}
                                        className={styles.select}
                                        disabled={creating}
                                    >
                                        <option value="7">7 days</option>
                                        <option value="30">30 days</option>
                                        <option value="90">90 days</option>
                                        <option value="365">1 year</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    className={styles.createButton}
                                    disabled={creating || !originalUrl.trim()}
                                >
                                    {creating ? (
                                        <Loader className={styles.buttonSpinner} size={18} />
                                    ) : (
                                        <Link2 size={18} />
                                    )}
                                    {creating ? 'Creating...' : 'Create Short URL'}
                                </button>
                            </form>
                        </div>
                    </aside>

                    <main className={styles.mainContent}>
                        {(error || success) && (
                            <div className={styles.messagesSection}>
                                {error && (
                                    <div className={styles.errorBanner}>
                                        <AlertCircle size={20} />
                                        <span>{error}</span>
                                    </div>
                                )}
                                {success && (
                                    <div className={styles.successBanner}>
                                        <CheckCircle size={20} />
                                        <span>{success}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        <section className={styles.urlListSection}>
                            <div className={styles.sectionHeader}>
                                <div className={styles.sectionTitleGroup}>
                                    <h2 className={styles.sectionTitle}>Your Short URLs</h2>
                                    <p className={styles.sectionSubtitle}>
                                        Manage and track your shortened links
                                    </p>
                                </div>
                                <div className={styles.urlCountBadge}>
                                    {urls.length} {urls.length === 1 ? 'Link' : 'Links'}
                                </div>
                            </div>

                            {urls.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <Link2 size={48} className={styles.emptyStateIcon} />
                                    <h3 className={styles.emptyStateTitle}>No URLs Yet</h3>
                                    <p className={styles.emptyStateDescription}>
                                        Create your first short URL using the form on the left.
                                    </p>
                                </div>
                            ) : (
                                <div className={styles.urlList}>
                                    {urls.map((url) => (
                                        <div key={url.id} className={styles.urlCard}>
                                            <div className={styles.urlCardHeader}>
                                                <div className={styles.urlInfo}>
                                                    <div className={styles.urlTitleRow}>
                                                        <h3 className={styles.urlTitle}>
                                                            {url.customName ||
                                                                getFullShortUrl(url.shortCode)}
                                                        </h3>
                                                        <div className={styles.urlStatus}>
                                                            <span
                                                                className={`${styles.statusBadge} ${
                                                                    url.isActive
                                                                        ? styles.statusActive
                                                                        : styles.statusInactive
                                                                }`}
                                                            >
                                                                {url.isActive
                                                                    ? 'Active'
                                                                    : 'Inactive'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className={styles.originalUrl}>
                                                        {url.originalUrl}
                                                    </p>
                                                </div>
                                                <div className={styles.urlActions}>
                                                    {/* Toggle Slider */}
                                                    <div className={styles.toggleContainer}>
                                                        <label className={styles.toggleLabel}>
                                                            <input
                                                                type="checkbox"
                                                                checked={url.isActive}
                                                                onChange={() =>
                                                                    handleToggle(url.id)
                                                                }
                                                                className={styles.toggleInput}
                                                            />
                                                            <span
                                                                className={styles.toggleSlider}
                                                            ></span>
                                                        </label>
                                                    </div>

                                                    <button
                                                        onClick={() =>
                                                            handleCopy(
                                                                getFullShortUrl(url.shortCode)
                                                            )
                                                        }
                                                        className={styles.actionButton}
                                                        title="Copy URL"
                                                    >
                                                        <Copy size={16} />
                                                    </button>
                                                    <a
                                                        href={getFullShortUrl(url.shortCode)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={styles.actionButton}
                                                        title="Visit URL"
                                                    >
                                                        <ExternalLink size={16} />
                                                    </a>
                                                    <button
                                                        onClick={() => handleDelete(url.id)}
                                                        className={`${styles.actionButton} ${styles.deleteButton}`}
                                                        title="Delete URL"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className={styles.urlMeta}>
                                                <div className={styles.metaItem}>
                                                    <Hash size={14} />
                                                    <span>Code: {url.shortCode}</span>
                                                </div>
                                                <div className={styles.metaItem}>
                                                    <Link2 size={14} />
                                                    <span>{url.clicks} clicks</span>
                                                </div>
                                                <div className={styles.metaItem}>
                                                    <Calendar size={14} />
                                                    <span>
                                                        Expires:{' '}
                                                        {new Date(
                                                            url.expiresAt
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <div className={styles.metaItem}>
                                                    <Clock size={14} />
                                                    <span>
                                                        Created:{' '}
                                                        {new Date(
                                                            url.createdAt
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>

                                            {url.customName && (
                                                <div className={styles.customNameBadge}>
                                                    Custom: {url.customName}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </main>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
