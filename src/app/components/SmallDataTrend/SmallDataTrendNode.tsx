import React from 'react';
import { SmallDataTrend, smallLineChart } from './SmallDataTrend';
import { NodeProps } from 'reactflow';

type SmallDataTrendNode = NodeProps & {
  data: smallLineChart;
};

export const SmallDataTrendNode: React.FC<SmallDataTrendNode> = ({ data }) => {
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
