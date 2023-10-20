import { MarkerType } from "reactflow";

export const initialEdges = [
    {
        id: "processLine1",
        source: "valve1",
        target: "valve2",
        targetHandle: "valve_2_target_1",
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
        },
    },
    {
        id: "processLine2",
        source: "controlCard1",
        target: "valve1",
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
        },
    },
    {
        id: "processLine3",
        source: "valve1",
        target: "controlCard1",
        type: 'smoothstep',
        targetHandle: "card1handleDataTarget",
        sourceHandle: "valve_1_source_2",
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
            strokeDasharray: "5,5"
        },
    },
    {
        id: "processLine4",
        source: "controlCard2",
        target: "valve3",
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
        },
    },
    {
        id: "processLine5",
        source: "valve3",
        target: "controlCard2",
        type: 'smoothstep',
        targetHandle: "card2handleDataTarget",
        sourceHandle: "valve_3_source_2",
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
            strokeDasharray: "5,5"
        },
    },
    {
        id: "processLine6",
        source: "controlCard3",
        target: "valve5",
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
        },
    },
    {
        id: "processLine7",
        source: "valve5",
        target: "controlCard3",
        type: 'smoothstep',
        targetHandle: "card3handleDataTarget",
        sourceHandle: "valve_5_source_2",
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
            strokeDasharray: "5,5"
        },
    },
    {
        id: "processLine8",
        source: "valve3",
        target: "valve4",
        targetHandle: "valve_3_target_1",
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
        },
    },
    {
        id: "processLine9",
        source: "valve5",
        target: "valve6",
        targetHandle: "valve_6_target_1",
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
        },
    },
    {
        id: "processLine10",
        source: "valve2",
        target: "tank",
        targetHandle: "tankTarget1",
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
        },
        markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        zIndex: -40,
    },
    {
        id: "processLine11",
        source: "valve4",
        target: "tank",
        targetHandle: "tankTarget2",
        markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
        },
    },
    {
        id: "processLine12",
        source: "valve6",
        target: "tank",
        targetHandle: "tankTarget3",
        type: 'smoothstep',
        markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
        },
    },
    {
        id: "processLine13",
        source: "tank",
        target: "valve7",
        targetHandle: "valve_7_target_2",
        type: 'smoothstep',
        markerStart: {
            type: MarkerType.ArrowClosed,
          },
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
        },
    },
    {
        id: "processLine14",
        source: "valve7",
        target: "label1",
        type: 'smoothstep',
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
        },
    },
    {
        id: "processLine15",
        source: "tank",
        target: "motorFan",
        sourceHandle: "tankTarget5",
        type: 'smoothstep',
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
        },
    },
    {
        id: "processLine17",
        source: "motorFan",
        target: "valve10",
        type: 'smoothstep',
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
        },
    },
    {
        id: "processLine16",
        source: "valve10",
        target: "label3",
        type: 'smoothstep',
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
        },
    },
    {
        id: "processLine18",
        source: "valve10",
        target: "label3",
        type: 'smoothstep',
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
        },
    },
    {
        id: "processLine28",
        source: "motorFan",
        target: "valve8",
        targetHandle: "valve_8_target_2",
        type: 'smoothstep',
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
        },
    },
    {
        id: "processLine27",
        source: "valve8",
        target: "tank",
        targetHandle: "tankTarget6",
        sourceHandle: "valve_8_source_2",
        type: 'smoothstep',
        markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
        },
    },
    {
        id: "processLine19",
        source: "valve8",
        target: "valve10",
        targetHandle: "valve_10_target_2",
        sourceHandle: "valve_8_source_1",
        type: 'smoothstep',
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
            strokeDasharray: "5,5"
        },
    },
    {
        id: "processLine20",
        source: "controlCard6",
        target: "valve7",
        targetHandle: "valve_7_target_1",
        type: 'smoothstep',
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
            strokeDasharray: "5,5"
        },
    },
    {
        id: "processLine21",
        source: "controlCard5",
        target: "valve10",
        targetHandle: "valve_10_target_2",
        type: 'smoothstep',
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
            strokeDasharray: "5,5"
        },
    },
    {
        id: "processLine22",
        source: "tank",
        target: "controlCard5",
        sourceHandle: "tankSource6",
        type: 'smoothstep',
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
            strokeDasharray: "5,5"
        },
    },
    {
        id: "processLine23",
        source: "tank",
        target: "valve9",
        type: 'smoothstep',
        sourceHandle: "tankSource5",
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
        },
    },
    {
        id: "processLine24",
        source: "controlCard4",
        target: "valve9",
        type: 'smoothstep',
        targetHandle: "valve_9_target_2",
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
            strokeDasharray: "5,5"
        },
    },
    {
        id: "processLine25",
        source: "tank",
        target: "controlCard4",
        type: 'smoothstep',
        sourceHandle: "tankSource7",
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
            strokeDasharray: "5,5"
        },
    },
    {
        id: "processLine26",
        source: "valve9",
        target: "label2",
        type: 'smoothstep',
        targetHandle: "valve_9_source_1",
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
        },
    },
]