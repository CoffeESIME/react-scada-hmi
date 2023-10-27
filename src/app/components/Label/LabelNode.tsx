import { Node, NodeProps, Handle, Position } from 'reactflow';
import React from 'react';
import { Label } from './Label';
type LabelNodeData = {
  text: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  fontSize?: number;
  triangleDirection?: 'left' | 'right';
  handle: {
    type: 'source' | 'target';
    position: Position;
  };
};

type LabelNodeProps = NodeProps & {
  data: LabelNodeData;
};

export const LabelNode: React.FC<LabelNodeProps> = ({ data }) => {
  return (
    <>
      <Handle
        type={data.handle.type}
        position={data.handle.position}
        className='border-0 bg-process-connector'
      />
      <Label
        text={data.text}
        width={data.width}
        height={data.height}
        triangleDirection={data.triangleDirection}
        backgroundColor={data.backgroundColor}
      />
    </>
  );
};
