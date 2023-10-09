import { memo} from 'react'
import { Node, NodeProps } from 'reactflow';
import { Tank } from './Tank';
type NodeData = {
};

type TankNode = Node<NodeData>;
//this should take in account that an alarm should appear in the app as an icon or similar 

const TankNode = ({ }: NodeProps<NodeData>) => {
    return(<Tank/>);
}

export default memo(TankNode)