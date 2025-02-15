// src/app/components/SmallDataTrend/SmallDataTrendNode.tsx
import React from 'react';
import { SmallDataTrend, smallLineChart } from './SmallDataTrend';
import { NodeProps } from 'reactflow';

// Re-definimos el tipo que usa React Flow para tu nodo
type SmallDataTrendNodeProps = NodeProps & {
  data: smallLineChart; // data vendrá con data, height, width, etc.
};

export const SmallDataTrendNode: React.FC<SmallDataTrendNodeProps> = ({ data }) => {
  return (
    <SmallDataTrend
      data={data.data}
      height={data.height}
      width={data.width}
      min={data.min}
      max={data.max}
    />
  );
};
