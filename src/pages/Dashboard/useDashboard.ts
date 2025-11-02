import { useState, useEffect } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { useAuth } from '@/context/AuthContext'
import { urlAPI, ShortUrl, CreateShortUrlRequest } from '@/utils/api/urlAPI'

export const useDashboard = () => {
    const { user, logout } = useAuth()
    const [isDarkTheme, setIsDarkTheme] = useState(true)
    const [originalUrl, setOriginalUrl] = useState('')
    const [customName, setCustomName] = useState('')
    const [expiresIn, setExpiresIn] = useState('30')
    const [urls, setUrls] = useState<ShortUrl[]>([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({ totalUrls: 0, totalClicks: 0 })
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        fetchUserUrls()
        fetchUrlStats()
    }, [])

    const fetchUserUrls = async () => {
        try {
            setLoading(true)
            const response = await urlAPI.getUserUrls()
            if (response.success) {
                setUrls(response.data)
            }
        } catch (error) {
            console.error('Failed to fetch URLs:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchUrlStats = async () => {
        try {
            const response = await urlAPI.getUrlStats()
            if (response.success) {
                setStats(response.data)
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error)
        }
    }

    const handleLogout = () => {
        logout()
    }

    const handleThemeToggle = () => {
        const newTheme = isDarkTheme ? 'light' : 'dark'
        setIsDarkTheme(!isDarkTheme)
        setTheme(newTheme)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const request: CreateShortUrlRequest = {
                originalUrl,
                customName: customName || undefined,
                expiresIn
            }
            const response = await urlAPI.createShortUrl(request)
            if (response.success) {
                setUrls(prev => [response.data, ...prev])
                setOriginalUrl('')
                setCustomName('')
                fetchUrlStats() // Refresh stats
            }
        } catch (error) {
            console.error('Failed to create short URL:', error)
        }
    }

    const handleCopy = (shortUrl: string) => {
        navigator.clipboard.writeText(shortUrl)
    }

    const handleDelete = async (id: string) => {
        try {
            const response = await urlAPI.deleteUrl(id)
            if (response.success) {
                setUrls(prev => prev.filter(url => url.id !== id))
                fetchUrlStats() // Refresh stats
            }
        } catch (error) {
            console.error('Failed to delete URL:', error)
        }
    }

    const getFullShortUrl = (shortCode: string) => {
        return `${window.location.origin}/u/${shortCode}`
    }

    const totalClicks = stats.totalClicks
    const activeUrls = stats.totalUrls

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
        handleLogout,
        handleThemeToggle,
        handleSubmit,
        handleCopy,
        handleDelete,
        getFullShortUrl,
        totalClicks,
        activeUrls
    }
}