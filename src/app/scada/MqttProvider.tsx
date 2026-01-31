'use client';

/**
 * MqttProvider - Client component that establishes MQTT connection
 * 
 * Wraps children and maintains the MQTT connection for real-time tag updates.
 */
import { ReactNode } from 'react';
import { useMqttSystem } from '@/hooks/useMqttSystem';

interface MqttProviderProps {
    children: ReactNode;
}

export function MqttProvider({ children }: MqttProviderProps) {
    // Initialize MQTT connection
    useMqttSystem();

    return <>{children}</>;
}

export default MqttProvider;
