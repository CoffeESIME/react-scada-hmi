import { Node, NodeProps } from 'reactflow';
import DataTrend from './DataTrend';
import React from 'react';

type DataTrendNodeData = {
  dataPoints: number[];
  yAxis?: {
    max: number;
    min: number;
  };
  setPoint: number;
  limitBottom: number;
  limitTop: number;
  xAxis?: {
    max: number;
    min: number;
  };
  title: string;
  width?: number;
  height?: number;
};

type DataTrendNodeProps = NodeProps & {
  data: DataTrendNodeData;
};
//this should take in account that an alarm should appear in the app as an icon or similar

export const DataTrendNode: React.FC<DataTrendNodeProps> = ({ data }) => {
  return (
    <div className="z-40">
      <DataTrend
        width={data.width}
        height={data.height}
      />
    </div>
  );
};
