import { Node, NodeProps } from 'reactflow';
import LinearGauge from './LinearGauge';
type NodeData = {
};

type LinearGaugeNode = Node<NodeData>;
//this should take in account that the alarms initialize the color of thresholds, 
//so the main state of color is one and for alarm is other one 
export const LinearGaugeNode = ({ }: NodeProps<NodeData>) => {
    return <LinearGauge value={50} />;
}