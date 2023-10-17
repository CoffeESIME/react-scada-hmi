import { MarkerType } from "reactflow";

export const initialEdges = [
    {
        id: "processLine1",
        source: "valve1",
        target: "valve2",
        targetHandle: "ConnectLeft",
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
        sourceHandle: "ConnectTop",
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
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
        sourceHandle: "ConnectTop",
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
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
        sourceHandle: "ConnectTop",
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
        },
    },
    {
        id: "processLine8",
        source: "valve3",
        target: "valve4",
        targetHandle: "ConnectLeft",
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
        },
    },
    {
        id: "processLine9",
        source: "valve5",
        target: "valve6",
        targetHandle: "ConnectLeft",
        style: {
            strokeWidth: 3,
            stroke: "A0A0A4",
        },
    },

]