import { Providers } from '@/app/providers';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Admin Navigation */}
            <nav className="bg-white dark:bg-gray-800 shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-xl">⚙️ Admin SCADA</span>
                        <a href="/admin/tags" className="text-blue-600 hover:underline">
                            Tags
                        </a>
                    </div>
                    <a href="/" className="text-gray-500 hover:text-gray-700">
                        ← Volver al HMI
                    </a>
                </div>
            </nav>

            {/* Content */}
            <main>{children}</main>
        </div>
    );
}
