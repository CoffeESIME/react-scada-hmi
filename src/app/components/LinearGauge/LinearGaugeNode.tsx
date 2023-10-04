import { Node, NodeProps } from 'reactflow';
import LinearGauge from './LinearGauge';
type NodeData = {
};

type LinearGaugeNode = Node<NodeData>;

export const LinearGaugeNode = ({ }: NodeProps<NodeData>) => {
    return <LinearGauge value={30} />;
}