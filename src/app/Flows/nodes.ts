import  LinearGaugeNode  from "../components/LinearGauge/LinearGaugeNode"
import  TankNode  from "../components/Tank/TankNode"
import { DataTrendNode } from "../components/DataTrend/DataTrendNode"
import { Node, NodeTypes } from "reactflow"

export const nodeTypes: NodeTypes = {
    linearGauge: LinearGaugeNode,
    tank: TankNode,
    dataTrendLine: DataTrendNode
}

export const PIDNodes: Node[] = [
    {
        id: "lGauge",
        type: "linearGauge",
        position: { x: 100, y: 200 },
        data: {}
    },
    {
        id: "tank",
        type: "tank",
        position: { x: 200, y: 200 },
        data: {}
    },
    {
        id: "dataTrend1",
        type: "dataTrendLine",
        position: { x: 0, y: 30 },
        data: {},
        parentNode: "tank"
    },
    {
        id: "dataTrend2",
        type: "dataTrendLine",
        position: { x: 0, y: 50 },
        data: {},
        parentNode: "tank"
    },
]