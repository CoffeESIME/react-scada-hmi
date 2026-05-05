import React, { memo } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { MotorIcon } from './MotorOne';
import { useNodeLiveData } from '@/hooks/useNodeLiveData';

type HandleEl = {
  type: 'source' | 'target';
  position: Position;
  id: string;
  style?: React.CSSProperties;
};

type MotorState = 'On' | 'Off' | 'Transition';

type MotorNodeData = {
  tagId?: number;
  handles?: HandleEl[];
  state?: MotorState;
  size?: number;
};

type MotorNodeProps = NodeProps<MotorNodeData>;

function parseMotorState(value: any, fallback: MotorState): MotorState {
  if (value === undefined || value === null) return fallback;

  if (typeof value === 'boolean') {
    return value ? 'On' : 'Off';
  }
  if (typeof value === 'number') {
    if (value === 0) return 'Off';
    if (value === 1) return 'On';
    if (value === 2) return 'Transition';
    return value > 0 ? 'On' : 'Off';
  }

  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    if (lower === 'on' || lower === '1' || lower === 'true' || lower === 'running') return 'On';
    if (lower === 'off' || lower === '0' || lower === 'false' || lower === 'stopped') return 'Off';
    if (lower === 'transition' || lower === 'starting' || lower === 'stopping') return 'Transition';
  }

  return fallback;
}

const MotorNode: React.FC<MotorNodeProps> = ({ data }) => {
  const handles = data?.handles ?? [];
  const size = data?.size ?? 80;
  const fallbackState = data?.state ?? 'Off';
  const { value: liveValue } = useNodeLiveData(data?.tagId, undefined);
  const state = parseMotorState(liveValue, fallbackState);

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
