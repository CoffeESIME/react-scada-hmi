"use client"
import ReactFlow, { Background, ReactFlowProvider, useNodesState, useEdgesState, Node, Edge, BackgroundVariant } from "reactflow";
import { PIDNodes, nodeTypes } from "./Flows/nodes";
import LineChart from "./components/Tank/DataTrend";
import TankPump from "./components/TestGPT/PumpTank";
import config from "tailwindConfig";
import "reactflow/dist/style.css";
import "./globals.css";

export default function Home() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>(PIDNodes);
  const [edges, setEdges, onEdgeChange] = useEdgesState<Edge[]>([])
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0 bg-slate-50">
      <ReactFlowProvider>
        <div
          className="flowContainer"
          style={{
            width: "100vw",
            height: "100vw",
           background: `${config.theme?.extend?.colors['display-bg-tabs']}`
          }}
        >
          <Background variant={BackgroundVariant.Cross} />
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgeChange}
          />
        </div>
        <a>
          <TankPump/>
        </a>
      </ReactFlowProvider>
      <LineChart/>
    </main>
  )
}
