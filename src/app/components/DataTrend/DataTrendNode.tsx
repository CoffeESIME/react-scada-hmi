import { Node, NodeProps } from 'reactflow';
import { DataTrend } from './DataTrend';
type NodeData = {
};

type DataTrendNode = Node<NodeData>;
//this should take in account that an alarm should appear in the app as an icon or similar 

export const DataTrendNode = ({ }: NodeProps<NodeData>) => {
    return <DataTrend/>;
}