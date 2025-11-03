import React from 'react'
import styles from './Loader.module.css'

const Loader: React.FC = () => {
    return (
        <div className={styles.pageContainer}>
            <div className={styles.card}>
                <div className={styles.textCenter}>
                    <div className={styles.spinner}></div>
                    <p className={styles.loadingText}>Loading...</p>
                </div>
            </div>
        </div>
    )
}

export default Loader