'use client';
import ReactFlow, {
  Background,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from 'reactflow';
import { PIDNodes, nodeTypes } from './Flows/nodes';
import { initialEdges } from './Flows/edges';
import config from 'tailwindConfig';
import 'reactflow/dist/style.css';
import './globals.css';
import { useNodeStore } from './store/nodes';
import React, { useEffect } from 'react';
import MQTTReceiver from './components/mqtt/MQTTReceiver';
export default function Home(): React.ReactElement {
  const nodesOriginal = useNodeStore((state) => state.nodes);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>(PIDNodes);
  const [edges, setEdges, onEdgeChange] = useEdgesState<Edge[]>(initialEdges);
  useEffect(() => {
    if (nodesOriginal.length > 0) {
      setNodes(nodesOriginal);
    }
  }, [nodesOriginal, setNodes]);
  console.log('Process variables ',process.env.NEXT_PUBLIC_MQTT_URL)
  return (
    <main className='flex min-h-screen flex-col items-center justify-between bg-slate-50 p-0'>
      <ReactFlowProvider>
        <div
          className='flowContainer'
          style={{
            width: '100vw',
            height: '100vw',
            background: `${
              (config.theme?.extend?.colors as any)['display-bg-tabs']
            }`,
          }}
        >
          <Background />
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgeChange}
          />
        </div>
      </ReactFlowProvider>
      <MQTTReceiver />
    </main>
  );
}
