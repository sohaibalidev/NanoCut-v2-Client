import { BASE_URL } from '@/config';

export interface ShortUrl {
    id: string;
    shortCode: string;
    originalUrl: string;
    customName?: string;
    expiresAt: string;
    clicks: number;
    createdAt: string;
    isActive: boolean; 
}

export interface CreateShortUrlRequest {
    originalUrl: string;
    customName?: string;
    expiresIn: string;
}

export interface CreateShortUrlResponse {
    success: boolean;
    data: ShortUrl;
    message?: string;
}

export interface GetUserUrlsResponse {
    success: boolean;
    data: ShortUrl[];
    message?: string;
}

export interface UrlStatsResponse {
    success: boolean;
    data: {
        totalUrls: number;
        totalClicks: number;
    };
    message?: string;
}

export interface DeleteUrlResponse {
    success: boolean;
    message: string;
}

export interface ToggleUrlResponse {
    success: boolean;
    message: string;
    data: {
        isActive: boolean;
        expiresAt: string;
    };
}

class ApiError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
    let data: any;
    try {
        data = await response.json();
    } catch {
        data = { message: 'Invalid JSON response' };
    }
    if (!response.ok) {
        throw new ApiError(response.status, data?.message || 'Something went wrong');
    }
    return data as T;
};

export const urlAPI = {
    createShortUrl: async (request: CreateShortUrlRequest): Promise<CreateShortUrlResponse> => {
        const response = await fetch(`${BASE_URL}/url/shorten`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
            credentials: 'include',
        });
        return handleResponse<CreateShortUrlResponse>(response);
    },

    getUserUrls: async (): Promise<GetUserUrlsResponse> => {
        const response = await fetch(`${BASE_URL}/url/my-urls`, {
            method: 'GET',
            credentials: 'include',
        });
        return handleResponse<GetUserUrlsResponse>(response);
    },

    getUrlStats: async (): Promise<UrlStatsResponse> => {
        const response = await fetch(`${BASE_URL}/url/stats`, {
            method: 'GET',
            credentials: 'include',
        });
        return handleResponse<UrlStatsResponse>(response);
    },

    deleteUrl: async (id: string): Promise<DeleteUrlResponse> => {
        const response = await fetch(`${BASE_URL}/url/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        return handleResponse<DeleteUrlResponse>(response);
    },

    toggleUrl: async (id: string): Promise<ToggleUrlResponse> => {
        const response = await fetch(`${BASE_URL}/url/${id}/toggle`, {
            method: 'PATCH',
            credentials: 'include',
        });
        return handleResponse<ToggleUrlResponse>(response);
    },
};
