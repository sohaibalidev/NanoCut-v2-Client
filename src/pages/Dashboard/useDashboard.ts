import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { urlAPI, ShortUrl, CreateShortUrlRequest } from '@/utils/api/urlAPI';
import { getWithExpiry } from '@/utils/storageWithExpiry';

export const useDashboard = () => {
    const { user, logout } = useAuth();
    const [isDarkTheme, setIsDarkTheme] = useState(true);
    const [originalUrl, setOriginalUrl] = useState('');
    const [customName, setCustomName] = useState('');
    const [expiresIn, setExpiresIn] = useState('30');
    const [urls, setUrls] = useState<ShortUrl[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [stats, setStats] = useState({ totalUrls: 0, totalClicks: 0 });
    const { setTheme } = useTheme();

    useEffect(() => {
        fetchUserUrls();
        fetchUrlStats();
    }, []);

    useEffect(() => {
        const savedUrl = getWithExpiry<string>('urlToShorten');
        if (!savedUrl) return;

        const shortenUrl = async () => {
            try {
                setLoading(true);
                const request: CreateShortUrlRequest = {
                    originalUrl: savedUrl,
                    expiresIn: '30',
                };

                const response = await urlAPI.createShortUrl(request);
                if (response.success) {
                    setUrls((prev) => [response.data, ...prev]);
                    setSuccess('URL shortened successfully!');
                }
            } catch (error) {
                console.error('Auto-create failed:', error);
                setError('Failed to automatically shorten URL');
            } finally {
                setLoading(false);
            }
        };

        shortenUrl();
    }, []);

    const fetchUserUrls = async () => {
        try {
            setLoading(true);
            const response = await urlAPI.getUserUrls();
            if (response.success) {
                setUrls(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch URLs:', error);
            setError('Failed to load your URLs');
        } finally {
            setLoading(false);
        }
    };

    const fetchUrlStats = async () => {
        try {
            const response = await urlAPI.getUrlStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const handleLogout = () => {
        logout();
    };

    const handleThemeToggle = () => {
        const newTheme = isDarkTheme ? 'light' : 'dark';
        setIsDarkTheme(!isDarkTheme);
        setTheme(newTheme);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!originalUrl.trim()) {
            setError('Please enter a URL to shorten');
            return;
        }

        try {
            setCreating(true);
            setError(null);
            setSuccess(null);

            const request: CreateShortUrlRequest = {
                originalUrl: originalUrl.trim(),
                customName: customName.trim() || undefined,
                expiresIn,
            };

            const response = await urlAPI.createShortUrl(request);

            if (response.success) {
                setUrls((prev) => [response.data, ...prev]);
                setOriginalUrl('');
                setCustomName('');
                setExpiresIn('30');
                setSuccess(
                    `URL shortened successfully! Your short code: ${response.data.shortCode}`
                );
                fetchUrlStats();

                setTimeout(() => {
                    setSuccess(null);
                }, 2000);
            }
        } catch (error: any) {
            console.error('Failed to create short URL:', error);

            if (error.status === 400) {
                setError(error.message || 'Invalid request. Please check your input.');
            } else if (error.status === 500) {
                setError('Server error. Please try again later.');
            } else if (error.message?.includes('Custom name already exists')) {
                setError('This custom name is already taken. Please choose another one.');
            } else if (error.message?.includes('Unable to generate unique short code')) {
                setError('Unable to generate a unique short code. Please try again.');
            } else {
                setError(error.message || 'Failed to create short URL. Please try again.');
            }

            setTimeout(() => {
                setError(null);
            }, 2000);
        } finally {
            setCreating(false);
        }
    };

    const handleCopy = (shortUrl: string) => {
        navigator.clipboard.writeText(shortUrl);
        setSuccess('URL copied to clipboard!');
        setTimeout(() => setSuccess(null), 2000);
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await urlAPI.deleteUrl(id);
            if (response.success) {
                setUrls((prev) => prev.filter((url) => url.id !== id));
                setSuccess('URL deleted successfully');
                fetchUrlStats();
                setTimeout(() => setSuccess(null), 2000);
            }
        } catch (error: any) {
            console.error('Failed to delete URL:', error);
            setError(error.message || 'Failed to delete URL');
            setTimeout(() => setError(null), 2000);
        }
    };

    const clearError = () => {
        setError(null);
    };

    const clearSuccess = () => {
        setSuccess(null);
    };

    const getFullShortUrl = (shortCode: string) => {
        return `${window.location.origin}/u/${shortCode}`;
    };

    const totalClicks = stats.totalClicks;
    const activeUrls = stats.totalUrls;

    return {
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
        creating,
        error,
        success,
        handleLogout,
        handleThemeToggle,
        handleSubmit,
        handleCopy,
        handleDelete,
        getFullShortUrl,
        totalClicks,
        activeUrls,
        clearError,
        clearSuccess,
    };
};
