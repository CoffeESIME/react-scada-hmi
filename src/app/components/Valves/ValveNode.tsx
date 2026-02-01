import React, { memo } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { ValveIcon } from './Valve';
import { ValveIcon1 } from './Valve1';
import { useNodeLiveData } from '@/hooks/useNodeLiveData';

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
  state?: 'Open' | 'Closed' | 'Transition'; // Keep for fallback/initial
  size?: number;
  tagId?: number; // Added for live data
};

type ValveNodeProps = NodeProps<ValveNodeData>;

const ValveNode: React.FC<ValveNodeProps> = ({ data }) => {
  const valveType = data?.valveType ?? 'round';
  const rotation = data?.rotation ?? 0;
  const handles = data?.handles ?? [];
  const size = data?.size ?? 50;

  // Live data integration with Safe Mode
  // Default to data.state if tagId is not present or in Edit Mode
  const { value: liveValue } = useNodeLiveData(data.tagId, undefined);

  // Logic to determine state: 
  // If liveValue is present, map it to 'Open'/'Closed'. 
  // Assuming 1/true = Open, 0/false = Closed.
  // If no liveValue, fallback to data.state or 'Closed'.
  let currentState: 'Open' | 'Closed' | 'Transition' = data.state ?? 'Closed';

  if (liveValue !== undefined) {
    if (liveValue === 1 || liveValue === true || liveValue === 'Open') {
      currentState = 'Open';
    } else if (liveValue === 0 || liveValue === false || liveValue === 'Closed') {
      currentState = 'Closed';
    }
    // Can add logic for 'Transition' if needed, dependent on data
  }

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
        <ValveIcon state={currentState} size={size} rotation={rotation} />
      ) : (
        <ValveIcon1 state={currentState} size={size - 5} />
      )}
    </>
  );
};

export default memo(ValveNode);
