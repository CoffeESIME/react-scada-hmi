import { memo } from 'react';
import { NodeProps } from 'reactflow';
import LinearGauge from './LinearGauge';
import { LinearGaugeProps } from './LinearGauge.type';
import { useNodeLiveData } from '@/hooks/useNodeLiveData';
import { useAlarmStore } from '@/app/store/alarmStore';
import { thresholdsStyle } from './LinearGauge.style';

interface LinearGaugeNodeData extends Omit<LinearGaugeProps, 'value'> {
  /** Tag ID for live data binding */
  tagId?: number;
  /** Initial value if tag is not yet available */
  initialValue?: number;

  /** Standard Industrial Limits */
  scaleMin?: number;
  scaleMax?: number;
  limitLL?: number;
  limitL?: number;
  limitH?: number;
  limitHH?: number;
}

type LinearGaugeNodeProps = NodeProps<LinearGaugeNodeData>;

/**
 * LinearGaugeNode - React Flow wrapper for LinearGauge component
 * 
 * If tagId is provided, reads live value from tagStore via Safe Mode hook.
 * Falls back to initialValue or 0.
 * 
 * Auto-generates thresholds from Industrial Limits (HH, H, L, LL) if provided,
 * mapping them to standard styles via thresholdsStyle.
 */
const LinearGaugeNode: React.FC<LinearGaugeNodeProps> = ({ data }) => {
  // Get live value from tagStore if tagId is set
  const { value: liveValue } = useNodeLiveData(data.tagId, data.initialValue ?? 0);

  // DEBUG: Ver qué tagId tiene configurado y qué valor recibe
  console.log(`[LinearGauge] tagId=${data.tagId}, liveValue=${liveValue}`);

  // Check for active alarm on this tag
  const isAlarmActive = useAlarmStore((state) =>
    data.tagId ? !!state.activeAlarms[data.tagId] : false
  );

  // Auto-calculate thresholds based on limits if provided
  const calculatedThresholds = (() => {
    // If specific thresholds array is provided manually (legacy/advanced), use it.
    if (data.thresholds && data.thresholds.length > 0 && !data.scaleMax) {
      return thresholdsStyle(data.thresholds, isAlarmActive);
    }

    const rawThresholds = [];
    const min = data.scaleMin ?? 0;
    const max = data.scaleMax ?? 100;

    // 1. Min Start (Anchor) -> Normal (base color)
    rawThresholds.push({ max: min, classColor: '', identifier: 'Normal' });

    // 2. Low Low (LL) -> End of Critical Low Zone
    if (data.limitLL !== undefined) {
      rawThresholds.push({ max: data.limitLL, classColor: '', identifier: 'High Priority Alarm' });
    }

    // 3. Low (L) -> End of Warning Low Zone
    if (data.limitL !== undefined) {
      rawThresholds.push({ max: data.limitL, classColor: '', identifier: 'Medium Priority Alarm' });
    }

    // 4. Normal (H) -> End of Normal Zone
    // Note: Usually Normal zone is between L and H. 
    // So the segment ending at limitH is "Normal".
    if (data.limitH !== undefined) {
      rawThresholds.push({ max: data.limitH, classColor: '', identifier: 'Normal' });
    }

    // 5. High (HH) -> End of Warning High Zone
    if (data.limitHH !== undefined) {
      rawThresholds.push({ max: data.limitHH, classColor: '', identifier: 'Medium Priority Alarm' });
    }

    // 6. Max -> End of Critical High Zone
    // The segment from HH to Max is Critical.
    rawThresholds.push({ max: max, classColor: '', identifier: 'High Priority Alarm' });

    // Apply standard styling logic to resolve identifiers to classColors
    return thresholdsStyle(rawThresholds, isAlarmActive);
  })();

  return (
    <LinearGauge
      value={liveValue}
      alarmStatus={isAlarmActive}
      thresholds={calculatedThresholds}
      units={data.units}
      width={data.width}
      height={data.height}
      bottom={data.bottom}
      scaleMin={data.scaleMin ?? 0}
      scaleMax={data.scaleMax ?? 100}
      setPoint={data.setPoint}
    />
  );
};

export default memo(LinearGaugeNode);
