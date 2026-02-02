// src/app/components/SmallDataTrend/SmallDataTrendNode.tsx
import React, { useState, useEffect, useRef } from 'react';
import { SmallDataTrend, smallLineChart } from './SmallDataTrend';
import { NodeProps } from 'reactflow';
import { useNodeLiveData } from '@/hooks/useNodeLiveData';
import { useScadaMode } from '@/contexts/ScadaModeContext';

// Extend the type to include new props
type SmallDataTrendNodeData = smallLineChart & {
  tagId?: number;
  spTagId?: number;
  deadband?: number;
};

type SmallDataTrendNodeProps = NodeProps<SmallDataTrendNodeData>;

const HISTORY_LENGTH = 50;

export const SmallDataTrendNode: React.FC<SmallDataTrendNodeProps> = ({ data }) => {
  // 1. Hook for live PV
  const { value: liveValue } = useNodeLiveData(data.tagId);
  const { value: spValue } = useNodeLiveData(data.spTagId);
  const { isEditMode } = useScadaMode();

  // Buffer
  const [history, setHistory] = useState<number[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && data.data && data.data.length > 0) {
      setHistory(data.data);
      initialized.current = true;
    }
  }, [data.data]);

  useEffect(() => {
    if (typeof liveValue === 'number') {
      setHistory((prev) => {
        const newHistory = [...prev, liveValue];
        if (newHistory.length > HISTORY_LENGTH) {
          return newHistory.slice(newHistory.length - HISTORY_LENGTH);
        }
        return newHistory;
      });
    }
  }, [liveValue]);

  // Calculate Band
  // If spTagId -> use spValue. Else no SP? User prompt implies SP is key for band.
  // We need an SP to calculate band. If no SP, maybe just use manual min/max if provided?
  // User said: "Calcular min = spValue - deadband. Calcular max = spValue + deadband."

  let bandMin = data.min;
  let bandMax = data.max;

  const currentSP = data.spTagId ? (typeof spValue === 'number' ? spValue : undefined) : undefined;

  if (currentSP !== undefined && data.deadband !== undefined) {
    bandMin = currentSP - data.deadband;
    bandMax = currentSP + data.deadband;
  }

  // If no dynamic band, fall back to props min/max (legacy)

  return (
    <div style={{ pointerEvents: isEditMode ? 'none' : 'auto' }}>
      <SmallDataTrend
        data={history}
        height={data.height}
        width={data.width}
        min={bandMin}
        max={bandMax}
      />
    </div>
  );
};
