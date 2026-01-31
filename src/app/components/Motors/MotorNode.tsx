import React, { memo } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { MotorIcon } from './MotorOne';
import { useTagValue } from '@/app/store/tagStore';

type HandleEl = {
  type: 'source' | 'target';
  position: Position;
  id: string;
  style?: React.CSSProperties;
};

type MotorState = 'On' | 'Off' | 'Transition';

type MotorNodeData = {
  /** Tag ID for live data binding */
  tagId?: number;
  handles?: HandleEl[];
  /** Static state - used as fallback if tagId is not set */
  state?: MotorState;
  size?: number;
};

type MotorNodeProps = NodeProps<MotorNodeData>;

/**
 * Converts a tag value to a motor state
 * Handles: boolean, number (0/1), string ("On"/"Off"/"1"/"0")
 */
function parseMotorState(value: any, fallback: MotorState): MotorState {
  if (value === undefined || value === null) return fallback;

  // Boolean
  if (typeof value === 'boolean') {
    return value ? 'On' : 'Off';
  }

  // Number (0 = Off, 1 = On, 2 = Transition)
  if (typeof value === 'number') {
    if (value === 0) return 'Off';
    if (value === 1) return 'On';
    if (value === 2) return 'Transition';
    return value > 0 ? 'On' : 'Off';
  }

  // String
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    if (lower === 'on' || lower === '1' || lower === 'true' || lower === 'running') return 'On';
    if (lower === 'off' || lower === '0' || lower === 'false' || lower === 'stopped') return 'Off';
    if (lower === 'transition' || lower === 'starting' || lower === 'stopping') return 'Transition';
  }

  return fallback;
}

/**
 * MotorNode - React Flow wrapper for Motor component
 * 
 * If tagId is provided, reads live state from tagStore.
 * Otherwise falls back to static data.state prop.
 */
const MotorNode: React.FC<MotorNodeProps> = ({ data }) => {
  const handles = data?.handles ?? [];
  const size = data?.size ?? 80;
  const fallbackState = data?.state ?? 'Off';

  // Get live value from tagStore if tagId is set
  const liveValue = useTagValue(data?.tagId, undefined);
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
