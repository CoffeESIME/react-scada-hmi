import { Node, NodeProps } from 'reactflow';
import { CardData } from './CardData';

type CardDataNodeData = {
    label: string[]
};

type CardDataNodeProps = NodeProps & {
    data: CardDataNodeData;
};

export const CardDataNode: React.FC<CardDataNodeProps> = ({ data }) => {
    return <CardData label={data.label} />;
}