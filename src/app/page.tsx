"use client"
import ReactFlow, { Background, ReactFlowProvider, useNodesState, useEdgesState, Node, Edge, BackgroundVariant } from "reactflow";
import { PIDNodes, nodeTypes } from "./Flows/nodes";
import { initialEdges } from "./Flows/edges";
import { Label } from "./components/Label/Label";
import {LineChart} from "./components/Tank/DataTrendD3";
import config from "tailwindConfig";
import "reactflow/dist/style.css";
import "./globals.css";
import { useAlarmsStore } from "./store/alarm";
import { CardData } from "./components/CardData/CardData";
import { Alarm } from "./components/Alarm/Alarm";
export default function Home() {
  const alarms = useAlarmsStore(state => state.alarms)
  console.log(alarms)
  const fetchState = useAlarmsStore(state => state.fetchAlarms)

  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>(PIDNodes);
  const [edges, setEdges, onEdgeChange] = useEdgesState<Edge[]>(initialEdges)
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0 bg-slate-50">

      <ReactFlowProvider>
        <div
          className="flowContainer"
          style={{
            width: "100vw",
            height: "100vw",
           background: `${(config.theme?.extend?.colors as any)['display-bg-tabs']}`
          }}
        >
          <Background/>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgeChange}
          />
        </div>
      </ReactFlowProvider>
      <Label text="texto"/>
      <Alarm/>
      <LineChart/>
    </main>
  )
}
