import { memo } from 'react';
import { Node, NodeProps, Handle, Position } from 'reactflow';
import { ValveIcon } from './Valve';
import { ValveIcon1 } from './Valve1';

interface NodeData {
    valveType: 'round' | 'rect';
    rotation: number;
    handles: HandleConfig[],
    state: 'Open' | 'Closed' | 'Transition';
}

type ValveNodeProps = NodeProps<NodeData>;

type HandleConfig = {
    type: 'source' | 'target';
    position: Position;
    id: string;
    style: { top?: number; bottom?: number; left?: number; };
};

const ValveNode: React.FC<ValveNodeProps> = (props) => {
    const { valveType, rotation, handles, state } = props.data;

    return (
        <>
            {handles.map((config) => (
                <Handle
                    key={config.id}
                    type={config.type}
                    position={config.position}
                    id={config.id}
                    style={config.style}
                    className='bg-process-connector border-0'
                />
            ))}
            {valveType === 'round' && <ValveIcon state={state} size={50} rotation={rotation} />}
            {valveType === 'rect' && <ValveIcon1 state={state} size={45} />}
        </>
    );
}

export default memo(ValveNode);
