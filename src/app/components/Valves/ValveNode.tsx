import { memo } from 'react';
import { Node, NodeProps } from 'reactflow';
import { ValveIcon } from './Valve';
import { ValveIcon1 } from './Valve1';

type NodeData = {
    valveType: 'round' | 'rect';
    rotation: number
};

type ValveNodeProps = NodeProps<NodeData>;

const ValveNode: React.FC<ValveNodeProps> = (props) => {
    const { valveType, rotation } = props.data;

    if (valveType === 'round') {
        return <ValveIcon state='Open' size={90} rotation={rotation}/>;
    } else if (valveType === 'rect') return <ValveIcon1 state='Open' size={90}/>;
    return null;
}
export default memo(ValveNode)