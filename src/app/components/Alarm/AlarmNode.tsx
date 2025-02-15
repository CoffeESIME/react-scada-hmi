import React from 'react';
import { NodeProps } from 'reactflow';
import { Alarm } from './Alarm';

type AlarmNodeData = {
  isActive?: boolean;
  type?: 'LOW' | 'HIGH' | 'MEDIUM' | 'URGENT';
  message?: string;
  size?: number;
};

type AlarmNodeProps = NodeProps<AlarmNodeData>;

export const AlarmNode: React.FC<AlarmNodeProps> = ({ data }) => {
  const isActive = data?.isActive ?? false;
  const alarmType = data?.type ?? 'LOW';
  const message = data?.message ?? '';
  const size = data?.size ?? 20;

  return (
    <Alarm
      isActive={isActive}
      type={alarmType}
      message={message}
      size={size}
    />
  );
};
