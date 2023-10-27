import { Threshold } from './LinearGauge.type';
export const needleStyle = (
  needleSize: number,
  color: string,
  value: number
) => ({
  width: '0',
  height: '0',
  borderLeft: `${needleSize}px solid transparent`,
  borderRight: `${needleSize}px solid transparent`,
  borderBottom: `${needleSize}px solid ${color}`,
  position: 'absolute' as 'absolute',
  bottom: `${value - 1}%`,
  left: '-70%',
  transform: 'rotate(90deg)',
  zIndex: 3,
});

export const thresholdsStyle = (
  thresholds: Threshold[],
  alarmState: boolean
): Threshold[] => {
  const alarmTypeClassIdentifier = [
    { identifier: 'Low Priority Alarm', classIdentifier: 'low-priority-alarm' },
    {
      identifier: 'Low Priority Alarm Foreground',
      classIdentifier: 'low-priority-alarm-fg',
    },
    {
      identifier: 'Medium Priority Alarm',
      classIdentifier: 'medium-priority-alarm',
    },
    {
      identifier: 'Medium Priority Alarm Foreground',
      classIdentifier: 'medium-priority-alarm-fg',
    },
    {
      identifier: 'High Priority Alarm',
      classIdentifier: 'high-priority-alarm',
    },
    {
      identifier: 'High Priority Alarm Foreground',
      classIdentifier: 'high-priority-alarm-fg',
    },
    {
      identifier: 'Urgent Priority Alarm',
      classIdentifier: 'urgent-priority-alarm',
    },
    {
      identifier: 'Urgent Priority Alarm Foreground',
      classIdentifier: 'urgent-priority-alarm-fg',
    },
    { identifier: 'Normal', classIdentifier: 'display-background' },
  ];
  const TypeClassIdentifier = [
    { identifier: 'Low Priority Alarm', classIdentifier: 'low-priority' },
    {
      identifier: 'Low Priority Alarm Foreground',
      classIdentifier: 'low-priority-fg',
    },
    { identifier: 'Medium Priority Alarm', classIdentifier: 'medium-priority' },
    {
      identifier: 'Medium Priority Alarm Foreground',
      classIdentifier: 'medium-priority-fg',
    },
    { identifier: 'High Priority Alarm', classIdentifier: 'high-priority' },
    {
      identifier: 'High Priority Alarm Foreground',
      classIdentifier: 'high-priority-fg',
    },
    { identifier: 'Urgent Priority Alarm', classIdentifier: 'urgent-priority' },
    {
      identifier: 'Urgent Priority Alarm Foreground',
      classIdentifier: 'urgent-priority-fg',
    },
    { identifier: 'Normal', classIdentifier: 'display-background' },
  ];
  const lookup = alarmState ? alarmTypeClassIdentifier : TypeClassIdentifier;
  return thresholds.map((threshold) => {
    const matchedType = lookup.find(
      (entry) => entry.identifier === threshold.identifier
    );
    if (matchedType) {
      return {
        ...threshold,
        identifier: matchedType.identifier,
        classColor: matchedType.classIdentifier,
      };
    }
    return threshold;
  });
};
