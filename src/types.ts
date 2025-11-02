export interface User {
    id: string
    email: string
    lastLogin?: string
    createdAt?: string
}

export interface ApiResponse<T = any> {
    status: 'success' | 'error'
    message: string
    user?: T
    data?: T
}

export interface RegisterResponse {
    status: 'success'
    message: string
}

export interface LoginResponse {
    status: 'success'
    message: string
    user: User
}
