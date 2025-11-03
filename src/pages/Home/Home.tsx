import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Shield, Rocket, BarChart3, Moon, Sun } from 'lucide-react';
import { setWithExpiry, getWithExpiry } from '@/utils/storageWithExpiry';
import styles from './Home.module.css';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [urlInput, setUrlInput] = useState((getWithExpiry('urlToShorten') as string) || '');
  const [isDarkTheme, setIsDarkTheme] = useState(theme === 'dark');

  const handleShortenUrl = () => {
    const toShortenUrl = urlInput.trim();
    if (!toShortenUrl.startsWith('https://') || toShortenUrl.length < 14) {
      setUrlInput('');
      return;
    }

    setWithExpiry('urlToShorten', urlInput, 10);
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/auth';
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleShortenUrl();
    }
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    setTheme(isDarkTheme ? 'light' : 'dark');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span>NanoCut</span>
        </div>
        <nav className={styles.navLinks}>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#faq">FAQ</a>
          <a href="#blog">Blog</a>
        </nav>
        <div className={styles.headerActions}>
          <button
            id="theme-toggle"
            className={styles.themeToggle}
            aria-label="Toggle theme"
            onClick={toggleTheme}
          >
            {isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className={styles.authOptions}>
            {isAuthenticated ? (
              <>
                <span className={styles.welcomeText}>
                  <span>Welcome,</span>
                  <span>{user?.email}</span>
                </span>
                <Link to="/dashboard" className={`${styles.btn} ${styles.btnOutline}`}>
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/auth" className={`${styles.btn} ${styles.btnOutline}`}>
                  Login
                </Link>
                <Link to="/auth" className={`${styles.btn} ${styles.btnPrimary}`}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Short links, big results</h1>
            <p className={styles.heroText}>
              Create branded, short URLs with powerful analytics to track your audience and optimize
              your marketing.
            </p>

            <div className={styles.urlShortener}>
              <div className={styles.inputGroup}>
                <input
                  type="url"
                  id="url-input"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Paste your long URL here"
                  autoComplete="off"
                  required
                  className={styles.urlInput}
                />
                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  id="shorten-btn"
                  onClick={handleShortenUrl}
                >
                  Shorten
                </button>
              </div>
              <p className={styles.disclaimer}>
                By shortening a URL, you agree to our <a href="#terms">Terms of Service</a>
              </p>
            </div>

            <div className={styles.trustBadges}>
              <div className={styles.badge}>
                <Shield className={styles.badgeIcon} />
                <span>Secure Links</span>
              </div>
              <div className={styles.badge}>
                <Rocket className={styles.badgeIcon} />
                <span>Fast Redirects</span>
              </div>
              <div className={styles.badge}>
                <BarChart3 className={styles.badgeIcon} />
                <span>Powerful Analytics</span>
              </div>
            </div>
          </div>
          <div className={styles.heroImage}>
            <img src="favicon.png" alt="NanoCut" loading="lazy" />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
