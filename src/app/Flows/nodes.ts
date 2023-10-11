import LinearGaugeNode from "../components/LinearGauge/LinearGaugeNode"
import TankNode from "../components/Tank/TankNode"
import { DataTrendNode } from "../components/DataTrend/DataTrendNode"
import MotorNode from "../components/Motors/MotorNode"
import ValveNode from "../components/Valves/ValveNode"
import { CardDataNode } from "../components/CardData/CardDataNode"
import { ControlDataCardNode } from "../components/ControlDataCard/ControlDataCardNode"
import { BoxCardNode } from "../components/Boxes/BoxNode"
import { Node, NodeTypes } from "reactflow";
import { thresholdsStyle } from "../components/LinearGauge/LinearGauge.style"

export const nodeTypes: NodeTypes = {
    linearGauge: LinearGaugeNode,
    tank: TankNode,
    dataTrendLine: DataTrendNode,
    motor: MotorNode,
    valve: ValveNode,
    card: CardDataNode,
    controlCard: ControlDataCardNode,
    box: BoxCardNode,
}

const dataTrends: Node[] = [
    {
        id: "dataTrend1",
        type: "dataTrendLine",
        position: { x: 15, y: 70 },
        data: {},
        parentNode: "tank"
    },
    {
        id: "dataTrend2",
        type: "dataTrendLine",
        position: { x: 15, y: 220 },
        data: {},
        parentNode: "tank"
    },
    {
        id: "dataTrend3",
        type: "dataTrendLine",
        position: { x: 10, y: 150 },
        data: {},
    },
    {
        id: "dataTrend4",
        type: "dataTrendLine",
        position: { x: 10, y: 420 },
        data: {},
    },
    {
        id: "dataTrend5",
        type: "dataTrendLine",
        position: { x: 10, y: 690 },
        data: {},
    },
    {
        id: "dataTrend6",
        type: "dataTrendLine",
        position: { x: 800, y: 670 },
        data: {},
    },
]

const navButtons: Node[] = [
    {
        id: "buttonCard1",
        type: "card",
        position: { x: 30, y: 900 },
        data: { label: ['Main', "Menu"] },
    },
    {
        id: "buttonCard2",
        type: "card",
        position: { x: 160, y: 900 },
        data: { label: ['Level 1', "Reaction", "Overview"] },
    },
    {
        id: "buttonCard3",
        type: "card",
        position: { x: 290, y: 900 },
        data: { label: ['Trend', "Control"] },
    },
    {
        id: "buttonCard4",
        type: "card",
        position: { x: 420, y: 900 },
        data: { label: ['Feed', "System"] },
    },
    {
        id: "buttonCard5",
        type: "card",
        position: { x: 550, y: 900 },
        data: { label: ['Product', "Recovery"] },
    },
    {
        id: "buttonCard6",
        type: "card",
        position: { x: 680, y: 900 },
        data: { label: ['M5', "Startup", "Overlay"] },
    },
    {
        id: "buttonCard7",
        type: "card",
        position: { x: 810, y: 900 },
        data: { label: ['M5', "Sequence", "Overlay"] },
    },
    {
        id: "buttonCard8",
        type: "card",
        position: { x: 940, y: 900 },
        data: { label: ['- Level 3 -', "M5", "Interlocks"] },
    },
    {
        id: "buttonCard9",
        type: "card",
        position: { x: 1070, y: 900 },
        data: { label: ['- Level 3 -', "Cooling", "System"] },
    },
]

