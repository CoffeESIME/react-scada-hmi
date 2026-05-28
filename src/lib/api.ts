
import axios from 'axios';
import { useAuthStore } from '@/app/store/useAuthStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888';

export const api = axios.create({
    baseURL: `${API_URL}/api`,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
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
    tagName?: string;
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

export const getLatestHistory = async (tagId: number, limit = 50) => {
    const response = await api.get<LatestHistoryResponse>(`/history/latest/${tagId}`, {
        params: { limit }
    });
    return response.data;
};

export interface ScreenShare {
    id: number;
    screen_id: number;
    user_id: number;
    role: 'VIEWER' | 'EDITOR';
    username: string;
    email: string;
}

export const shareScreen = async (screenId: number, usernameOrEmail: string, role: 'VIEWER' | 'EDITOR' = 'VIEWER') => {
    const response = await api.post<ScreenShare>(`/screens/${screenId}/share`, {
        username_or_email: usernameOrEmail,
        role
    });
    return response.data;
};

export const getScreenShares = async (screenId: number) => {
    const response = await api.get<ScreenShare[]>(`/screens/${screenId}/shares`);
    return response.data;
};

export const revokeScreenShare = async (screenId: number, userId: number) => {
    await api.delete(`/screens/${screenId}/share/${userId}`);
};

// ── Alarmas ──────────────────────────────────────────────────────────────────

export interface ActiveAlarmResponse {
    alarm_id: string;
    tag_id: number;
    severity: string;       // 'CRITICAL' | 'WARNING'
    message: string;
    status: string;         // 'ACTIVE'
    trigger_value: number;
    start_time: string | null;
}

export const getActiveAlarms = async (): Promise<ActiveAlarmResponse[]> => {
    const response = await api.get<ActiveAlarmResponse[]>('/alarms/active');
    return response.data;
};

