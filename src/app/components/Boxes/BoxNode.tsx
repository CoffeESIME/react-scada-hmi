import { Node, NodeProps } from 'reactflow';
import { BoxCard } from './Box';

type BoxCardNodeProps = NodeProps;

export const BoxCardNode: React.FC<BoxCardNodeProps> = () => {
  return <BoxCard />;
};
