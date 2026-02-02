import React, { useState, useEffect, useRef } from 'react';
import { NodeProps } from 'reactflow';
import DataTrend from './DataTrend';
import { useNodeLiveData } from '@/hooks/useNodeLiveData';

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
  // Using useEffect on pvValue might be too fast or irregular. 
  // Ideally we should sample at fixed rate or on change. 
  // For SCADA, on change is often acceptable if rate is controlled, 
  // but for a trend chart, periodic sampling is better for X-axis consistency.
  // However, useNodeLiveData updates on MQTT message.
  // Let's just append on change for now, assuming data comes at ~1s from backend/simulator.
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
  // If spTagId is present, use spValue. Else use static data.setPoint.
  const resolvedSetPoint = data.spTagId ? (typeof spValue === 'number' ? spValue : undefined) : data.setPoint;

  return (
    <div className="z-40">
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
    </div>
  );
};
