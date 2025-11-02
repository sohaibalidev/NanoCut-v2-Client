import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from 'react'
import { authAPI } from '@/utils/api/authAPI'
import { User } from '@/types'

interface AuthContextType {
    user: User | null
    loading: boolean,
    verifying: boolean,
    loginWithToken: (token: string) => Promise<void>
    logout: () => Promise<void>
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within an AuthProvider')
    return context
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [verifying, setVerifying] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuthStatus()
    }, [])

    const checkAuthStatus = async () => {
        try {
            const fetchedUser = await authAPI.getMe()
            setUser(fetchedUser)
        } catch {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    const loginWithToken = async (token: string) => {
        setVerifying(true)
        try {
            const res = await authAPI.loginWithToken(token)
            setUser(res.user)
        } catch (err) {
            console.error('Login failed:', err)
            setUser(null)
            throw err
        } finally {
            setVerifying(false)
        }
    }

    const logout = async () => {
        try {
            await authAPI.logout()
        } finally {
            setUser(null)
        }
    }

    const value: AuthContextType = {
        user,
        loading,
        verifying,
        loginWithToken,
        logout,
        isAuthenticated: !!user,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
