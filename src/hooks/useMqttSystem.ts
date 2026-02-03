'use client';

/**
 * useMqttSystem - Global MQTT connection hook for SCADA real-time data
 * 
 * Connects to the MQTT broker via WebSocket and subscribes to tag updates.
 * Updates the tagStore with received values.
 * 
 * Usage: Call this hook once in the SCADA layout to establish connection.
 */
import { useEffect, useRef, useCallback, useState } from 'react';
import { useTagStore, TagValue } from '@/app/store/tagStore';
import { useAlarmStore } from '@/app/store/alarmStore';

// Use dynamic import for MQTT to avoid SSR issues
import type { MqttClient, IClientOptions } from 'mqtt';

const MQTT_URL = process.env.NEXT_PUBLIC_MQTT_WS_URL || 'ws://192.168.0.188:9001';
const RECONNECT_DELAY_BASE = 1000; // 1 second
const RECONNECT_DELAY_MAX = 30000; // 30 seconds
const TAG_TOPIC = 'scada/tags/#';
const ALARM_TOPIC = 'scada/alarms/#';

interface MqttMessage {
    tagId?: number;
    tag_id?: number;  // Alternative key
    value: any;
    quality?: 'GOOD' | 'BAD' | 'UNCERTAIN';
    timestamp?: string;
}

export function useMqttSystem() {
    const clientRef = useRef<MqttClient | null>(null);
    const reconnectAttemptRef = useRef(0);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const updateTag = useTagStore((state) => state.updateTag);
    const addAlarm = useAlarmStore((state) => state.addAlarm);
    const removeAlarmByTag = useAlarmStore((state) => state.removeAlarmByTag);

    // Parse incoming MQTT message
    const parseMessage = useCallback((topic: string, payload: Buffer): void => {
        try {
            const message = payload.toString();

            // Log solo cada 5 segundos para no saturar (usa throttle básico)
            const now = Date.now();
            const lastLog = (window as any).__lastMqttLog || 0;
            const shouldLog = now - lastLog > 5000;
            if (shouldLog) {
                console.log(`[MQTT] 📩 Topic: ${topic} | Sample value: ${message.substring(0, 100)}`);
                (window as any).__lastMqttLog = now;
            }

            // Check for alarms
            if (topic.startsWith('scada/alarms/')) {
                try {
                    const alarmData = JSON.parse(message);
                    const tagId = parseInt(alarmData.alarm_id, 10);

                    if (['RESOLVED', 'NORMAL', 'CLEARED'].includes(alarmData.status)) {
                        removeAlarmByTag(tagId);
                    } else {
                        addAlarm({
                            id: alarmData.alarm_id,
                            tagId: tagId,
                            severity: alarmData.severity,
                            message: alarmData.message,
                            timestamp: alarmData.timestamp,
                            ack: false
                        });
                    }
                } catch (e) {
                    console.error('[MQTT] Error parsing alarm:', e);
                }
                return;
            }

            // Try JSON parse first
            try {
                const data: MqttMessage = JSON.parse(message);
                const tagId = data.tagId ?? data.tag_id;

                if (tagId !== undefined) {
                    const tagValue: TagValue = {
                        value: data.value,
                        quality: data.quality || 'GOOD',
                        timestamp: data.timestamp || new Date().toISOString(),
                    };
                    updateTag(tagId, tagValue);

                    // Log cuando el tag 12 (Modbus) se actualiza
                    if (tagId === 12) {
                        console.log(`[MQTT] ✅ Tag 12 (Modbus) actualizado: ${data.value}`);
                    }
                } else {
                    console.warn(`[MQTT] ⚠️ Mensaje sin tagId:`, data);
                }
            } catch {
                // Not JSON - try to extract tagId from topic
                const parts = topic.split('/');
                const tagIdentifier = parts[parts.length - 1];
                const tagIdFromTopic = parseInt(tagIdentifier, 10);

                if (!isNaN(tagIdFromTopic)) {
                    const value = parseFloat(message) || message;
                    const tagValue: TagValue = {
                        value,
                        quality: 'GOOD',
                        timestamp: new Date().toISOString(),
                    };
                    updateTag(tagIdFromTopic, tagValue);
                }
            }
        } catch (error) {
            console.error('[MQTT] Error parsing message:', error);
        }
    }, [updateTag, addAlarm, removeAlarmByTag]);

    // Schedule reconnection with exponential backoff
    const scheduleReconnect = useCallback((connectFn: () => void) => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }

        const delay = Math.min(
            RECONNECT_DELAY_BASE * Math.pow(2, reconnectAttemptRef.current),
            RECONNECT_DELAY_MAX
        );

        console.log(`[MQTT] Scheduling reconnect in ${delay}ms (attempt ${reconnectAttemptRef.current + 1})`);

        reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptRef.current++;
            connectFn();
        }, delay);
    }, []);

    // Connect to MQTT broker
    const connect = useCallback(async () => {
        if (clientRef.current?.connected) {
            return;
        }

        // Dynamic import of mqtt for browser environment
        const mqtt = await import('mqtt');

        console.log(`[MQTT] Connecting to ${MQTT_URL}...`);

        const options: IClientOptions = {
            protocol: 'ws',
            reconnectPeriod: 0, // We handle reconnection manually
            connectTimeout: 10000,
            clientId: `scada-hmi-${Math.random().toString(16).slice(2, 10)}`,
        };

        const client = mqtt.connect(MQTT_URL, options);

        client.on('connect', () => {
            console.log('[MQTT] Connected to broker');
            reconnectAttemptRef.current = 0;
            setIsConnected(true);

            // Subscribe to tag updates
            const topics = [TAG_TOPIC, ALARM_TOPIC];
            client.subscribe(topics, { qos: 0 }, (err) => {
                if (err) {
                    console.error('[MQTT] Subscribe error:', err);
                } else {
                    console.log(`[MQTT] Subscribed to ${topics.join(', ')}`);
                }
            });
        });

        client.on('message', (topic, payload) => {
            parseMessage(topic, payload);
        });

        client.on('error', (error) => {
            console.error('[MQTT] Connection error:', error);
        });

        client.on('close', () => {
            console.log('[MQTT] Connection closed');
            setIsConnected(false);
            scheduleReconnect(() => connect());
        });

        client.on('offline', () => {
            console.log('[MQTT] Client offline');
            setIsConnected(false);
        });

        clientRef.current = client;
    }, [parseMessage, scheduleReconnect]);

    // Disconnect from MQTT broker
    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        if (clientRef.current) {
            clientRef.current.end(true);
            clientRef.current = null;
            setIsConnected(false);
            console.log('[MQTT] Disconnected');
        }
    }, []);

    // Connect on mount, disconnect on unmount
    useEffect(() => {
        connect();

        return () => {
            disconnect();
        };
    }, [connect, disconnect]);

    // Return control functions for manual management if needed
    return {
        connect,
        disconnect,
        isConnected,
    };
}

export default useMqttSystem;

