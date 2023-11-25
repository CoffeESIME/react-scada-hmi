import React, { memo } from 'react';
import { Node, NodeProps, Position, Handle } from 'reactflow';
import { MotorIcon } from './MotorOne';
type handleEl = {
  type: 'source' | 'target';
  position: Position;
  id: string;
  style: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
};
type MotorNodeData = {
  handles: handleEl[];
  state: 'On' | 'Off' | 'Transition';
};

type MotorNodeProps = NodeProps & {
  data: MotorNodeData;
};
//this should take in account that an alarm should appear in the app as an icon or similar

const MotorNode: React.FC<MotorNodeProps> = ({ data }) => {
  return (
    <>
      {data.handles.map((handle: handleEl) => (
        <Handle
          key={handle.id}
          position={handle.position}
          type={handle.type}
          id={handle.id}
          style={handle.style}
          className="border-0 bg-process-connector"
        />
      ))}

      <MotorIcon size={80} state={data.state} />
    </>
  );
};
export default memo(MotorNode);
