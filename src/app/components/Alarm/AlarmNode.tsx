import React from 'react';
import { NodeProps } from 'reactflow';
import { Alarm } from './Alarm';
import { useAlarmStore } from '@/app/store/alarmStore';

type AlarmNodeData = {
  /**
   * Tag ID al que está vinculado este indicador.
   * Si se define, el estado activo/inactivo se lee desde el alarmStore (live).
   * Si no se define, se usa isActive como valor estático (modo legado).
   */
  tagId?: number;
  /** Fallback estático — solo se usa si tagId NO está definido */
  isActive?: boolean;
  type?: 'LOW' | 'HIGH' | 'MEDIUM' | 'URGENT';
  message?: string;
  size?: number;
};

type AlarmNodeProps = NodeProps<AlarmNodeData>;

export const AlarmNode: React.FC<AlarmNodeProps> = ({ data }) => {
  // Leer estado live desde el alarmStore si hay tagId configurado
  const isAlarmActive = useAlarmStore((state) =>
    data.tagId !== undefined
      ? !!state.activeAlarms[String(data.tagId)]
      : (data.isActive ?? false)
  );

  // Determinar el tipo de alarma dinámicamente si hay tagId
  const liveSeverity = useAlarmStore((state) => {
    if (data.tagId === undefined) return undefined;
    const alarm = state.activeAlarms[String(data.tagId)];
    if (!alarm) return undefined;
    // El backend publica severity como número: 1=WARNING, 2=CRITICAL, 3=URGENT
    switch (String(alarm.severity)) {
      case '1': return 'LOW';
      case '2': return 'HIGH';
      case '3': return 'URGENT';
      default:  return 'MEDIUM';
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
