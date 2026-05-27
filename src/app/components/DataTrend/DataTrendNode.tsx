import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  dataPoints?: number[];
  setPoint?: number;
};

type DataTrendNodeProps = NodeProps<DataTrendNodeData>;

interface TimedPoint {
  x: string;
  y: number;
}

const HISTORY_LENGTH = 50;

export const DataTrendNode: React.FC<DataTrendNodeProps> = ({ data }) => {
  const router = useRouter();

  const pvData = useNodeLiveData(data.tagId);
  const spData = useNodeLiveData(data.spTagId);

  const [history, setHistory] = useState<TimedPoint[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    if (data.tagId) {
      getLatestHistory(data.tagId, HISTORY_LENGTH)
        .then(response => {
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
      const now = Date.now();
      const points: TimedPoint[] = data.dataPoints.map((val, i) => ({
        x: new Date(now - (data.dataPoints!.length - i) * 1000).toISOString(),
        y: val,
      }));
      setHistory(points);
      initialized.current = true;
    }
  }, [data.tagId, data.dataPoints]);

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
  }, [pvData.timestamp]);

  const resolvedSetPoint = data.spTagId
    ? (typeof spData.value === 'number' ? spData.value : undefined)
    : data.setPoint;

  const resolvedYAxis = useMemo(() => {
    if (data.yAxis) return data.yAxis;
    if (data.limitBottom !== undefined || data.limitTop !== undefined) {
      return { min: data.limitBottom ?? 0, max: data.limitTop ?? 100 };
    }
    return undefined;
  }, [data.yAxis, data.limitBottom, data.limitTop]);

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
        timedPoints={history}
        setPoint={resolvedSetPoint}
        limitBottom={data.limitBottom}
        limitTop={data.limitTop}
        yAxis={resolvedYAxis}
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
