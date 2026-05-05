import React from 'react';
import { NodeProps } from 'reactflow';
import { Alarm } from './Alarm';
import { useAlarmStore } from '@/app/store/alarmStore';

type AlarmNodeData = {
  tagId?: number;
  isActive?: boolean;
  type?: 'LOW' | 'HIGH' | 'MEDIUM' | 'URGENT';
  message?: string;
  size?: number;
};

type AlarmNodeProps = NodeProps<AlarmNodeData>;

export const AlarmNode: React.FC<AlarmNodeProps> = ({ data }) => {
  const isAlarmActive = useAlarmStore((state) =>
    data.tagId !== undefined
      ? !!state.activeAlarms[String(data.tagId)]
      : (data.isActive ?? false)
  );

  const liveSeverity = useAlarmStore((state) => {
    if (data.tagId === undefined) return undefined;
    const alarm = state.activeAlarms[String(data.tagId)];
    if (!alarm) return undefined;
    switch (String(alarm.severity)) {
      case '1': return 'LOW';
      case '2': return 'HIGH';
      case '3': return 'URGENT';
      default: return 'MEDIUM';
    }
  });

  const alarmType = liveSeverity ?? data.type ?? 'LOW';
  const message = data.message ?? '';
  const size = data.size ?? 20;

  return (
    <Alarm
      isActive={isAlarmActive}
      type={alarmType}
      message={message}
      size={size}
    />
  );
};
