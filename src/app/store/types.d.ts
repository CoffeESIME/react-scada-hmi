/**
 * SCADA Node Types
 * 
 * Base interfaces for React Flow node data with tag binding support.
 */
import { Position } from 'reactflow';

/**
 * Base handle configuration for React Flow nodes
 */
export interface HandleConfig {
    type: 'source' | 'target';
    position: Position;
    id: string;
    style?: React.CSSProperties;
}

/**
 * Base node data interface - all SCADA nodes should extend this
 */
export interface BaseNodeData {
    /** Tag ID for live data binding. If set, node reads value from tagStore */
    tagId?: number;

    /** Optional label/title for the node */
    label?: string;

    /** Dynamic handles configuration */
    handles?: HandleConfig[];
}

/**
 * Motor node data
 */
export interface MotorNodeData extends BaseNodeData {
    /** 
     * Static state value - used as fallback if tagId is not set
     * @deprecated Use tagId for live binding instead
     */
    state?: 'On' | 'Off' | 'Transition';
    size?: number;
}

/**
 * Valve node data
 */
export interface ValveNodeData extends BaseNodeData {
    valveType?: 'round' | 'rect';
    rotation?: number;
    /** 
     * Static state value - used as fallback if tagId is not set
     * @deprecated Use tagId for live binding instead
     */
    state?: 'Open' | 'Closed' | 'Transition';
    size?: number;
}

/**
 * Tank node data
 */
export interface TankNodeData extends BaseNodeData {
    /** 
     * Static level value (0-100) - used as fallback if tagId is not set
     * @deprecated Use tagId for live binding instead
     */
    level?: number;
}

/**
 * Linear Gauge node data
 */
export interface LinearGaugeNodeData extends BaseNodeData {
    /** 
     * Static value - used as fallback if tagId is not set
     * @deprecated Use tagId for live binding instead
     */
    value?: number;

    alarmStatus?: boolean;
    units?: string;
    width?: string;
    height?: string;
    bottom?: number;
    setPoint?: number;
    thresholds?: Array<{
        identifier: string;
        max: number;
        classColor: string;
    }>;
}

/**
 * Alarm node data
 */
export interface AlarmNodeData extends BaseNodeData {
    /** 
     * Static active state - used as fallback if tagId is not set
     * @deprecated Use tagId for live binding instead
     */
    isActive?: boolean;
    type?: 'LOW' | 'HIGH' | 'MEDIUM' | 'URGENT';
    message?: string;
    size?: number;
}

/**
 * Control Data Card node data
 */
export interface ControlDataCardNodeData extends BaseNodeData {
    title: string;
    /** 
     * Static PV value - used as fallback if tagId is not set
     * @deprecated Use tagId for live binding instead
     */
    processVariableValue?: number;
    processVariable?: string;
    setPoint?: number;
    output?: number;
    mode?: 'AUTO' | 'MANUAL' | 'JOGGING';
    handleDataSource?: {
        position: Position;
        id: string;
        style?: React.CSSProperties;
    };
    handleDataTarget?: {
        position: Position;
        id: string;
        style?: React.CSSProperties;
    };
}

/**
 * Data Trend node data
 */
export interface DataTrendNodeData extends BaseNodeData {
    /** 
     * Static data points - used as fallback if tagId is not set
     * @deprecated Use tagId for live binding instead
     */
    dataPoints?: number[];
    yAxis?: { min: number; max: number };
    xAxis?: { min: number; max: number };
    setPoint?: number;
    limitTop?: number;
    limitBottom?: number;
    title?: string;
    width?: number;
    height?: number;
}

/**
 * Label node data
 */
export interface LabelNodeData extends BaseNodeData {
    text: string;
    width?: number;
    height?: number;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    fontSize?: number;
    triangleDirection?: 'left' | 'right';
    handle?: {
        type: 'source' | 'target';
        position: Position;
    };
}

/**
 * Button node data
 */
export interface ButtonNodeData extends BaseNodeData {
    label: string;
}

/**
 * Card Data node data
 */
export interface CardDataNodeData extends BaseNodeData {
    label: string[];
    href?: string;
    onPress?: () => void;
}
