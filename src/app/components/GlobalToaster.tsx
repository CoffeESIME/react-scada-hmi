'use client';

import { useToasterStore, ToastItem } from '@/hooks/useGlobalToaster';

const levelStyles: Record<ToastItem['level'], string> = {
    success: 'border-green-500/50 bg-green-900/30 text-green-200',
    error:   'border-red-500/50   bg-red-900/30   text-red-200',
    info:    'border-blue-500/50  bg-blue-900/30  text-blue-200',
};

const levelIcon: Record<ToastItem['level'], string> = {
    success: '✅',
    error:   '❌',
    info:    'ℹ️',
};

export default function GlobalToaster() {
    const { toasts, remove } = useToasterStore();

    if (toasts.length === 0) return null;

    return (
        <div
            className="fixed bottom-4 right-4 z-[9999] flex flex-col-reverse gap-2 max-w-sm w-full pointer-events-none"
            aria-live="polite"
        >
            {toasts.map((t) => (
                <div
                    key={t.id}
                    className={`
                        pointer-events-auto flex items-start gap-3 px-4 py-3
                        rounded-xl border backdrop-blur-sm shadow-xl
                        animate-in slide-in-from-right-4 fade-in-0 duration-300
                        ${levelStyles[t.level]}
                    `}
                >
                    <span className="text-lg flex-shrink-0 mt-0.5">{levelIcon[t.level]}</span>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm leading-snug">{t.title}</p>
                        {t.description && (
                            <p className="text-xs opacity-75 mt-0.5 break-words">{t.description}</p>
                        )}
                        {!t.autoCloseMs && (
                            <p className="text-xs opacity-50 mt-1 italic">Haz clic en ✕ para cerrar</p>
                        )}
                    </div>
                    <button
                        onClick={() => remove(t.id)}
                        className="text-current opacity-60 hover:opacity-100 transition flex-shrink-0 text-lg leading-none"
                        aria-label="Cerrar notificación"
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}
