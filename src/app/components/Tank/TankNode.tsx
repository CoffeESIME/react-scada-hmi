import { memo } from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { Tank } from './Tank';

type HandleEl = {
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

interface TankNodeData {
  handles: HandleEl[];
  width?: number;
  height?: number;
  fillColor?: string;
  strokeColor?: string;
}

type TankNodeProps = NodeProps<TankNodeData>;

const TankNode: React.FC<TankNodeProps> = ({ data }) => {
  return (
    <>
      {data.handles.map((handle: HandleEl) => (
        <Handle
          key={handle.id}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          style={handle.style}
          className="border-0 bg-process-connector"
        />
      ))}
      <Tank
        width={data.width}
        height={data.height}
        fillColor={data.fillColor}
        strokeColor={data.strokeColor}
      />
    </>
  );
};

export default memo(TankNode);
