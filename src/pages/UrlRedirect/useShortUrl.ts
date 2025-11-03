import { BASE_URL } from '@/config';
import { useState, useEffect } from 'react';

interface ShortUrlResponse {
    success: boolean;
    url?: string;
    message?: string;
    error?: string;
}

interface UseShortUrlResult {
    originalUrl: string | null;
    isLoading: boolean;
    error: string | null;
}

export const useShortUrl = (shortCode: string): UseShortUrlResult => {
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOriginalUrl = async () => {
            if (!shortCode) {
                setError('No short code provided');
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch(`${BASE_URL}/url/${shortCode}`);

                const data: ShortUrlResponse = await response.json();

                if (data.success && data.url) {
                    setOriginalUrl(data.url);
                } else {
                    setError(data.message || 'Failed to resolve URL');
                }
            } catch (err) {
                console.error('Error fetching original URL:', err);
                setError(err instanceof Error ? err.message : 'An unexpected error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOriginalUrl();
    }, [shortCode]);

    return { originalUrl, isLoading, error };
};
