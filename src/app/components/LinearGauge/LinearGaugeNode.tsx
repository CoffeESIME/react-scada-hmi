import {memo} from 'react'
import { Node, NodeProps } from 'reactflow';
import LinearGauge from './LinearGauge';
type NodeData = {
};

type LinearGaugeNode = Node<NodeData>;
//this should take in account that an alarm should appear in the app as an icon or similar 

const LinearGaugeNode = ({ }: NodeProps<NodeData>) => {
    return <LinearGauge value={50} alarmStatus={true}/>;
}
export default memo(LinearGaugeNode)