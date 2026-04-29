import React from 'react';
import { Providers } from '../providers';
import ScadaAuthWrapper from './ScadaAuthWrapper';
import ScadaNavbar from './ScadaNavbar';
import MqttProvider from './MqttProvider';
import GlobalToaster from '@/app/components/GlobalToaster';

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
          <MqttProvider>
            <div className="flex min-h-screen flex-col">
              {/* NAVBAR con Logout */}
              <ScadaNavbar />

              {/* CONTENIDO DINÁMICO */}
              <main className="flex-1  p-4">{children}</main>
            </div>
            {/* Notificaciones persistentes globales */}
            <GlobalToaster />
          </MqttProvider>
        </ScadaAuthWrapper>
      </Providers>
    </div>
  );
}
