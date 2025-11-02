import { BASE_URL } from '@/config'
import { User, ApiResponse, RegisterResponse, LoginResponse } from '@/types'

class ApiError extends Error {
    status: number
    constructor(status: number, message: string) {
        super(message)
        this.name = 'ApiError'
        this.status = status
    }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
    let data: any
    try {
        data = await response.json()
    } catch {
        data = { message: 'Invalid JSON response' }
    }
    if (!response.ok) {
        throw new ApiError(response.status, data?.message || 'Something went wrong')
    }
    return data as T
}

export const authAPI = {
    register: async (email: string): Promise<RegisterResponse> => {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
            credentials: 'include',
        })
        return handleResponse<RegisterResponse>(response)
    },

    loginWithToken: async (token: string): Promise<LoginResponse> => {
        const response = await fetch(`${BASE_URL}/auth/login/${token}`, {
            method: 'GET',
            credentials: 'include',
        })
        return handleResponse<LoginResponse>(response)
    },

    getMe: async (): Promise<User> => {
        const response = await fetch(`${BASE_URL}/auth/me`, {
            method: 'GET',
            credentials: 'include',
        })
        const result = await handleResponse<ApiResponse<User>>(response)
        if (result.user) return result.user
        if (result.data) return result.data
        throw new ApiError(500, 'Malformed response from server')
    },

    logout: async (): Promise<void> => {
        const response = await fetch(`${BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        })
        if (!response.ok) {
            const data = await response.json().catch(() => ({}))
            throw new ApiError(response.status, data.message || 'Logout failed')
        }
    },
}
