// src/app/components/SmallDataTrend/SmallDataTrendNode.tsx
import React, { useState, useEffect, useRef } from 'react';
import { SmallDataTrend, smallLineChart } from './SmallDataTrend';
import { NodeProps } from 'reactflow';
import { useNodeLiveData } from '@/hooks/useNodeLiveData';
import { useScadaMode } from '@/contexts/ScadaModeContext';
import { getLatestHistory } from '@/lib/api';

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
    console.log(`[SmallDataTrend Debug] Mount. Tag: ${data.tagId}, Init: ${initialized.current}, Len: ${data.data?.length}`);

    // Priority 1: Backfilling (Check Tag ID FIRST)
    if (!initialized.current && data.tagId) {
      // Backfilling
      console.log(`[SmallDataTrend] Backfilling for Tag ${data.tagId}...`);
      getLatestHistory(data.tagId!, HISTORY_LENGTH)
        .then(response => {
          console.log(`[SmallDataTrend] Received ${response.data.length} points for Tag ${data.tagId}`);
          const points = response.data.map(p => p.y);
          setHistory(points);
          initialized.current = true;
        })
        .catch(err => console.error("Error backfilling small trend:", err));
    }
    // Priority 2: Manual Data
    else if (!initialized.current && data.data && data.data.length > 0) {
      setHistory(data.data);
      initialized.current = true;
    }
  }, [data.data, data.tagId]);

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
  let bandMin = data.min;
  let bandMax = data.max;

  const currentSP = data.spTagId ? (typeof spValue === 'number' ? spValue : undefined) : undefined;

  if (currentSP !== undefined && data.deadband !== undefined) {
    bandMin = currentSP - data.deadband;
    bandMax = currentSP + data.deadband;
  }

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
