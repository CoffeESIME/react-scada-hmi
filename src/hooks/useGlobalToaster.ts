'use client';

import { create } from 'zustand';

export type ToastLevel = 'success' | 'error' | 'info';

export interface ToastItem {
    id: string;
    level: ToastLevel;
    title: string;
    description?: string;
    createdAt: number;
    autoCloseMs?: number;
}

interface ToasterState {
    toasts: ToastItem[];
    add: (toast: Omit<ToastItem, 'id' | 'createdAt'>) => void;
    remove: (id: string) => void;
}

export const useToasterStore = create<ToasterState>((set) => ({
    toasts: [],
    add: (t) => {
        const id = `${Date.now()}-${Math.random()}`;
        set((s) => ({ toasts: [...s.toasts, { ...t, id, createdAt: Date.now() }] }));
        if (t.autoCloseMs) {
            setTimeout(() => {
                set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) }));
            }, t.autoCloseMs);
        }
    },
    remove: (id) => set((s) => ({ toasts: s.toasts.filter((x) => x.id !== id) })),
}));

export function useGlobalToaster() {
    const { add } = useToasterStore();
    return {
        addSuccess: (title: string, description?: string) =>
            add({ level: 'success', title, description, autoCloseMs: 3000 }),
        addError: (title: string, description?: string) =>
            add({ level: 'error', title, description }),
        addInfo: (title: string, description?: string) =>
            add({ level: 'info', title, description, autoCloseMs: 5000 }),
    };
}
