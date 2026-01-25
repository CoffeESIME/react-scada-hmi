import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: number;
    email: string;
    full_name: string | null;
    is_active: boolean;
    is_superuser: boolean;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
}

interface AuthActions {
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    setError: (error: string | null) => void;
    checkAuth: () => Promise<boolean>;
    isAuthenticated: () => boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888';

export const useAuthStore = create<AuthState & AuthActions>()(
    persist(
        (set, get) => ({
            // State
            user: null,
            token: null,
            isLoading: false,
            error: null,

            // Actions
            isAuthenticated: () => {
                return get().token !== null && get().user !== null;
            },

            setUser: (user) => set({ user }),
            setToken: (token) => set({ token }),
            setError: (error) => set({ error }),

            login: async (email: string, password: string): Promise<boolean> => {
                set({ isLoading: true, error: null });

                try {
                    // FastAPI Users expects form data for login
                    const formData = new URLSearchParams();
                    formData.append('username', email);
                    formData.append('password', password);

                    const response = await fetch(`${API_BASE_URL}/auth/jwt/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: formData.toString(),
                    });

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.detail || 'Error al iniciar sesión');
                    }

                    const data = await response.json();
                    const token = data.access_token;

                    set({ token, isLoading: false });

                    // Fetch user info
                    const userResponse = await fetch(`${API_BASE_URL}/users/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        set({ user: userData });
                    }

                    return true;
                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Error desconocido';
                    set({ error: message, isLoading: false });
                    return false;
                }
            },

            logout: () => {
                set({ user: null, token: null, error: null });
            },

            checkAuth: async (): Promise<boolean> => {
                const { token } = get();

                if (!token) {
                    return false;
                }

                try {
                    const response = await fetch(`${API_BASE_URL}/users/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        set({ user: userData });
                        return true;
                    } else {
                        // Token invalid, clear auth
                        set({ user: null, token: null });
                        return false;
                    }
                } catch {
                    return false;
                }
            },
        }),
        {
            name: 'scada-auth-storage',
            partialize: (state) => ({ token: state.token, user: state.user }),
        }
    )
);
