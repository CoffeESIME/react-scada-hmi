import LinearGaugeNode from "../components/LinearGauge/LinearGaugeNode"
import TankNode from "../components/Tank/TankNode"
import { DataTrendNode } from "../components/DataTrend/DataTrendNode"
import MotorNode from "../components/Motors/MotorNode"
import ValveNode from "../components/Valves/ValveNode"
import { CardDataNode } from "../components/CardData/CardDataNode"
import { ControlDataCardNode } from "../components/ControlDataCard/ControlDataCardNode"
import { Node, NodeTypes } from "reactflow";


export const nodeTypes: NodeTypes = {
    linearGauge: LinearGaugeNode,
    tank: TankNode,
    dataTrendLine: DataTrendNode,
    motor: MotorNode,
    valve: ValveNode,
    card: CardDataNode,
    controlCard: ControlDataCardNode,

}

const dataTrends: Node[]=[
    {
        id: "dataTrend1",
        type: "dataTrendLine",
        position: { x: 0, y: 50 },
        data: {},
        parentNode: "tank"
    },
    {
        id: "dataTrend2",
        type: "dataTrendLine",
        position: { x: 0, y: 190 },
        data: {},
        parentNode: "tank"
    },
    {
        id: "dataTrend3",
        type: "dataTrendLine",
        position: { x: 10, y: 100 },
        data: {},
    },
    {
        id: "dataTrend4",
        type: "dataTrendLine",
        position: { x: 10, y: 300 },
        data: {},
    },
    {
        id: "dataTrend5",
        type: "dataTrendLine",
        position: { x: 10, y: 500 },
        data: {},
    },
    {
        id: "dataTrend6",
        type: "dataTrendLine",
        position: { x: 500, y: 500 },
        data: {},
    },
]

const navButtons: Node[] = [
    {
        id: "buttonCard1",
        type: "card",
        position: { x: 10, y: 1000 },
        data: { label: ['Main', "Menu"] },
    },
    {
        id: "buttonCard2",
        type: "card",
        position: { x: 130, y: 1000 },
        data: { label: ['Level 1', "Reaction", "Overview"] },
    },
    {
        id: "buttonCard3",
        type: "card",
        position: { x: 250, y: 1000 },
        data: { label: ['Trend', "Control"] },
    },
    {
        id: "buttonCard4",
        type: "card",
        position: { x: 370, y: 1000 },
        data: { label: ['Feed', "System"] },
    },
    {
        id: "buttonCard5",
        type: "card",
        position: { x: 490, y: 1000 },
        data: { label: ['Product', "Recovery"] },
    },
    {
        id: "buttonCard6",
        type: "card",
        position: { x: 610, y: 1000 },
        data: { label: ['M5', "Startup", "Overlay"] },
    },
    {
        id: "buttonCard7",
        type: "card",
        position: { x: 730, y: 1000 },
        data: { label: ['M5', "Sequence", "Overlay"] },
    },
    {
        id: "buttonCard8",
        type: "card",
        position: { x: 850, y: 1000 },
        data: { label: ['- Level 3 -', "M5", "Interlocks"] },
    },
    {
        id: "buttonCard9",
        type: "card",
        position: { x: 970, y: 1000 },
        data: { label: ['- Level 3 -', "Cooling", "System"] },
    },
]

const controlCards: Node[] = [
    {
        id: "controlCard1",
        type: "controlCard",
        position: { x: 800, y: 500 },
        data: {
            title: "Main Feed",
            processVariableValue: 78.8,
            processVariable: 'MPH',
            setPoint: 76,
            output: 88.5,
            mode: "AUTO"
        },
    },
    {
        id: "controlCard2",
        type: "controlCard",
        position: { x: 700, y: 500 },
        data: {
            title: "Additive 1",
            processVariableValue: 11.9,
            processVariable: 'MPH',
            setPoint: 12,
            output: 22.3,
            mode: "AUTO"
        },
    },
    {
        id: "controlCard3",
        type: "controlCard",
        position: { x: 600, y: 500 },
        data: {
            title: "Additive 2",
            processVariableValue: 4.0,
            processVariable: 'MPH',
            setPoint: 4.0,
            output: 44.3,
            mode: "AUTO"
        },
    },
    {
        id: "controlCard4",
        type: "controlCard",
        position: { x: 500, y: 500 },
        data: {
            title: "M5 Pressure",
            processVariableValue: 98.0,
            processVariable: 'psg',
            setPoint: 95.0,
            output: 44.3,
            mode: "AUTO"
        },
    },
    {
        id: "controlCard5",
        type: "controlCard",
        position: { x: 400, y: 500 },
        data: {
            title: "M5 Level %",
            processVariableValue: 71.0,
            processVariable: '%',
            setPoint: 70.0,
            output: 54.3,
            mode: "AUTO"
        },
    },
    {
        id: "controlCard6",
        type: "controlCard",
        position: { x: 400, y: 500 },
        data: {
            title: "M5 Temp",
            processVariableValue: 45.0,
            processVariable: '°C',
            setPoint: 45.0,
            output: 54.3,
            mode: "AUTO"
        },
    },
]

const valves : Node[] =[
    {
        id: "valve1",
        type: "valve",
        position: { x: 100, y: 100 },
        data: { valveType: 'round', rotation: 0 },
    },
    {
        id: "valve2",
        type: "valve",
        position: { x: 200, y: 100 },
        data: { valveType: 'rect', rotation: 0 },
    },
    {
        id: "valve3",
        type: "valve",
        position: { x: 100, y: 400 },
        data: { valveType: 'round', rotation: 0 },
    },
    {
        id: "valve4",
        type: "valve",
        position: { x: 200, y: 400 },
        data: { valveType: 'rect', rotation: 0 },
    },
    {
        id: "valve5",
        type: "valve",
        position: { x: 100, y: 700 },
        data: { valveType: 'round', rotation: 0 },
    },
    {
        id: "valve6",
        type: "valve",
        position: { x: 200, y: 700 },
        data: { valveType: 'round', rotation: 0 },
    },
    {
        id: "valve7",
        type: "valve",
        position: { x: 700, y: 700 },
        data: { valveType: 'round', rotation: 90 },
    },
    {
        id: "valve8",
        type: "valve",
        position: { x: 800, y: 600 },
        data: { valveType: 'round', rotation: 90 },
    },
    {
        id: "valve9",
        type: "valve",
        position: { x: 700, y: 100 },
        data: { valveType: 'round', rotation: 180 },
    },
    {
        id: "valve10",
        type: "valve",
        position: { x: 1000, y: 600 },
        data: { valveType: 'round', rotation: 0 },
    },
]

export const PIDNodes: Node[] = [
    ... dataTrends,
    ...navButtons,
    ...controlCards,
    ...valves,
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
        id: "motorFan",
        type: "motor",
        position: { x: 500, y: 500 },
        data: {},
    },

    
    
]