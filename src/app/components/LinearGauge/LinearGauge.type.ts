import { BaseProps } from '../../utils/generalTypes';

export type LinearGaugeProps = BaseProps & {
  value: number;
  alarmStatus?: boolean;
  units?: string;
  width?: string;
  height?: string;
  fontSize?: string;
  fontFamily?: string;
  borderColor?: string;
  borderWidth?: string;
  bottom?: number;
  setPoint?: number;
  thresholds?: Threshold[];
};

export type Threshold = {
  identifier: string;
  max: number;
  classColor: string;
};
