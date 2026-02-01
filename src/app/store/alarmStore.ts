import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface ActiveAlarm {
    id: string; // "tag_id"
    tagId: number;
    severity: 1 | 2 | 3;
    message: string;
    timestamp: string;
    ack?: boolean;
}

interface AlarmStore {
    activeAlarms: Record<string, ActiveAlarm>;

    addAlarm: (alarm: ActiveAlarm) => void;
    removeAlarm: (alarmId: string) => void;
    clearAlarms: () => void;

    // Actions
    acknowledgeAlarm: (alarmId: string) => void;
    removeAlarmByTag: (tagId: number) => void;
}

export const useAlarmStore = create<AlarmStore>()(
    devtools(
        (set) => ({
            activeAlarms: {},

            addAlarm: (alarm) =>
                set((state) => {
                    return {
                        activeAlarms: {
                            ...state.activeAlarms,
                            [alarm.id]: alarm, // Upsert
                        },
                    };
                }, false, 'addAlarm'),

            removeAlarm: (alarmId) =>
                set((state) => {
                    const { [alarmId]: _, ...rest } = state.activeAlarms;
                    return { activeAlarms: rest };
                }, false, 'removeAlarm'),

            removeAlarmByTag: (tagId) =>
                set((state) => {
                    const id = String(tagId);
                    const { [id]: _, ...rest } = state.activeAlarms;
                    return { activeAlarms: rest };
                }, false, 'removeAlarmByTag'),

            clearAlarms: () =>
                set({ activeAlarms: {} }, false, 'clearAlarms'),

            acknowledgeAlarm: (alarmId) =>
                set((state) => {
                    const alarm = state.activeAlarms[alarmId];
                    if (!alarm) return state;
                    return {
                        activeAlarms: {
                            ...state.activeAlarms,
                            [alarmId]: { ...alarm, ack: true }
                        }
                    };
                }, false, 'acknowledgeAlarm'),
        }),
        { name: 'AlarmStore' }
    )
);
