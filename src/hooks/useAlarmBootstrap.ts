'use client';
import { useEffect, useRef } from 'react';
import { useAlarmStore } from '@/app/store/alarmStore';
import { getActiveAlarms } from '@/lib/api';

function parseSeverity(severity: string): 1 | 2 | 3 {
    switch (severity.toUpperCase()) {
        case 'CRITICAL':
        case '3': return 3;
        case 'WARNING':
        case '2': return 2;
        default:  return 1;
    }
}

export function useAlarmBootstrap() {
    const addAlarm = useAlarmStore((state) => state.addAlarm);
    const clearAlarms = useAlarmStore((state) => state.clearAlarms);
    const bootstrapped = useRef(false);

    useEffect(() => {
        if (bootstrapped.current) return;
        bootstrapped.current = true;

        const run = async () => {
            try {
                const activeAlarms = await getActiveAlarms();

                if (activeAlarms.length === 0) {
                    clearAlarms();
                    console.log('[AlarmBootstrap] Sin alarmas activas. Store limpiado.');
                    return;
                }

                for (const alarm of activeAlarms) {
                    addAlarm({
                        id: alarm.alarm_id,
                        tagId: alarm.tag_id,
                        severity: parseSeverity(alarm.severity),
                        message: alarm.message,
                        timestamp: alarm.start_time ?? new Date().toISOString(),
                        ack: false,
                    });
                }

                console.log(
                    `[AlarmBootstrap] ✅ ${activeAlarms.length} alarma(s) activa(s) cargadas en el store.`,
                    activeAlarms.map(a => `tag_id=${a.tag_id} severity=${a.severity}`)
                );
            } catch (err) {
                console.warn('[AlarmBootstrap] No se pudo cargar el estado inicial de alarmas:', err);
            }
        };

        run();
    }, []);
}

export default useAlarmBootstrap;
