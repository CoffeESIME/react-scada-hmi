import { memo } from 'react';
import { Node, NodeProps, Handle, Position, HandleType } from 'reactflow';
import { ValveIcon } from './Valve';
import { ValveIcon1 } from './Valve1';

interface NodeData {
    valveType: 'round' | 'rect';
    rotation: number;
}

type ValveNodeProps = NodeProps<NodeData>;

type HandleConfig = {
    type: 'source' | 'target';
    position: Position;
    id: string;
    style: { top?: number; bottom?: number; left?: number; };
};

type HandleConfigs = {
    [key: number]: HandleConfig[];
};

const ValveNode: React.FC<ValveNodeProps> = (props) => {
    const { valveType, rotation } = props.data;

    const handleConfigs: HandleConfigs = {
        0: [
            { type: "target", position: Position.Left, id: "ConnectLeft", style: { top: 40 } },
            { type: "source", position: Position.Right, id: "ConnectRight", style: { top: 40 } },
            ...(valveType !== 'rect' ? [{ type: "source" as const, position: Position.Top, id: "ConnectTop", style: { bottom: 10 } }] : [])
        ],
        90: [
            { type: "target", position: Position.Right, id: "ConnectRight", style: { top: 25 } },
            { type: "target", position: Position.Top, id: "ConnectTop", style: { left: 10 } },
            { type: "source", position: Position.Bottom, id: "ConnectBottom", style: { left: 10 } }
        ],
        180: [
            { type: "target", position: Position.Left, id: "ConnectLeft", style: { top: 15 } },
            { type: "source", position: Position.Right, id: "ConnectRight", style: { top: 15 } },
            { type: "target", position: Position.Bottom, id: "ConnectTop", style: { bottom: -8 } }
        ]
    };

    return (
        <>
            {handleConfigs[rotation]?.map((config) => (
                <Handle
                    key={config.id}
                    type={config.type}
                    position={config.position}
                    id={config.id}
                    style={config.style}
                    className='bg-process-connector border-0'
                />
            ))}
            {valveType === 'round' && <ValveIcon state='Open' size={50} rotation={rotation} />}
            {valveType === 'rect' && <ValveIcon1 state='Open' size={45} />}
        </>
    );
}

export default memo(ValveNode);
