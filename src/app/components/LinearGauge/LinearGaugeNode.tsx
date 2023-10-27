import { memo } from 'react';
import { NodeProps } from 'reactflow';
import LinearGauge from './LinearGauge';
import { LinearGaugeProps } from './LinearGauge.type';

type LinearGaugeNodeProps = NodeProps & {
  data: LinearGaugeProps;
};

const LinearGaugeNode: React.FC<LinearGaugeNodeProps> = ({ data }) => {
  return (
    <LinearGauge
      value={data.value}
      alarmStatus={data.alarmStatus}
      thresholds={data.thresholds}
      units={data.units}
      width={data.width}
      height={data.height}
      bottom={data.bottom}
      setPoint={data.setPoint}
    />
  );
};
export default memo(LinearGaugeNode);
