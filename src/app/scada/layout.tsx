import React from 'react';
import { Providers } from '../providers';
import ScadaAuthWrapper from './ScadaAuthWrapper';
import ScadaNavbar from './ScadaNavbar';

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
      <Providers>
        <ScadaAuthWrapper>
          <div className="flex min-h-screen flex-col">
            {/* NAVBAR con Logout */}
            <ScadaNavbar />

            {/* CONTENIDO DINÁMICO */}
            <main className="flex-1  p-4">{children}</main>
          </div>
        </ScadaAuthWrapper>
      </Providers>
    </div>
  );
}
