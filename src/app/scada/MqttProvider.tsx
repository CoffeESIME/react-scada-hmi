'use client';

import { ReactNode } from 'react';
import { useMqttSystem } from '@/hooks/useMqttSystem';
import { useAlarmBootstrap } from '@/hooks/useAlarmBootstrap';

interface MqttProviderProps {
    children: ReactNode;
}

export function MqttProvider({ children }: MqttProviderProps) {
    useMqttSystem();
    useAlarmBootstrap();

    return <>{children}</>;
}

export default MqttProvider;
