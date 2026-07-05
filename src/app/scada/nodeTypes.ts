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
import ImageNode from '@/app/components/ImageNode/ImageNode';

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
    
    // Media
    image: ImageNode,
};

export const debugNodeTypes = nodeTypes;

/**
 * availableNodeCategories: Grouped list of nodes available in the sidebar
 */
export const availableNodeCategories = [
    {
        title: 'Normativa ISA',
        items: [
            // Equipos
            { label: 'Motor', type: 'motor' },
            { label: 'Válvula', type: 'valve' },
            { label: 'Tanque', type: 'tank' },
            // Indicadores
            { label: 'Indicador', type: 'gauge' },
            { label: 'Alarma', type: 'alarm' },
            // UI Elements
            { label: 'Etiqueta', type: 'label' },
            { label: 'Botón', type: 'button' },
            { label: 'Contenedor', type: 'box' },
            // Data Display
            { label: 'Card de Datos', type: 'cardData' },
            { label: 'Control PID', type: 'controlDataCard' },
            { label: 'Tendencia', type: 'dataTrend' },
            { label: 'Mini Tendencia', type: 'smallDataTrend' },
        ],
    },
    {
        title: 'Elementos Genéricos',
        items: [
            { label: 'Imagen', type: 'image' },
        ],
    },
];
