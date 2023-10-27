import { create } from 'zustand';
import { type Alarm } from './types';

interface State {
  alarms: Alarm;
  fetchAlarms: () => void;
}

export const useAlarmsStore = create<State>((set, get) => {
  return {
    alarms: { alarm_1: 'Medium', alarm_2: 'Medium', alarm_3: 'Medium' },
    fetchAlarms: async () => {
      set({
        alarms: { alarm_1: 'Low', alarm_2: 'Low', alarm_3: 'Low' },
      });
    },
  };
});
