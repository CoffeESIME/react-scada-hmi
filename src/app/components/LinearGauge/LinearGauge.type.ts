import { BaseProps } from "../../utils/generalTypes";

export type LinearGaugeProps = BaseProps & {
    value: number;
    width?: string;
    height?: string;
    fontSize?: string;
    fontFamily?: string;
    borderColor?: string;
    borderWidth?: string;
    thresholds?: Thresholds[];
}

export type Thresholds = {
    max: number;
    color: string;
}