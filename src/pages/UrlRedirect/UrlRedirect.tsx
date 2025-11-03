import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShortUrl } from './useShortUrl';
import { AlertCircle, Link, Loader2 } from 'lucide-react';
import styles from './UrlRedirect.module.css';

const UrlRedirect: React.FC = () => {
    const { shortCode } = useParams<{ shortCode: string }>();
    const { originalUrl, isLoading, error } = useShortUrl(shortCode || '');
    const navigate = useNavigate();

    useEffect(() => {
        if (originalUrl) {
            window.location.href = originalUrl;
        }
    }, [originalUrl]);

    const handleGoHome = () => {
        navigate('/');
    };

    const handleTryAgain = () => {
        window.location.reload();
    };

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.logo}>NanoCut v2</div>
                    <Loader2 className={styles.loadingSpinner} />
                    <h1 className={styles.title}>Redirecting...</h1>
                    <p className={styles.message}>
                        Please wait while we redirect you to your destination.
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.logo}>NanoCut v2</div>
                    <AlertCircle className={styles.errorIcon} />
                    <h1 className={styles.title}>Unable to Redirect</h1>
                    <p className={styles.errorMessage}>{error}</p>
                    <div className={styles.buttonGroup}>
                        <button className={styles.primaryButton} onClick={handleTryAgain}>
                            Try Again
                        </button>
                        <button className={styles.secondaryButton} onClick={handleGoHome}>
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.logo}>NanoCut v2</div>
                <Link className={styles.successIcon} />
                <h1 className={styles.title}>Redirecting Now</h1>
                <p className={styles.message}>You are being redirected to the original URL.</p>
                <p className={styles.urlPreview}>
                    {originalUrl && <small>Destination: {originalUrl}</small>}
                </p>
            </div>
        </div>
    );
};

export default UrlRedirect;
