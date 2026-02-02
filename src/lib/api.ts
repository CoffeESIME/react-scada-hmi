/**
 * API Client for SCADA Backend
 * Centralized axios instance for all API calls
 */
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888';

export const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for auth token (if needed)
api.interceptors.request.use((config) => {
    // Add auth token if available
    const token = typeof window !== 'undefined'
        ? localStorage.getItem('access_token')
        : null;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common errors
        if (error.response?.status === 401) {
            // Redirect to login or refresh token
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;

export interface HistoryPoint {
    x: string; // ISO Date
    y: number;
}

export interface HistorySeries {
    tagId: number;
    data: HistoryPoint[];
}

export const getHistory = async (tagIds: number[], start: string, end: string) => {
    const response = await api.get<HistorySeries[]>('/history', {
        params: {
            tag_ids: tagIds.join(','),
            start,
            end
        }
    });
    return response.data;
};

export interface LatestHistoryResponse {
    tagId: number;
    data: HistoryPoint[];
}

export const getLatestHistory = async (tagId: number, limit: number = 50) => {
    const response = await api.get<LatestHistoryResponse>(`/history/latest/${tagId}`, {
        params: { limit }
    });
    return response.data;
};
