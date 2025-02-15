import React, { memo } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { MotorIcon } from './MotorOne';

type HandleEl = {
  type: 'source' | 'target';
  position: Position;
  id: string;
  style?: React.CSSProperties;
};

type MotorNodeData = {
  handles?: HandleEl[];
  state?: 'On' | 'Off' | 'Transition';
  size?: number;
};

type MotorNodeProps = NodeProps<MotorNodeData>;

const MotorNode: React.FC<MotorNodeProps> = ({ data }) => {
  // Usamos valores por defecto para no romper si `data` es parcial
  const handles = data?.handles ?? [];
  const state = data?.state ?? 'Off';
  const size = data?.size ?? 80;

  return (
    <>
      {handles.map((handle) => (
        <Handle
          key={handle.id}
          position={handle.position}
          type={handle.type}
          id={handle.id}
          style={handle.style}
          className="border-0 bg-process-connector"
        />
      ))}

      <MotorIcon size={size} state={state} />
    </>
  );
};

export default memo(MotorNode);
