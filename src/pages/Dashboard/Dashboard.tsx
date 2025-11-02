import React from 'react'
import { LogOut, Sun, Moon, Link2, Calendar, Copy, Trash2, ExternalLink, Plus, BarChart3, Clock, Hash, Loader } from 'lucide-react'
import { useDashboard } from './useDashboard'
import styles from './Dashboard.module.css'

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
        handleLogout,
        handleThemeToggle,
        handleSubmit,
        handleCopy,
        handleDelete,
        getFullShortUrl,
        totalClicks,
        activeUrls
    } = useDashboard()

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Loader className={styles.spinner} size={32} />
                <p>Loading your URLs...</p>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.logoGroup}>
                    <div className={styles.logo}>NanoCut</div>
                    <div className={styles.userWelcome}>Welcome, {user?.email}</div>
                </div>
                <div className={styles.actionButtonGroup}>
                    <button
                        onClick={handleThemeToggle}
                        className={styles.iconActionBtn}
                        title={isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme'}
                    >
                        {isDarkTheme ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                    <button
                        onClick={handleLogout}
                        className={styles.textActionBtn}
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.dashboardHeader}>
                    <div className={styles.headerContent}>
                        <h1 className={styles.dashboardTitle}>Your Short URLs</h1>
                        <p className={styles.dashboardSubtitle}>Create and manage your shortened links</p>
                    </div>
                    <div className={styles.statsContainer}>
                        <div className={styles.statItem}>
                            <BarChart3 size={20} className={styles.statIcon} />
                            <div className={styles.statContent}>
                                <span className={styles.statNumber}>{activeUrls}</span>
                                <span className={styles.statLabel}>Active URLs</span>
                            </div>
                        </div>
                        <div className={styles.statItem}>
                            <Link2 size={20} className={styles.statIcon} />
                            <div className={styles.statContent}>
                                <span className={styles.statNumber}>{totalClicks}</span>
                                <span className={styles.statLabel}>Total Clicks</span>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className={styles.urlForm}>
                    <div className={styles.formHeader}>
                        <Plus size={20} />
                        <span>Create New Short URL</span>
                    </div>
                    <div className={styles.formGrid}>
                        <input
                            type="url"
                            value={originalUrl}
                            onChange={(e) => setOriginalUrl(e.target.value)}
                            placeholder="Paste your long URL here"
                            required
                            className={styles.urlInput}
                        />
                        <input
                            type="text"
                            value={customName}
                            onChange={(e) => setCustomName(e.target.value)}
                            placeholder="Custom alias (optional)"
                            className={styles.customInput}
                        />
                        <select
                            value={expiresIn}
                            onChange={(e) => setExpiresIn(e.target.value)}
                            className={styles.expiresSelect}
                        >
                            <option value="7">7 days</option>
                            <option value="30">30 days</option>
                            <option value="90">90 days</option>
                            <option value="365">1 year</option>
                        </select>
                        <button type="submit" className={styles.submitBtn}>
                            <Link2 size={18} />
                            Shorten
                        </button>
                    </div>
                </form>

                <div className={styles.urlListSection}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Recent URLs</h2>
                        <span className={styles.urlCount}>{urls.length} links</span>
                    </div>

                    <ul className={styles.urlList}>
                        {urls.map((url) => (
                            <li key={url.id} className={styles.urlItem}>
                                <div className={styles.urlContent}>
                                    <div className={styles.urlHeader}>
                                        <div className={styles.urlInfo}>
                                            <h3 className={styles.urlTitle}>
                                                {url.customName || getFullShortUrl(url.shortCode)}
                                            </h3>
                                            <p className={styles.originalUrl}>{url.originalUrl}</p>
                                        </div>
                                        <div className={styles.urlActions}>
                                            <button
                                                onClick={() => handleCopy(getFullShortUrl(url.shortCode))}
                                                className={styles.iconBtn}
                                                title="Copy URL"
                                            >
                                                <Copy size={16} />
                                            </button>
                                            <a
                                                href={getFullShortUrl(url.shortCode)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={styles.iconBtn}
                                                title="Visit URL"
                                            >
                                                <ExternalLink size={16} />
                                            </a>
                                            <button
                                                onClick={() => handleDelete(url.id)}
                                                className={`${styles.iconBtn} ${styles.deleteBtn}`}
                                                title="Delete URL"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className={styles.urlMeta}>
                                        <span className={styles.shortCodeDisplay}>
                                            <Hash size={14} />
                                            {url.shortCode}
                                        </span>
                                        <span className={styles.clicks}>
                                            <Link2 size={14} />
                                            {url.clicks} clicks
                                        </span>
                                        <span className={styles.expires}>
                                            <Calendar size={14} />
                                            Expires {new Date(url.expiresAt).toLocaleDateString()}
                                        </span>
                                        <span className={styles.created}>
                                            <Clock size={14} />
                                            Created {new Date(url.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </main>
        </div>
    )
}

export default Dashboard