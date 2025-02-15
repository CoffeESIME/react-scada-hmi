import React from 'react';
import Link from 'next/link';
import { Providers } from '../providers'; // si quieres usar tus Providers globales

// Si usas NextUI, podrías importar un Navbar de NextUI.
// O podrías usar tu propia barra con Tailwind.

export const metadata = {
  title: 'SCADA Section',
};

export default function ScadaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {/* Si necesitas Providers especiales para la sección SCADA, colócalos aquí. */}
      <Providers>
        <div className="flex min-h-screen flex-col">
          {/* NAVBAR */}
          <nav className="flex items-center gap-4 bg-gray-200 p-4">
            {/* Enlaces principales */}
            <Link href="/scada/create" className="hover:underline">
              Crear
            </Link>
            <Link href="/scada/edit" className="hover:underline">
              Editar
            </Link>
            <Link href="/scada/organize" className="hover:underline">
              Organizar Flujo
            </Link>
            {/* Aquí podrías meter un botón de "Guardar" o un link a otra ruta */}
            <Link href="/scada/settings" className="hover:underline">
              Ajustes
            </Link>
          </nav>

          {/* CONTENIDO DINÁMICO */}
          <main className="flex-1 bg-white p-4">{children}</main>

          {/* FOOTER (Opcional) */}
        </div>
      </Providers>
    </div>
  );
}
