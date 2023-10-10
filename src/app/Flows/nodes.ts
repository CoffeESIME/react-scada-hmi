import  LinearGaugeNode  from "../components/LinearGauge/LinearGaugeNode"
import  TankNode  from "../components/Tank/TankNode"
import { DataTrendNode } from "../components/DataTrend/DataTrendNode"
import MotorNode from "../components/Motors/MotorNode"
import ValveNode from "../components/Valves/ValveNode"
import { CardDataNode } from "../components/CardData/CardDataNode"
import { Node, NodeTypes } from "reactflow"

export const nodeTypes: NodeTypes = {
    linearGauge: LinearGaugeNode,
    tank: TankNode,
    dataTrendLine: DataTrendNode,
    motor: MotorNode,
    valve: ValveNode,
    card: CardDataNode

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
    {
        id: "motorFan",
        type: "motor",
        position: { x: 100, y: 50 },
        data: {},
    },
    {
        id: "valve1",
        type: "valve",
        position: { x: 200, y: 100 },
        data: {valveType: 'round', rotation: 0},
    },
    {
        id: "buttonCard1",
        type: "card",
        position: { x: 100, y: 400 },
        data: {info: 'card'},
    },
    {
        id: "buttonCard2",
        type: "card",
        position: { x: 200, y: 400 },
        data: {info: 'card'},
    },
    {
        id: "buttonCard3",
        type: "card",
        position: { x: 300, y: 400 },
        data: {info: 'card'},
    },
    {
        id: "buttonCard4",
        type: "card",
        position: { x: 400, y: 400 },
        data: {info: 'card'},
    },
    {
        id: "buttonCard5",
        type: "card",
        position: { x: 500, y: 400 },
        data: {info: 'card'},
    },
    {
        id: "buttonCard6",
        type: "card",
        position: { x: 600, y: 400 },
        data: {info: 'card'},
    },
]