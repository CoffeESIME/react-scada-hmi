'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';

export default function ScadaNavbar(): React.ReactElement {
    const router = useRouter();
    const { logout, user } = useAuthStore();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <nav className="flex items-center justify-between bg-admin-bg-secondary border-b border-admin-border px-6 py-3">
            {/* Enlaces principales */}
            <div className="flex items-center gap-6">
                <Link
                    href="/scada/create"
                    className="text-admin-text-secondary hover:text-admin-text transition-colors"
                >
                    Editor
                </Link>
                <Link
                    href="/scada/tags"
                    className="text-admin-text-secondary hover:text-admin-text transition-colors"
                >
                    Tags
                </Link>
            </div>

            {/* Usuario y Logout */}
            <div className="flex items-center gap-4">
                {user && (
                    <span className="text-sm text-admin-text-muted">
                        {user.email}
                    </span>
                )}
                <button
                    onClick={handleLogout}
                    className="rounded bg-admin-danger px-3 py-1.5 text-sm text-white hover:bg-red-600 transition-colors"
                >
                    Cerrar Sesión
                </button>
            </div>
        </nav>
    );
}
