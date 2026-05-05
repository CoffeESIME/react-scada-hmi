import React, { useState, useEffect, useRef } from 'react';
import { SmallDataTrend, smallLineChart } from './SmallDataTrend';
import { NodeProps } from 'reactflow';
import { useNodeLiveData } from '@/hooks/useNodeLiveData';
import { useScadaMode } from '@/contexts/ScadaModeContext';
import { getLatestHistory } from '@/lib/api';

type SmallDataTrendNodeData = smallLineChart & {
  tagId?: number;
  spTagId?: number;
  deadband?: number;
};

type SmallDataTrendNodeProps = NodeProps<SmallDataTrendNodeData>;

const HISTORY_LENGTH = 50;

export const SmallDataTrendNode: React.FC<SmallDataTrendNodeProps> = ({ data }) => {
  const { value: liveValue } = useNodeLiveData(data.tagId);
  const { value: spValue } = useNodeLiveData(data.spTagId);
  const { isEditMode } = useScadaMode();
  const [history, setHistory] = useState<number[]>([]);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && data.tagId) {
      getLatestHistory(data.tagId!, HISTORY_LENGTH)
        .then(response => {
          const points = response.data.map(p => p.y);
          setHistory(points);
          initialized.current = true;
        })
        .catch(err => console.error("Error backfilling small trend:", err));
    }
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
