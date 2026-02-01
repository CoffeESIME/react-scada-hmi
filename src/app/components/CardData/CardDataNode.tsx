import { NodeProps } from 'reactflow';
import { CardData } from './CardData';
import { NodeActionConfig } from '@/utils/actionTypes';
import { useNodeAction } from '@/hooks/useNodeAction';

export type CardDataNodeData = NodeActionConfig & {
  label: string[];
};

type CardDataNodeProps = NodeProps & {
  data: CardDataNodeData;
};

export const CardDataNode: React.FC<CardDataNodeProps> = ({ data }) => {
  const { executeAction } = useNodeAction(data);
  return (
    <CardData
      label={data.label}
      onPress={executeAction}
    />
  );
};
