import { Node, NodeProps } from 'reactflow';
import { Alarm } from './Alarm';
type AlarmNodeData = {
  isActive?: boolean;
  type?: 'LOW' | 'HIGH' | 'MEDIUM' | 'URGENT';
  message?: string;
  size?: number;
};

type AlarmNodeProps = NodeProps & {
  data: AlarmNodeData;
};

export const AlarmNode: React.FC<AlarmNodeProps> = ({ data }) => {
  return (
    <Alarm
      isActive={data.isActive}
      type={data.type}
      message={data.message}
      size={data.size}
    />
  );
};
