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

// Orden de severidad para cada tipo visual de alarma.
// Se usa para garantizar que nunca mostremos un color MENOS grave
// que el configurado en el editor, incluso si el backend envía
// una severidad menor en el payload MQTT.
const SEVERITY_RANK: Record<string, number> = {
  LOW:    1,
  MEDIUM: 2,
  HIGH:   3,
  URGENT: 4,
};
const RANK_TO_TYPE: Record<number, 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'> = {
  1: 'LOW',
  2: 'MEDIUM',
  3: 'HIGH',
  4: 'URGENT',
};

/**
 * Mapea la severidad numérica del alarmStore al tipo visual del Alarm.
 * El alarmStore usa: 1 = LOW, 2 = WARNING(HIGH), 3 = CRITICAL(URGENT)
 */
function severityToType(severity: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' {
  switch (severity) {
    case 3: return 'URGENT';
    case 2: return 'HIGH';
    case 1: return 'LOW';
    default: return 'MEDIUM';
  }
}

export const AlarmNode: React.FC<AlarmNodeProps> = ({ data }) => {
  const isAlarmActive = useAlarmStore((state) =>
    data.tagId !== undefined
      ? !!state.activeAlarms[String(data.tagId)]
      : (data.isActive ?? false)
  );

  /**
   * Tipo visual efectivo cuando la alarma está activa.
   *
   * Regla: usar el MÁS GRAVE entre el tipo configurado en el editor (data.type)
   * y el tipo derivado de la severidad en tiempo real (liveSeverity del store).
   *
   * Esto garantiza que si el operador configuró el nodo como LOW (morado)
   * para una variable crítica, el color nunca se degradará a HIGH (naranja)
   * aunque el backend publique severity=2 (WARNING) vía MQTT.
   */
  const effectiveType = useAlarmStore((state) => {
    if (data.tagId === undefined) return data.type ?? 'LOW';

    const alarm = state.activeAlarms[String(data.tagId)];
    if (!alarm) return data.type ?? 'LOW';

    const liveType    = severityToType(alarm.severity);
    const configType  = data.type ?? 'LOW';

    const liveRank    = SEVERITY_RANK[liveType]   ?? 1;
    const configRank  = SEVERITY_RANK[configType] ?? 1;

    // Mostramos el peor (más severo) de los dos
    return RANK_TO_TYPE[Math.max(liveRank, configRank)];
  });

  const alarmType = isAlarmActive ? effectiveType : (data.type ?? 'LOW');
  const message   = data.message ?? '';
  const size      = data.size ?? 20;

  return (
    <Alarm
      isActive={isAlarmActive}
      type={alarmType}
      message={message}
      size={size}
    />
  );
};
