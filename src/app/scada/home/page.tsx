'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from '@nextui-org/react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface ScreenData {
    id: number;
    name: string;
    slug: string;
}

/**
 * Página principal SCADA - redirige a la pantalla marcada como home
 * o muestra opciones para crear/seleccionar una pantalla.
 */
export default function ScadaHomePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [hasNoHome, setHasNoHome] = useState(false);

    useEffect(() => {
        const loadHome = async () => {
            try {
                const response = await api.get<ScreenData>('/screens/home');
                // Redirigir a la pantalla home
                router.replace(`/scada/view/${response.data.id}`);
            } catch (error: any) {
                if (error.response?.status === 404) {
                    // No hay home configurada
                    setHasNoHome(true);
                } else {
                    toast.error('Error al cargar pantalla principal');
                }
                setIsLoading(false);
            }
        };

        loadHome();
    }, [router]);

    if (isLoading && !hasNoHome) {
        return (
            <div className="min-h-screen bg-admin-bg flex items-center justify-center">
                <div className="text-center">
                    <Spinner size="lg" color="primary" />
                    <p className="text-admin-text mt-4">Cargando pantalla principal...</p>
                </div>
            </div>
        );
    }

    // No hay home configurada
    return (
        <div className="min-h-screen bg-admin-bg flex items-center justify-center">
            <div className="text-center bg-admin-surface p-8 rounded-lg border border-admin-border max-w-md">
                <div className="text-5xl mb-4">🖥️</div>
                <h1 className="text-2xl font-bold text-admin-text mb-2">
                    Sin Pantalla Principal
                </h1>
                <p className="text-gray-400 mb-6">
                    No hay una pantalla configurada como principal.
                    Crea una nueva o selecciona una existente.
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={() => router.push('/scada/create')}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
                    >
                        + Crear Pantalla
                    </button>
                    <button
                        onClick={() => router.push('/scada/organize')}
                        className="px-6 py-2 bg-admin-border text-admin-text rounded-lg hover:bg-admin-border/80 transition"
                    >
                        📋 Ver Pantallas
                    </button>
                </div>
            </div>
        </div>
    );
}
