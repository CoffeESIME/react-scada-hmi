import {memo} from 'react'
import { Node, NodeProps } from 'reactflow';
import { MotorIcon } from './MotorOne';
type NodeData = {
};

type motorNode = Node<NodeData>;
//this should take in account that an alarm should appear in the app as an icon or similar 

const MotorNode = ({ }: NodeProps<NodeData>) => {
    return <MotorIcon size={80}/>;
}
export default memo(MotorNode)