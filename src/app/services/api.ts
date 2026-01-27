/**
 * API Service for SCADA Backend communication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888';

/**
 * Helper to get auth headers
 */
function getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined'
        ? JSON.parse(localStorage.getItem('scada-auth-storage') || '{}')?.state?.token
        : null;

    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
}

/**
 * Generic fetch wrapper with auth
 */
async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            ...getAuthHeaders(),
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Error de red' }));
        throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
}

// ============ Auth API ============

export const authApi = {
    login: async (email: string, password: string) => {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const response = await fetch(`${API_BASE_URL}/auth/jwt/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString(),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || 'Credenciales inválidas');
        }

        return response.json();
    },

    getCurrentUser: () => apiFetch('/auth/me'),

    register: async (email: string, username: string, password: string, fullName?: string) => {
        return apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, username, password, full_name: fullName }),
        });
    },
};

// ============ Tags API ============

export const tagsApi = {
    getAll: () => apiFetch('/api/v1/tags'),
    getById: (id: number) => apiFetch(`/api/v1/tags/${id}`),
    getMetrics: (tagId: number, limit = 100) =>
        apiFetch(`/api/v1/metrics/${tagId}?limit=${limit}`),
};

// ============ Screens API ============

export interface ScreenData {
    name: string;
    description?: string;
    viewport_x?: number;
    viewport_y?: number;
    viewport_zoom?: number;
    nodes?: unknown[];
    edges?: unknown[];
}

export const screensApi = {
    getAll: () => apiFetch('/screens'),
    getById: (id: number) => apiFetch(`/screens/${id}`),
    create: (data: ScreenData) =>
        apiFetch('/screens', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: number, data: Partial<ScreenData>) =>
        apiFetch(`/screens/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: number) =>
        apiFetch(`/screens/${id}`, { method: 'DELETE' }),
};

// ============ Health API ============

export const healthApi = {
    check: () => apiFetch<{ status: string }>('/health'),
};

export default {
    auth: authApi,
    tags: tagsApi,
    screens: screensApi,
    health: healthApi,
};
