import LinearGaugeNode from "../components/LinearGauge/LinearGaugeNode"
import TankNode from "../components/Tank/TankNode"
import { DataTrendNode } from "../components/DataTrend/DataTrendNode"
import MotorNode from "../components/Motors/MotorNode"
import ValveNode from "../components/Valves/ValveNode"
import { CardDataNode } from "../components/CardData/CardDataNode"
import { ControlDataCardNode } from "../components/ControlDataCard/ControlDataCardNode"
import { BoxCardNode } from "../components/Boxes/BoxNode"
import { Node, NodeTypes, Position } from "reactflow";
import { thresholdsStyle } from "../components/LinearGauge/LinearGauge.style"
import { AlarmNode } from "../components/Alarm/AlarmNode"

export const nodeTypes: NodeTypes = {
    linearGauge: LinearGaugeNode,
    tank: TankNode,
    dataTrendLine: DataTrendNode,
    motor: MotorNode,
    valve: ValveNode,
    card: CardDataNode,
    controlCard: ControlDataCardNode,
    box: BoxCardNode,
    alarm: AlarmNode,
}

const alarms = [
    {
        id: "alarm1",
        type: "alarm",
        position: { x: -15, y: -5 },
        data: { isActive: true, type: "MEDIUM" },
        parentNode: "lGauge2"
    }
]

