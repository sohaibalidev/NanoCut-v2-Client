import { useState, useEffect, useCallback } from 'react';
import { BASE_URL } from '@/config';

interface ServerStatus {
    isServerOnline: boolean | null;
    isChecking: boolean;
    checkServerStatus: () => Promise<void>;
}

export default function useServerStatus(url: string = `${BASE_URL}/health`): ServerStatus {
    const [isServerOnline, setIsServerOnline] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState<boolean>(false);

    const checkServerStatus = useCallback(async (): Promise<void> => {
        setIsChecking(true);
        try {
            const res = await fetch(url, {
                headers: { 'Content-Type': 'application/json' },
                signal: AbortSignal.timeout(5000),
            });
            const data = await res.json();
            setIsServerOnline(res.ok && data.status === 'success');
        } catch {
            setIsServerOnline(false);
        } finally {
            setIsChecking(false);
        }
    }, [url]);

    useEffect(() => {
        checkServerStatus();
    }, [checkServerStatus]);

    return { isServerOnline, isChecking, checkServerStatus };
}
