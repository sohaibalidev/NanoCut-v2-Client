import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { ArrowLeft, Check, X } from 'lucide-react'
import Loader from '@/components/Loader'
import styles from './Verify.module.css'

const Verify: React.FC = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { loginWithToken, verifying } = useAuth()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    useEffect(() => {
        let isMounted = true

        const verifyToken = async () => {
            const token = searchParams.get('token')

            if (!token || token.length !== 64) {
                setMessage({
                    type: 'error',
                    text: 'Invalid verification link format.'
                })
                setLoading(false)
                return
            }

            try {
                if (!isMounted) return
                await loginWithToken(token)

                setMessage({
                    type: 'success',
                    text: 'Successfully logged in! Redirecting to dashboard...'
                })

                setTimeout(() => {
                    navigate('/dashboard', { replace: true })
                }, 2000)

            } catch (error: any) {
                if (!isMounted) return
                console.error('Verification failed:', error)
                setError(error)
                setMessage({
                    type: 'error',
                    text: error.message || 'Invalid or expired login link. Please try again.'
                })
            } finally {
                setLoading(false)
            }
        }

        verifyToken()

        return () => {
            isMounted = false
        }
    }, [searchParams])

    if (loading || verifying) {
        return <Loader />
    }

    return (
        <div className={styles.verifyContainer}>
            <div className={styles.verifyCard}>
                <div className={styles.statusIcon}>
                    {message?.type === 'success' ? (
                        <div className={styles.successIcon}>
                            <Check size={48} />
                        </div>
                    ) : (
                        <div className={styles.errorIcon}>
                            <X size={48} />
                        </div>
                    )}
                </div>

                <div className={styles.verifyHeader}>
                    <h1 className={styles.verifyTitle}>
                        {message?.type === 'success' ? 'Welcome!' : 'Verification Failed'}
                    </h1>
                    <p className={styles.verifySubtitle}>
                        {message?.type === 'success'
                            ? 'You have been successfully logged in.'
                            : 'Unable to verify your login link.'
                        }
                    </p>
                </div>

                {message && (
                    <div className={`${styles.alert} ${message.type === 'success' ? styles.alertSuccess : styles.alertError
                        }`}>
                        {message.text}
                    </div>
                )}

                <div className={styles.actions}>
                    {message?.type === 'error' && (
                        <button
                            onClick={() => navigate('/auth')}
                            className={`${styles.btn} ${styles.btnPrimary}`}
                        >
                            Try Again
                        </button>
                    )}

                    {message?.type === 'success' && (
                        <div className={styles.redirectMessage}>
                            <div className={styles.redirectSpinner}></div>
                            <span>Redirecting to dashboard...</span>
                        </div>
                    )}
                </div>

                <div className={styles.backContainer}>
                    <button
                        onClick={() => navigate('/')}
                        className={`${styles.btn} ${styles.btnSecondary}`}
                    >
                        <ArrowLeft size={18} className={styles.icon} />
                        <span>Back to Home</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Verify