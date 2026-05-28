import { NodeProps } from 'reactflow';
import { BoxCard } from './Box';

type BoxNodeData = {
  width?: number;
  height?: number;
};

type BoxCardNodeProps = NodeProps<BoxNodeData>;

export const BoxCardNode: React.FC<BoxCardNodeProps> = ({ data }) => {
  const width = data?.width ?? 320;
  const height = data?.height ?? 320;
  
  return <BoxCard width={width} height={height} />;
};
