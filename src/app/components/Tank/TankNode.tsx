import { memo } from 'react';
import { Node, NodeProps, Handle, Position } from 'reactflow';
import { Tank } from './Tank';
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
interface TankNodeData {
  handles: handleEl[];
}

type TankNodeProps = NodeProps & {
  data: TankNodeData;
};

const TankNode: React.FC<TankNodeProps> = ({ data }) => {
  return (
    <>
      {data.handles.map((handle: handleEl) => (
        <Handle
          key={handle.id}
          type={handle.type}
          position={handle.position}
          id={handle.id}
          style={handle.style}
          className='border-0 bg-process-connector'
        />
      ))}
      <Tank />
    </>
  );
};

export default memo(TankNode);
