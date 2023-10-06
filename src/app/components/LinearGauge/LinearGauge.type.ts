import { BaseProps } from "../../utils/generalTypes";

export type LinearGaugeProps = BaseProps & {
    value: number;
    units?: string;
    width?: string;
    height?: string;
    fontSize?: string;
    fontFamily?: string;
    borderColor?: string;
    borderWidth?: string;
    thresholds?: Threshold[];
}

export type Threshold = {
    identifier: string;
    max: number;
    classColor: string;
}