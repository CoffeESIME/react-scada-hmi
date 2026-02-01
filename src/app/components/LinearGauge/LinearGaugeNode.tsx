import { memo } from 'react';
import { NodeProps } from 'reactflow';
import LinearGauge from './LinearGauge';
import { LinearGaugeProps } from './LinearGauge.type';
import { useNodeLiveData } from '@/hooks/useNodeLiveData';

interface LinearGaugeNodeData extends Omit<LinearGaugeProps, 'value'> {
  /** Tag ID for live data binding */
  tagId?: number;
  /** Initial value if tag is not yet available */
  initialValue?: number;
}

type LinearGaugeNodeProps = NodeProps<LinearGaugeNodeData>;

/**
 * LinearGaugeNode - React Flow wrapper for LinearGauge component
 * 
 * If tagId is provided, reads live value from tagStore via Safe Mode hook.
 * Falls back to initialValue or 0.
 */
const LinearGaugeNode: React.FC<LinearGaugeNodeProps> = ({ data }) => {
  // Get live value from tagStore if tagId is set
  const { value: liveValue } = useNodeLiveData(data.tagId, data.initialValue ?? 0);

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
