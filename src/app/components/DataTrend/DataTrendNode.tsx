import React, { useState, useEffect, useRef } from 'react';
import { NodeProps } from 'reactflow';
import { useRouter } from 'next/navigation';
import DataTrend from './DataTrend';
import { useNodeLiveData } from '@/hooks/useNodeLiveData';
import { useScadaMode } from '@/contexts/ScadaModeContext';

type DataTrendNodeData = {
  tagId?: number;
  spTagId?: number;
  limitBottom?: number;
  limitTop?: number;
  yAxis?: {
    max: number;
    min: number;
  };
  xAxis?: {
    max: number;
    min: number;
  };
  title: string;
  width?: number;
  height?: number;
  // Legacy/Manual props
  dataPoints?: number[];
  setPoint?: number;
};

type DataTrendNodeProps = NodeProps<DataTrendNodeData>;

const HISTORY_LENGTH = 50;

export const DataTrendNode: React.FC<DataTrendNodeProps> = ({ data }) => {
  const router = useRouter();

  // 1. Live Data Hooks
  const { value: pvValue } = useNodeLiveData(data.tagId);
  const { value: spValue } = useNodeLiveData(data.spTagId);

  // 2. History Buffer
  const [history, setHistory] = useState<number[]>([]);
  // Store initial run or manual data if provided
  const initialized = useRef(false);

  useEffect(() => {
    // If we have manual dataPoints and haven't initialized, use them
    if (!initialized.current && data.dataPoints && data.dataPoints.length > 0) {
      setHistory(data.dataPoints);
      initialized.current = true;
    }
  }, [data.dataPoints]);

  // 3. Update Buffer on PV change (or interval?)
  useEffect(() => {
    if (typeof pvValue === 'number') {
      setHistory(prev => {
        const newHistory = [...prev, pvValue];
        if (newHistory.length > HISTORY_LENGTH) {
          return newHistory.slice(newHistory.length - HISTORY_LENGTH);
        }
        return newHistory;
      });
    }
  }, [pvValue]);

  // 4. Resolve Setpoint (Dynamic or Static)
  const resolvedSetPoint = data.spTagId ? (typeof spValue === 'number' ? spValue : undefined) : data.setPoint;

  // 5. Check Edit Mode
  const { isEditMode } = useScadaMode();

  const handleViewHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.tagId) {
      // Use query param for pre-selection
      router.push(`/scada/analysis?preselectedTagId=${data.tagId}`);
    }
  };

  return (
    <div className="z-40 relative group" style={{ pointerEvents: isEditMode ? 'none' : 'auto' }}>
      <DataTrend
        width={data.width}
        height={data.height}
        dataPoints={history}
        setPoint={resolvedSetPoint}
        limitBottom={data.limitBottom}
        limitTop={data.limitTop}
        yAxis={data.yAxis}
        title={data.title}
      />
      {/* History Button (Only visible in View Mode and on Hover) */}
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
