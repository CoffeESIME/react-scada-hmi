import { LinearGaugeNode } from "../components/LinearGauge/LinearGaugeNode"
import { Node, NodeTypes } from "reactflow"

export const nodeTypes: NodeTypes = {
    linearGauge: LinearGaugeNode
}

export const PIDNodes: Node[] = [
    {
        id: "lGauge",
        type: "linearGauge",
        position: { x: 100, y: 200 },
        data: {}
    }
]