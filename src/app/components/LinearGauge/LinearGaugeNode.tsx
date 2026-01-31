import { memo } from 'react';
import { NodeProps } from 'reactflow';
import LinearGauge from './LinearGauge';
import { LinearGaugeProps } from './LinearGauge.type';
import { useTagValue } from '@/app/store/tagStore';

interface LinearGaugeNodeData extends LinearGaugeProps {
  /** Tag ID for live data binding */
  tagId?: number;
}

type LinearGaugeNodeProps = NodeProps & {
  data: LinearGaugeNodeData;
};

/**
 * LinearGaugeNode - React Flow wrapper for LinearGauge component
 * 
 * If tagId is provided, reads live value from tagStore.
 * Otherwise falls back to static data.value prop.
 */
const LinearGaugeNode: React.FC<LinearGaugeNodeProps> = ({ data }) => {
  // Get live value from tagStore if tagId is set, otherwise use static value
  const liveValue = useTagValue(data.tagId, data.value ?? 0);

  return (
    <LinearGauge
      value={liveValue}
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