const dataTrends: Node[] = [
    {
        id: "dataTrend1",
        type: "dataTrendLine",
        position: { x: 2, y: 70 },
        data: {
            dataPoints: [34.1010101, 35.31313131, 32.88888889, 36.72847734, 32.09469669,
                34.68095356, 38.29900334, 39.19730021, 33.75597923, 36.48939697,
                38.83508672, 32.78889951, 32.72727273, 36.49364072, 32.48145158,
                33.85858586, 35.7067179, 32.03100171, 39.30910598, 36.18070242,
                39.99938861, 32.80808081, 34.67018852, 35.39393939, 32.56565657,
                32.5301124, 34.82828283, 33.6969697, 37.42221893, 37.1137505,
                38.09142015, 36.04040404, 35.18347564, 32.24242424, 37.25252525,
                32.96969697, 39.80656094, 35.96216828, 32.8930669, 35.7979798,
                36.13338152, 34.46911147, 38.95337239, 39.77759942, 33.33549892,
                34.71618197, 36.72847734, 37.8833916, 35.37166465, 33.43345556,
                33.14414302, 37.52849639, 39.64371973, 34.08284943, 34.68095356,
                33.97920562, 37.50932246, 39.57712183, 34.25672033, 37.5869094,
                38.09142015, 37.07470128, 39.76379943, 36.00640661],
            setPoint: 36,
            limitBottom: 32,
            limitTop: 40,
            yAxis: {
                min: 32,
                max: 40,
            },
            xAxis: {
                min: 0,
                max: 100
            },
            title: "Analysis: Purity %"
        },
        parentNode: "tank"
    },
    {
        id: "dataTrend2",
        type: "dataTrendLine",
        position: { x: 2, y: 220 },
        data: {
            dataPoints: [5.248819651202467, 5.296915953553224, 4.779436919774891, 5.663619325834442, 5.68767133897909, 5.529689852929465, 5.688100046214597, 5.4785062275756795, 5.742311188491531, 5.738698904788015, 5.8125764902659665, 5.928097273740872, 5.2905637004605195, 4.966901584157109, 4.556842678684144, 5.681879514307574, 4.3316514575198655, 4.86104702792404, 4.843411333044294, 5.72915574507101, 5.685878306859603, 4.577275563858546, 5.720329531668408, 5.832220661448421, 4.221045029144385, 5.416798603981109, 5.001000563439714, 4.3376510867163365, 5.841831705793335, 4.716184071082504, 5.554617762163663, 5.119214071042215, 5.333505302171452, 5.217826142357074, 4.463284894322672, 5.908174355815123, 4.970837410923094, 5.660529343273655, 5.49],
            setPoint: 5,
            limitBottom: 4,
            limitTop: 6,
            yAxis: {
                min: 4,
                max: 6,
            },
            xAxis: {
                min: 0,
                max: 100
            },
            title: "Analysis: Inhibitor Concentration %"
        },
        parentNode: "tank"
    },
    {
        id: "dataTrend3",
        type: "dataTrendLine",
        position: { x: 10, y: 150 },
        data: {
            dataPoints: [5.248819651202467, 5.296915953553224, 4.779436919774891, 5.663619325834442, 5.68767133897909, 5.529689852929465, 5.688100046214597, 5.4785062275756795, 5.742311188491531, 5.738698904788015, 5.8125764902659665, 5.928097273740872, 5.2905637004605195, 4.966901584157109, 4.556842678684144, 5.681879514307574, 4.3316514575198655, 4.86104702792404, 4.843411333044294, 5.72915574507101, 5.685878306859603, 4.577275563858546, 5.720329531668408, 5.832220661448421, 4.221045029144385, 5.416798603981109, 5.001000563439714, 4.3376510867163365, 5.841831705793335, 4.716184071082504, 5.554617762163663, 5.119214071042215, 5.333505302171452, 5.217826142357074, 4.463284894322672, 5.908174355815123, 4.970837410923094, 5.660529343273655, 5.49],
            setPoint: 5,
            limitBottom: 4,
            limitTop: 6,
            yAxis: {
                min: 4,
                max: 6,
            },
            xAxis: {
                min: 0,
                max: 100
            },
            title: "Main Feed MPH"
        },
    },
    {
        id: "dataTrend4",
        type: "dataTrendLine",
        position: { x: 10, y: 420 },
        data: {
            dataPoints: [5.248819651202467, 5.296915953553224, 4.779436919774891, 5.663619325834442, 5.68767133897909, 5.529689852929465, 5.688100046214597, 5.4785062275756795, 5.742311188491531, 5.738698904788015, 5.8125764902659665, 5.928097273740872, 5.2905637004605195, 4.966901584157109, 4.556842678684144, 5.681879514307574, 4.3316514575198655, 4.86104702792404, 4.843411333044294, 5.72915574507101, 5.685878306859603, 4.577275563858546, 5.720329531668408, 5.832220661448421, 4.221045029144385, 5.416798603981109, 5.001000563439714, 4.3376510867163365, 5.841831705793335, 4.716184071082504, 5.554617762163663, 5.119214071042215, 5.333505302171452, 5.217826142357074, 4.463284894322672, 5.908174355815123, 4.970837410923094, 5.660529343273655, 5.49],
            setPoint: 5,
            limitBottom: 4,
            limitTop: 6,
            yAxis: {
                min: 4,
                max: 6,
            },
            xAxis: {
                min: 0,
                max: 100
            },
            title: "Additive 1 MPH"
        },
    },
    {
        id: "dataTrend5",
        type: "dataTrendLine",
        position: { x: 10, y: 690 },
        data: {
            dataPoints: [5.248819651202467, 5.296915953553224, 4.779436919774891, 5.663619325834442, 5.68767133897909, 5.529689852929465, 5.688100046214597, 5.4785062275756795, 5.742311188491531, 5.738698904788015, 5.8125764902659665, 5.928097273740872, 5.2905637004605195, 4.966901584157109, 4.556842678684144, 5.681879514307574, 4.3316514575198655, 4.86104702792404, 4.843411333044294, 5.72915574507101, 5.685878306859603, 4.577275563858546, 5.720329531668408, 5.832220661448421, 4.221045029144385, 5.416798603981109, 5.001000563439714, 4.3376510867163365, 5.841831705793335, 4.716184071082504, 5.554617762163663, 5.119214071042215, 5.333505302171452, 5.217826142357074, 4.463284894322672, 5.908174355815123, 4.970837410923094, 5.660529343273655, 5.49],
            setPoint: 5,
            limitBottom: 4,
            limitTop: 6,
            yAxis: {
                min: 4,
                max: 6,
            },
            xAxis: {
                min: 0,
                max: 100
            }
        },
    },
    {
        id: "dataTrend6",
        type: "dataTrendLine",
        position: { x: 900, y: 670 },
        data: {
            dataPoints: [5.248819651202467, 5.296915953553224, 4.779436919774891, 5.663619325834442, 5.68767133897909, 5.529689852929465, 5.688100046214597, 5.4785062275756795, 5.742311188491531, 5.738698904788015, 5.8125764902659665, 5.928097273740872, 5.2905637004605195, 4.966901584157109, 4.556842678684144, 5.681879514307574, 4.3316514575198655, 4.86104702792404, 4.843411333044294, 5.72915574507101, 5.685878306859603, 4.577275563858546, 5.720329531668408, 5.832220661448421, 4.221045029144385, 5.416798603981109, 5.001000563439714, 4.3376510867163365, 5.841831705793335, 4.716184071082504, 5.554617762163663, 5.119214071042215, 5.333505302171452, 5.217826142357074, 4.463284894322672, 5.908174355815123, 4.970837410923094, 5.660529343273655, 5.49],
            setPoint: 5,
            limitBottom: 4,
            limitTop: 6,
            yAxis: {
                min: 4,
                max: 6,
            },
            xAxis: {
                min: 0,
                max: 100
            }
        },
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
            mode: "AUTO",
            handleDataSource: {
                position: Position.Left,
                id: "card1handleSource",
                style: {
                    top: 90,
                    bottom: 100,
                    left: 100,
                    right: 100
                }
            },
            handleDataTarget: {
                position: Position.Left,
                id: "card1handleDataTarget",
                style: {
                    top: 21,
                    bottom: 100,
                    left: 100,
                    right: 100,
                }
            },
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
            mode: "AUTO",
            handleDataSource: {
                position: Position.Left,
                id: "card2handleSource",
                style: {
                    top: 90,
                    bottom: 100,
                    left: 100,
                    right: 100
                }
            },
            handleDataTarget: {
                position: Position.Left,
                id: "card2handleDataTarget",
                style: {
                    top: 21,
                    bottom: 100,
                    left: 100,
                    right: 100,
                }
            },
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
            mode: "AUTO",
            handleDataSource: {
                position: Position.Left,
                id: "card3handleSource",
                style: {
                    top: 90,
                    bottom: 100,
                    left: 100,
                    right: 100
                }
            },
            handleDataTarget: {
                position: Position.Left,
                id: "card3handleDataTarget",
                style: {
                    top: 21,
                    bottom: 100,
                    left: 100,
                    right: 100,
                }
            },
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
            mode: "AUTO",
            handleDataSource: {
                position: Position.Left,
                id: "card4handleSource",
                style: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                }
            },
            handleDataTarget: {
                position: Position.Left,
                id: "card4handleDataTarget",
                style: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                }
            },
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
            mode: "AUTO",
            handleDataSource: {
                position: Position.Left,
                id: "card5handleSource",
                style: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                }
            },
            handleDataTarget: {
                position: Position.Left,
                id: "card5handleDataTarget",
                style: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                }
            },
        },
    },
    {
        id: "controlCard6",
        type: "controlCard",
        position: { x: 750, y: 650 },
        data: {
            title: "M5 Temp",
            processVariableValue: 45.0,
            processVariable: '°C',
            setPoint: 45.0,
            output: 54.3,
            mode: "AUTO",
            handleDataSource: {
                position: Position.Left,
                id: "card6handleSource",
                style: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                }
            },
            handleDataTarget: {
                position: Position.Left,
                id: "card6handleDataTarget",
                style: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                }
            },
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
    {
        id: "lGauge6",
        type: "linearGauge",
        position: { x: 305, y: 85 },
        data: {
            value: 30, alarmStatus: false, thresholds: thresholdsStyle([
                { max: -30, classColor: "", identifier: "Normal" },
                { max: -20, classColor: "", identifier: "High Priority Alarm" },
                { max: -10, classColor: "", identifier: "Medium Priority Alarm" },
                { max: 70, classColor: "", identifier: "Normal" },
                { max: 90, classColor: "", identifier: "Medium Priority Alarm" },
                { max: 100, classColor: "", identifier: "High Priority Alarm" },
            ], false),
            units: 'lt',
            height: 280,
            bottom: 10
        },
        parentNode: 'tank'
    },
]

export const PIDNodes: Node[] = [
    ...dataTrends,
    ...navButtons,
    ...controlCards,
    ...valves,
    ...gauges,
    ...alarms,
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