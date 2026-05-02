import React, { useState, useEffect, useRef } from 'react';
import { NodeProps } from 'reactflow';
import { useRouter } from 'next/navigation';
import DataTrend from './DataTrend';
import { useNodeLiveData } from '@/hooks/useNodeLiveData';
import { useScadaMode } from '@/contexts/ScadaModeContext';
import { getLatestHistory } from '@/lib/api';

type DataTrendNodeData = {
  tagId?: number;
  spTagId?: number;
  limitBottom?: number;
  limitTop?: number;
  yAxis?: { max: number; min: number };
  xAxis?: { max: number; min: number };
  title: string;
  width?: number;
  height?: number;
  // Legacy/Manual props (sin tagId)
  dataPoints?: number[];
  setPoint?: number;
};

type DataTrendNodeProps = NodeProps<DataTrendNodeData>;

/** Par timestampeado — lo que el trend necesita para mostrar tiempo real */
interface TimedPoint {
  x: string; // ISO timestamp
  y: number;
}

const HISTORY_LENGTH = 50;

export const DataTrendNode: React.FC<DataTrendNodeProps> = ({ data }) => {
  const router = useRouter();

  // 1. Live data con timestamp real del broker MQTT
  const pvData = useNodeLiveData(data.tagId);
  const spData = useNodeLiveData(data.spTagId);

  // 2. Buffer: almacena pares {timestamp, value} — nunca sólo números
  const [history, setHistory] = useState<TimedPoint[]>([]);
  const initialized = useRef(false);

  // 3. Backfill al montar: recupera los últimos N puntos del backend con sus timestamps reales
  useEffect(() => {
    if (initialized.current) return;

    if (data.tagId) {
      getLatestHistory(data.tagId, HISTORY_LENGTH)
        .then(response => {
          // El endpoint devuelve [{x: ISO_timestamp, y: value}, ...]
          const points: TimedPoint[] = response.data.map((p: any) => ({
            x: typeof p.x === 'string' ? p.x : new Date(p.x).toISOString(),
            y: typeof p.y === 'number' ? p.y : Number(p.y),
          }));
          setHistory(points);
          initialized.current = true;
        })
        .catch(err => {
          console.error('[DataTrendNode] Error backfilling trend:', err);
          initialized.current = true;
        });
    } else if (data.dataPoints && data.dataPoints.length > 0) {
      // Modo legado sin tagId: inventa timestamps equiespaciados sólo para este caso
      const now = Date.now();
      const points: TimedPoint[] = data.dataPoints.map((val, i) => ({
        x: new Date(now - (data.dataPoints!.length - i) * 1000).toISOString(),
        y: val,
      }));
      setHistory(points);
      initialized.current = true;
    }
  }, [data.tagId, data.dataPoints]);

  // 4. Actualizar buffer con cada nuevo valor MQTT — usando el timestamp real del mensaje
  useEffect(() => {
    if (pvData.isLive && typeof pvData.value === 'number') {
      const realTimestamp = pvData.timestamp ?? new Date().toISOString();
      setHistory(prev => {
        const next = [...prev, { x: realTimestamp, y: pvData.value as number }];
        return next.length > HISTORY_LENGTH
          ? next.slice(next.length - HISTORY_LENGTH)
          : next;
      });
    }
  }, [pvData.timestamp]); // timestamp como dependencia — dispara aunque el valor no cambie

  // 5. Setpoint (dinámico o estático)
  const resolvedSetPoint = data.spTagId
    ? (typeof spData.value === 'number' ? spData.value : undefined)
    : data.setPoint;

  const { isEditMode } = useScadaMode();

  const handleViewHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.tagId) {
      router.push(`/scada/analysis?preselectedTagId=${data.tagId}`);
    }
  };

  return (
    <div className="z-40 relative group" style={{ pointerEvents: isEditMode ? 'none' : 'auto' }}>
      <DataTrend
        width={data.width}
        height={data.height}
        timedPoints={history}        /* ← puntos con timestamp real */
        setPoint={resolvedSetPoint}
        limitBottom={data.limitBottom}
        limitTop={data.limitTop}
        yAxis={data.yAxis ?? (
          data.limitBottom !== undefined || data.limitTop !== undefined
            ? { min: data.limitBottom ?? 0, max: data.limitTop ?? 100 }
            : undefined
        )}
        title={data.title}
      />
      {!isEditMode && data.tagId && (
        <button
          onClick={handleViewHistory}
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600 text-white text-[10px] px-2 py-1 rounded shadow-md hover:bg-blue-500"
          title="Ver Historial Completo"
        >
          📜 Historial
        </button>
      )}
    </div>
  );
};
