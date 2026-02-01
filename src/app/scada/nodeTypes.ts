import { NodeTypes } from 'reactflow';

// Import Custom Node Components
import MotorNode from '@/app/components/Motors/MotorNode';
import ValveNode from '@/app/components/Valves/ValveNode';
import LinearGaugeNode from '@/app/components/LinearGauge/LinearGaugeNode';
import { AlarmNode } from '@/app/components/Alarm/AlarmNode';
import TankNode from '@/app/components/Tank/TankNode';
import { LabelNode } from '@/app/components/Label/LabelNode';
import { ButtonNode } from '@/app/components/Button/ButtonNode';
import { BoxCardNode } from '@/app/components/Boxes/BoxNode';
import { CardDataNode } from '@/app/components/CardData/CardDataNode';
import { ControlDataCardNode } from '@/app/components/ControlDataCard/ControlDataCardNode';
import { DataTrendNode } from '@/app/components/DataTrend/DataTrendNode';
import { SmallDataTrendNode } from '@/app/components/SmallDataTrend/SmallDataTrendNode';

// import { DebugCircleNode, DebugRectNode, DebugTriangleNode } from './DebugNodes';

/**
 * nodeTypes: Shared definition of React Flow node types.
 * Must be stable across re-renders to prevent infinite loops.
 */
export const nodeTypes: NodeTypes = {
    // Equipos
    motor: MotorNode,
    valve: ValveNode,
    tank: TankNode,

    // Indicadores
    gauge: LinearGaugeNode,
    alarm: AlarmNode,

    // UI Elements
    label: LabelNode,
    button: ButtonNode,
    box: BoxCardNode,

    // Data Display
    cardData: CardDataNode,
    controlDataCard: ControlDataCardNode,
    dataTrend: DataTrendNode,
    smallDataTrend: SmallDataTrendNode,
};

export const debugNodeTypes = nodeTypes;

/**
 * availableNodeTypes: List of nodes available in the sidebar
 */
export const availableNodeTypes = [
    // Equipos
    { label: 'Motor', type: 'motor' },
    { label: 'Valve', type: 'valve' },
    { label: 'Tank', type: 'tank' },
    // Indicadores
    { label: 'Gauge', type: 'gauge' },
    { label: 'Alarm', type: 'alarm' },
    // UI Elements
    { label: 'Label', type: 'label' },
    { label: 'Button', type: 'button' },
    { label: 'Box', type: 'box' },
    // Data Display
    { label: 'Card Data', type: 'cardData' },
    { label: 'Control Card', type: 'controlDataCard' },
    { label: 'Data Trend', type: 'dataTrend' },
    { label: 'Mini Trend', type: 'smallDataTrend' },
];
