'use client';
import ReactFlow, {
  Background,
  ReactFlowProvider,
  useEdgesState,
  Edge,
} from 'reactflow';
import { PIDNodes, nodeTypes } from './Flows/nodes';
import { initialEdges } from './Flows/edges';
import config from 'tailwindConfig';
import 'reactflow/dist/style.css';
import './globals.css';
import { useNodeStore } from './store/nodes';
import React, { useEffect } from 'react';
// eslint-disable-next-line react/function-component-definition
export default function Home(): React.ReactElement {
  const [edges, setEdges] = useEdgesState<Edge[]>(initialEdges);
  const { connectMQTT, disconnectMQTT, nodes, setNodes } = useNodeStore();

  useEffect(() => {
    setNodes(nodes);
  }, [nodes, setNodes]);

  useEffect(() => {
    setNodes(PIDNodes);
    connectMQTT();
    return () => disconnectMQTT();
  }, [connectMQTT, disconnectMQTT, setNodes]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-slate-50 p-0">
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
          <ReactFlow edges={edges} nodeTypes={nodeTypes} nodes={nodes} />
        </div>
      </ReactFlowProvider>
    </main>
  );
}
