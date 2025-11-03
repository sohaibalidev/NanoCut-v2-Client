import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '@/utils/api/authAPI';
import { useTheme } from '@/context/ThemeContext';
import { ArrowLeft, Mail, Shield, Check, Moon, Sun } from 'lucide-react';
import SEO from '@/components/SEO';
import styles from './Auth.module.css';

const Auth: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { theme, setTheme } = useTheme();
    const [isDarkTheme, setIsDarkTheme] = useState(theme === 'dark');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
        null
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            setMessage({ type: 'error', text: 'Please enter your email address' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            await authAPI.register(email);
            setMessage({
                type: 'success',
                text: 'Login link sent to your email! Please check your inbox.',
            });
            setEmail('');
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.message || 'Failed to send login link. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
        setTheme(isDarkTheme ? 'light' : 'dark');
    };

    return (
        <>
            <SEO
                title="Login"
                description="Access your NanoCut V2 account - log in to manage, track, and customize your short URLs with ease."
                path="/auth"
            />

            <div className={styles.authContainer}>
                <div className={styles.authLayout}>
                    <div className={styles.illustrationSection}>
                        <div className={styles.illustrationOverlay}>
                            <div className={styles.illustrationContent}>
                                <h3 className={styles.illustrationTitle}>Experience Excellence</h3>
                                <p className={styles.illustrationText}>
                                    Join thousands of premium users who trust NanoCut for their
                                    professional needs.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formSection}>
                        <div className={styles.authCard}>
                            <div className={styles.brandHeader}>
                                <div className={styles.brandLogo}>
                                    <img
                                        src="/favicon.png"
                                        alt="NanoCut"
                                        className={styles.logoImage}
                                    />
                                </div>
                                <div className={styles.brandText}>
                                    <span className={styles.brandName}>NanoCut</span>
                                    <span className={styles.brandTagline}>Premium Solutions</span>
                                </div>
                                <button
                                    id="theme-toggle"
                                    className={styles.themeToggle}
                                    aria-label="Toggle theme"
                                    onClick={toggleTheme}
                                >
                                    {isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
                                </button>
                            </div>

                            <div className={styles.authHeader}>
                                <h1 className={styles.authTitle}>Welcome Back</h1>
                                <p className={styles.authSubtitle}>
                                    Enter your email to receive a secure, one-time login link
                                </p>
                            </div>

                            {message && (
                                <div
                                    className={`${styles.alert} ${
                                        message.type === 'success'
                                            ? styles.alertSuccess
                                            : styles.alertError
                                    }`}
                                >
                                    <div className={styles.alertIcon}>
                                        {message.type === 'success' ? (
                                            <Check size={16} />
                                        ) : (
                                            <Shield size={16} />
                                        )}
                                    </div>
                                    <span>{message.text}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className={styles.authForm}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="email" className={styles.formLabel}>
                                        Email Address
                                    </label>
                                    <div className={styles.inputContainer}>
                                        <Mail size={18} className={styles.inputIcon} />
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className={styles.formInput}
                                            placeholder="you@example.com"
                                            disabled={loading}
                                            required
                                            autoComplete="email"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className={`${styles.btn} ${styles.btnPrimary}`}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <div className={styles.spinner}></div>
                                            Sending Secure Link...
                                        </>
                                    ) : (
                                        <>
                                            <Mail size={18} className={styles.btnIcon} />
                                            Send Secure Login Link
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className={styles.legalText}>
                                By continuing, you agree to our{' '}
                                <a href="#" className={styles.legalLink}>
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="#" className={styles.legalLink}>
                                    Privacy Policy
                                </a>
                            </div>

                            <div className={styles.backContainer}>
                                <Link to="/" className={`${styles.btn} ${styles.btnSecondary}`}>
                                    <ArrowLeft size={18} className={styles.icon} />
                                    <span>Back to Home</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Auth;
