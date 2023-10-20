import { create } from 'zustand';
import { Node } from "reactflow";
import { PIDNodes, PIDNodesAlarm } from '../Flows/nodes';
type State = {
    nodes: Node[];
}

type Actions = {
    updateAlarmsOn: () => void,
    updateAlarmsOff: () => void
}
export const useNodeStore = create<State & Actions>((set, get) => {
    return {
        nodes: [],
        updateAlarmsOn: () => set(() => ({ nodes: PIDNodesAlarm })),
        updateAlarmsOff: () => set(() => ({ nodes: PIDNodes }))
    }
})