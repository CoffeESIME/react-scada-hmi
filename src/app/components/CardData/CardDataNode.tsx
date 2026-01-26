import { NodeProps } from 'reactflow';
import { CardData } from './CardData';

type CardDataNodeData = {
  label: string[];
  href?: string; // Navigation path
  onPress?: () => void; // Custom action
};

type CardDataNodeProps = NodeProps & {
  data: CardDataNodeData;
};

export const CardDataNode: React.FC<CardDataNodeProps> = ({ data }) => {
  return (
    <CardData
      label={data.label}
      href={data.href}
      onPress={data.onPress}
    />
  );
};
