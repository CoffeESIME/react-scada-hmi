'use client';

import React from 'react';
import ReactFlow, {
    Background,
    ReactFlowProvider,
    Controls,
    Edge,
    Node,
    Position,
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import AuthGuard from '../components/AuthGuard';
import { nodeTypes } from '../Flows/nodes';
import Link from 'next/link';
import config from 'tailwindConfig';
// Nodos para la pantalla Feed System (Motor protagonista)
const feedSystemNodes: Node[] = [
    // === MOTOR PRINCIPAL ===
    {
        id: 'mainMotor',
        type: 'motor',
        position: { x: 400, y: 300 },
        data: {
            state: 'On',
            size: 120,
            handles: [
                {
                    type: 'target',
                    position: Position.Left,
                    id: 'motor_target_1',
                    style: { top: 60 },
                },
                {
                    type: 'source',
                    position: Position.Right,
                    id: 'motor_source_1',
                    style: { top: 60 },
                },
                {
                    type: 'source',
                    position: Position.Bottom,
                    id: 'motor_source_2',
                    style: { left: 60 },
                },
            ],
        },
    },

    // === ALARMA DEL MOTOR ===
    {
        id: 'motorAlarm',
        type: 'alarm',
        position: { x: -10, y: -10 },
        data: { isActive: false, type: 'HIGH', size: 24 },
        parentNode: 'mainMotor',
    },

    // === VÁLVULA DE ENTRADA ===
    {
        id: 'inputValve',
        type: 'valve',
        position: { x: 200, y: 285 },
        data: {
            valveType: 'round',
            rotation: 0,
            state: 'Open',
            handles: [
                {
                    type: 'target',
                    position: Position.Left,
                    id: 'input_valve_target',
                    style: { top: 40 },
                },
                {
                    type: 'source',
                    position: Position.Right,
                    id: 'input_valve_source',
                    style: { top: 40 },
                },
            ],
        },
    },

    // === VÁLVULA DE SALIDA ===
    {
        id: 'outputValve',
        type: 'valve',
        position: { x: 620, y: 285 },
        data: {
            valveType: 'rect',
            rotation: 0,
            state: 'Open',
            handles: [
                {
                    type: 'target',
                    position: Position.Left,
                    id: 'output_valve_target',
                    style: { top: 40 },
                },
                {
                    type: 'source',
                    position: Position.Right,
                    id: 'output_valve_source',
                    style: { top: 40 },
                },
            ],
        },
    },

    // === CONTROL CARD DEL MOTOR ===
    {
        id: 'motorControl',
        type: 'controlCard',
        position: { x: 350, y: 500 },
        data: {
            title: 'Motor Speed',
            processVariableValue: 1450,
            processVariable: 'RPM',
            setPoint: 1500,
            output: 96.5,
            mode: 'AUTO',
            handleDataSource: {
                position: Position.Top,
                id: 'motorControlSource',
                style: { left: 75 },
            },
            handleDataTarget: {
                position: Position.Top,
                id: 'motorControlTarget',
                style: { left: 25 },
            },
        },
    },

    // === DATA TREND ===
    {
        id: 'motorTrend',
        type: 'dataTrendLine',
        position: { x: 50, y: 80 },
        data: {
            dataPoints: [
                1420, 1435, 1450, 1445, 1460, 1455, 1470, 1465, 1480, 1475,
                1450, 1455, 1460, 1465, 1470, 1455, 1450, 1445, 1460, 1455,
                1480, 1475, 1470, 1465, 1460, 1455, 1450, 1445, 1440, 1450,
            ],
            setPoint: 1500,
            limitBottom: 1400,
            limitTop: 1600,
            yAxis: { min: 1350, max: 150 },
            xAxis: { min: 0, max: 10 },
            title: 'Motor Speed (RPM)',
        },
    },

    // === LABELS ===
    {
        id: 'inputLabel',
        type: 'label',
        position: { x: 50, y: 300 },
        data: {
            text: 'Feed Input',
            triangleDirection: 'right',
            handle: { type: 'source', position: Position.Right }
        },
    },
    {
        id: 'outputLabel',
        type: 'label',
        position: { x: 780, y: 300 },
        data: {
            text: 'To Process',
            triangleDirection: 'left',
            handle: { type: 'target', position: Position.Left }
        },
    },
    {
        id: 'motorLabel',
        type: 'label',
        position: { x: 410, y: 220 },
        data: {
            text: 'M-101',
            handle: { type: 'source', position: Position.Right }
        },
    },

    // === LINEAR GAUGE para temperatura ===
    {
        id: 'tempGauge',
        type: 'linearGauge',
        position: { x: 700, y: 450 },
        data: {
            title: 'Motor Temp',
            unit: '°C',
            value: 65,
            min: 0,
            max: 100,
            setPoint: 70,
            thresholds: [
                { value: 0, color: '#22c55e' },
                { value: 60, color: '#eab308' },
                { value: 80, color: '#ef4444' },
            ],
        },
    },
];

// Edges para conectar los nodos
const feedSystemEdges: Edge[] = [
    // Input -> Valve
    {
        id: 'edge_input_valve',
        source: 'inputLabel',
        target: 'inputValve',
        targetHandle: 'input_valve_target',
        style: { strokeWidth: 4, stroke: '#64748b' },
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    // Valve -> Motor
    {
        id: 'edge_valve_motor',
        source: 'inputValve',
        target: 'mainMotor',
        sourceHandle: 'input_valve_source',
        targetHandle: 'motor_target_1',
        style: { strokeWidth: 4, stroke: '#64748b' },
        animated: true,
    },
    // Motor -> Output Valve
    {
        id: 'edge_motor_output',
        source: 'mainMotor',
        target: 'outputValve',
        sourceHandle: 'motor_source_1',
        targetHandle: 'output_valve_target',
        style: { strokeWidth: 4, stroke: '#64748b' },
        animated: true,
    },
    // Output Valve -> Label
    {
        id: 'edge_output_label',
        source: 'outputValve',
        target: 'outputLabel',
        sourceHandle: 'output_valve_source',
        style: { strokeWidth: 4, stroke: '#64748b' },
        markerEnd: { type: MarkerType.ArrowClosed },
    },
    // Motor -> Control (feedback)
    {
        id: 'edge_motor_control',
        source: 'mainMotor',
        target: 'motorControl',
        sourceHandle: 'motor_source_2',
        targetHandle: 'motorControlTarget',
        type: 'smoothstep',
        style: { strokeWidth: 2, stroke: '#64748b', strokeDasharray: '5,5' },
    },
];

export default function FeedSystemPage(): React.ReactElement {
    return (
        <AuthGuard>
            <div className="flex min-h-screen flex-col bg-slate-900">
                {/* Header */}
                <header className="flex items-center justify-between bg-slate-800 px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="rounded bg-slate-700 px-3 py-2 text-sm text-white hover:bg-slate-600 transition-colors"
                        >
                            ← Volver
                        </Link>
                        <h1 className="text-xl font-bold text-white">Feed System - Motor M-101</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1 text-sm text-green-400">
                            <span className="mr-2 h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                            Sistema Activo
                        </span>
                    </div>
                </header>

                {/* React Flow Canvas */}
                <div className="flex-1">
                    <ReactFlowProvider>
                        <div
                            className="flowContainer"
                            style={{
                                width: '100vw',
                                height: '100vw',
                                background: `${
                                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                    (config.theme?.extend?.colors as any)['display-bg-tabs']
                                    }`,
                            }}
                        >
                            <Background />
                            <ReactFlow
                                nodes={feedSystemNodes}
                                edges={feedSystemEdges}
                                nodeTypes={nodeTypes}
                                fitView
                                fitViewOptions={{ padding: 0.2 }}
                                defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
                                minZoom={0.3}
                                maxZoom={2}
                                attributionPosition="bottom-left"
                            >
                                <Background color="#334155" gap={20} />
                                <Controls className="bg-slate-800 border-slate-600" />

                            </ReactFlow>
                        </div>
                    </ReactFlowProvider>
                </div>
            </div>
        </AuthGuard>
    );
}
