import React, { memo } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { ValveIcon } from './Valve';
import { ValveIcon1 } from './Valve1';

type HandleConfig = {
  type: 'source' | 'target';
  position: Position;
  id: string;
  style?: React.CSSProperties;
};

type ValveNodeData = {
  valveType?: 'round' | 'rect';
  rotation?: number;
  handles?: HandleConfig[];
  state?: 'Open' | 'Closed' | 'Transition';
  size?: number;
};

type ValveNodeProps = NodeProps<ValveNodeData>;

const ValveNode: React.FC<ValveNodeProps> = ({ data }) => {
  const valveType = data?.valveType ?? 'round';
  const rotation = data?.rotation ?? 0;
  const handles = data?.handles ?? [];
  const state = data?.state ?? 'Closed';
  const size = data?.size ?? 50;

  return (
    <>
      {handles.map((config) => (
        <Handle
          key={config.id}
          type={config.type}
          position={config.position}
          id={config.id}
          style={config.style}
          className="border-0 bg-process-connector"
        />
      ))}
      {valveType === 'round' ? (
        <ValveIcon state={state} size={size} rotation={rotation} />
      ) : (
        <ValveIcon1 state={state} size={size - 5} />
      )}
    </>
  );
};

export default memo(ValveNode);
