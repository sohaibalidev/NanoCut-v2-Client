import React from 'react';
import { ServerOff, RefreshCw } from 'lucide-react';
import styles from './ServerDownScreen.module.css';

interface ServerDownScreenProps {
    retry: () => void;
    isChecking: boolean;
}

const ServerDownScreen: React.FC<ServerDownScreenProps> = ({ retry, isChecking }) => {
    return (
        <div className={styles.container}>
            <div className={styles.statusCard}>
                <ServerOff size={72} className={styles.statusIcon} />
                <h1 className={styles.statusTitle}>Server Unavailable</h1>
                <p className={styles.statusDescription}>
                    The server isn't responding at the moment. We're working to restore service as
                    soon as possible.
                </p>
                <button onClick={retry} disabled={isChecking} className={styles.retryBtn}>
                    {isChecking ? (
                        <>
                            <RefreshCw size={20} className={styles.spinning} />
                            Checking Server Status...
                        </>
                    ) : (
                        <>
                            <RefreshCw size={20} />
                            Check Server Status
                        </>
                    )}
                </button>
                <div className={styles.statusNote}>
                    Last checked: {new Date().toLocaleTimeString()}
                </div>
            </div>
        </div>
    );
};

export default ServerDownScreen;
