import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import styles from './OfflineScreen.module.css';

const OfflineScreen: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.statusCard}>
                <WifiOff size={64} className={styles.statusIcon} />
                <h1 className={styles.statusTitle}>No Internet Connection</h1>
                <p className={styles.statusDescription}>
                    Please check your network connection and try again.
                </p>
            </div>
        </div>
    );
};

export default OfflineScreen;
