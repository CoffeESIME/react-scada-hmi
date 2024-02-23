import { create } from 'zustand';
import { Node } from 'reactflow';
import * as mqtt from 'mqtt';
interface State {
  nodes: Node[];
}

interface Actions {
  updateNode: (id: string, data: any) => void;
  setNodes: (nodes: Node[]) => void;
  mqttClient: any;
  connectMQTT: any;
  disconnectMQTT: any;
}
export const useNodeStore = create<State & Actions>((set, get) => {
  return {
    nodes: [],
    mqttClient: null,
    connectMQTT: () => {
      const client = mqtt.connect(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `mqtt://${process.env.NEXT_PUBLIC_MQTT_URL}`,
        { protocol: 'ws' }
      );

      client.on('connect', () => {
        console.log('Connected to MQTT Broker');
        client.subscribe('controlCard2'); // Subscribe to the relevant topic(s)
      });
      client.on('message', (topic, message) => {
        // Logic to update nodes based on the received message
        console.log(`Received message on ${topic}: ${message.toString()}`);
        if (topic === 'controlCard2') {
          console.log('message updated################################');
          const newData = {
            processVariableValue: parseFloat(message.toString()),
          };
          get().updateNode(topic, newData);
        }
      });

      set({ mqttClient: client });
    },

    disconnectMQTT: () => {
      get().mqttClient?.end();
      set({ mqttClient: null });
    },
    setNodes: (nodes) => set(() => ({ nodes })),
    updateNode: (nodeId, newData) =>
      set((state) => ({
        nodes: state.nodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...newData } }
            : node
        ),
      })),
  };
});
