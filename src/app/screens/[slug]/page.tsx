'use client';

import React from 'react';
import Link from 'next/link';
import AuthGuard from '../../components/AuthGuard';

// Placeholder screen component
export default function ScreenPlaceholder({
    params
}: {
    params: { slug: string }
}): React.ReactElement {
    const screenName = params.slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return (
        <AuthGuard>
            <div className="flex min-h-screen flex-col items-center justify-center bg-slate-900">
                <div className="text-center">
                    <div className="mb-8 text-6xl">🚧</div>
                    <h1 className="mb-4 text-3xl font-bold text-white">{screenName}</h1>
                    <p className="mb-8 text-slate-400">
                        Esta pantalla está en construcción
                    </p>
                    <Link
                        href="/"
                        className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 transition-colors"
                    >
                        ← Volver al Inicio
                    </Link>
                </div>
            </div>
        </AuthGuard>
    );
}
