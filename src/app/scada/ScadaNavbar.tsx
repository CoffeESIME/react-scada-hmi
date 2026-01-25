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
        <nav className="flex items-center justify-between bg-gray-200 p-4">
            {/* Enlaces principales */}
            <div className="flex items-center gap-4">
                <Link href="/scada/create" className="hover:underline">
                    Crear
                </Link>
                <Link href="/scada/edit" className="hover:underline">
                    Editar
                </Link>
                <Link href="/scada/organize" className="hover:underline">
                    Organizar Flujo
                </Link>
                <Link href="/scada/settings" className="hover:underline">
                    Ajustes
                </Link>
            </div>

            {/* Usuario y Logout */}
            <div className="flex items-center gap-4">
                {user && (
                    <span className="text-sm text-gray-600">
                        {user.email}
                    </span>
                )}
                <button
                    onClick={handleLogout}
                    className="rounded bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600 transition-colors"
                >
                    Cerrar Sesión
                </button>
            </div>
        </nav>
    );
}
