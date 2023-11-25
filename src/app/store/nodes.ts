import { create } from 'zustand';
import { Node } from 'reactflow';
import { PIDNodes, PIDNodesAlarm } from '../Flows/nodes';
interface State {
  nodes: Node[];
}

interface Actions {
  updateAlarmsOn: () => void;
  updateAlarmsOff: () => void;
}
export const useNodeStore = create<State & Actions>((set, get) => {
  return {
    nodes: [],
    updateAlarmsOn: () => set(() => ({ nodes: PIDNodesAlarm })),
    updateAlarmsOff: () => set(() => ({ nodes: PIDNodes })),
    setNodes: (nodes) => set(() => ({ nodes: PIDNodes })),
    updateNode: (updatedNode) =>
      set((state) => ({
        nodes: state.nodes.map((node) =>
          node.id === updatedNode.id ? updatedNode : node
        ),
      })),
  };
});
