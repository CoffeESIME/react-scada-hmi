'use client';

import React, { useMemo } from 'react';
import ReactFlow, {
    Background,
    Controls,
    Node,
    Edge,
    ConnectionLineType
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useMqttSystem } from '@/hooks/useMqttSystem';
import { nodeTypes } from '@/app/scada/nodeTypes';

import { thresholdsStyle } from '@/app/components/LinearGauge/LinearGauge.style';
import { ScadaModeProvider } from '@/contexts/ScadaModeContext';

// Initial Nodes Data
// Using tagId: 2 for Valve and tagId: 1 for Gauge as suggested
const initialNodes: Node[] = [
    {
        id: 'node-valve-1',
        type: 'valve',
        position: { x: 250, y: 100 },
        data: {
            tagId: 2,
            valveType: 'round',
            // state: 'Closed' // Fallback, will be overridden by tag data
        },
    },
    {
        id: 'node-gauge-1',
        type: 'gauge',
        position: { x: 250, y: 300 },
        data: {
            tagId: 1,
            units: '°C',
            width: 20,
            height: 280,
            thresholds: thresholdsStyle([
                { max: 60, classColor: '', identifier: 'Normal' },
                { max: 80, classColor: '', identifier: 'Medium Priority Alarm' },
                { max: 100, classColor: '', identifier: 'High Priority Alarm' }
            ], false),
            min: 0,
            max: 100
        },
    },
];

// Connect the Valve to the Gauge visually
const initialEdges: Edge[] = [
    {
        id: 'edge-1',
        source: 'node-valve-1',
        target: 'node-gauge-1',
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#b1b1b7' },
    }
];

export default function RuntimeDemoPage() {
    // Initialize MQTT Connection
    useMqttSystem();

    const nodes = useMemo(() => initialNodes, []);
    const edges = useMemo(() => initialEdges, []);

    return (
        <ScadaModeProvider isEditMode={false}>
            <div className="w-full h-screen bg-slate-50 text-white">
                <div className="absolute top-4 left-4 z-10 bg-black/50 p-4 rounded backdrop-blur-sm">
                    <h1 className="text-xl font-bold mb-2">SCADA Runtime Demo</h1>
                    <p className="text-sm opacity-80">
                        Live visualization powered by MQTT & React Flow.
                    </p>
                    <div className="mt-2 text-xs">
                        <p>Valve Tag ID: 2</p>
                        <p>Gauge Tag ID: 1</p>
                    </div>
                </div>

                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    zoomOnScroll={false}
                >
                    <Background />
                    <Controls showInteractive={false} />
                </ReactFlow>
            </div>
        </ScadaModeProvider>
    );
}