const controlCards: Node[] = [
    {
        id: "controlCard1",
        type: "controlCard",
        position: { x: 30, y: 50 },
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
        position: { x: 30, y: 320 },
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
        position: { x: 30, y: 590 },
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
        position: { x: 850, y: 150 },
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
        position: { x: 850, y: 300 },
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
        position: { x: 900, y: 850 },
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

const valves: Node[] = [
    {
        id: "valve1",
        type: "valve",
        position: { x: 200, y: 100 },
        data: { valveType: 'round', rotation: 0 },
    },
    {
        id: "valve2",
        type: "valve",
        position: { x: 300, y: 100 },
        data: { valveType: 'rect', rotation: 0 },
    },
    {
        id: "valve3",
        type: "valve",
        position: { x: 200, y: 370 },
        data: { valveType: 'round', rotation: 0 },
    },
    {
        id: "valve4",
        type: "valve",
        position: { x: 300, y: 370 },
        data: { valveType: 'rect', rotation: 0 },
    },
    {
        id: "valve5",
        type: "valve",
        position: { x: 200, y: 640 },
        data: { valveType: 'round', rotation: 0 },
    },
    {
        id: "valve6",
        type: "valve",
        position: { x: 300, y: 640 },
        data: { valveType: 'rect', rotation: 0 },
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
        position: { x: 800, y: 50 },
        data: { valveType: 'round', rotation: 180 },
    },
    {
        id: "valve10",
        type: "valve",
        position: { x: 1000, y: 600 },
        data: { valveType: 'round', rotation: 0 },
    },
]
const gauges = [
    {
        id: "lGauge1",
        type: "linearGauge",
        position: { x: 15, y: 20 },
        data: {
            value: 30, alarmStatus: false, thresholds: thresholdsStyle([
                { max: -30, classColor: "", identifier: "Normal" },
                { max: -20, classColor: "", identifier: "High Priority Alarm" },
                { max: -10, classColor: "", identifier: "Medium Priority Alarm" },
                { max: 70, classColor: "", identifier: "Normal" },
                { max: 90, classColor: "", identifier: "Medium Priority Alarm" },
                { max: 100, classColor: "", identifier: "High Priority Alarm" },
            ], false),
            units: 'mt'
        },
        parentNode: 'boxLinearGauges'
    },
    {
        id: "lGauge2",
        type: "linearGauge",
        position: { x: 80, y: 20 },
        data: {
            value: 10, alarmStatus: false, thresholds: thresholdsStyle([
                { max: 0, classColor: "", identifier: "Normal" },
                { max: 10, classColor: "", identifier: "High Priority Alarm" },
                { max: 30, classColor: "", identifier: "Medium Priority Alarm" },
                { max: 70, classColor: "", identifier: "Normal" },
                { max: 80, classColor: "", identifier: "Medium Priority Alarm" },
                { max: 100, classColor: "", identifier: "High Priority Alarm" },
            ], true),
            units: 'lt/s'
        },
        parentNode: 'boxLinearGauges'
    },
    {
        id: "lGauge3",
        type: "linearGauge",
        position: { x: 145, y: 20 },
        data: {
            value: 30, alarmStatus: false, thresholds: thresholdsStyle([
                { max: -30, classColor: "", identifier: "Normal" },
                { max: -20, classColor: "", identifier: "High Priority Alarm" },
                { max: -10, classColor: "", identifier: "Medium Priority Alarm" },
                { max: 70, classColor: "", identifier: "Normal" },
                { max: 90, classColor: "", identifier: "Medium Priority Alarm" },
                { max: 100, classColor: "", identifier: "High Priority Alarm" },
            ], false),
            units: 'mt'
        },
        parentNode: 'boxLinearGauges'
    },
    {
        id: "lGauge4",
        type: "linearGauge",
        position: { x: 210, y: 20 },
        data: {
            value: 30, alarmStatus: false, thresholds: thresholdsStyle([
                { max: -30, classColor: "", identifier: "Normal" },
                { max: -20, classColor: "", identifier: "High Priority Alarm" },
                { max: -10, classColor: "", identifier: "Medium Priority Alarm" },
                { max: 70, classColor: "", identifier: "Normal" },
                { max: 90, classColor: "", identifier: "Medium Priority Alarm" },
                { max: 100, classColor: "", identifier: "High Priority Alarm" },
            ], false),
            units: 'mt'
        },
        parentNode: 'boxLinearGauges'
    },
    {
        id: "lGauge5",
        type: "linearGauge",
        position: { x: 275, y: 20 },
        data: {
            value: 30, alarmStatus: false, thresholds: thresholdsStyle([
                { max: -30, classColor: "", identifier: "Normal" },
                { max: -20, classColor: "", identifier: "High Priority Alarm" },
                { max: -10, classColor: "", identifier: "Medium Priority Alarm" },
                { max: 70, classColor: "", identifier: "Normal" },
                { max: 90, classColor: "", identifier: "Medium Priority Alarm" },
                { max: 100, classColor: "", identifier: "High Priority Alarm" },
            ], false),
            units: 'mt'
        },
        parentNode: 'boxLinearGauges'
    },
]

export const PIDNodes: Node[] = [
    ...dataTrends,
    ...navButtons,
    ...controlCards,
    ...valves,
    ...gauges,
    {
        id: "tank",
        type: "tank",
        position: { x: 450, y: 40 },
        data: {}
    },
    {
        id: "motorFan",
        type: "motor",
        position: { x: 800, y: 480 },
        data: {},
    },
    {
        id: "boxLinearGauges",
        type: "box",
        position: { x: 400, y: 480 },
        data: {},
    },
]