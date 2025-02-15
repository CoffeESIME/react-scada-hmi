'use client';

import React, {
  useCallback,
  useState,
  CSSProperties,
  ChangeEvent,
  useEffect,
  useMemo,
} from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  Connection,
  Edge,
  Node,
  NodeTypes,
  Handle,
  Position,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

// 1) IMPORTA TUS COMPONENTES CUSTOM
import MotorNode from '@/app/components/Motors/MotorNode';
import ValveNode from '@/app/components/Valves/ValveNode';
import LinearGaugeNode from '@/app/components/LinearGauge/LinearGaugeNode';
import { AlarmNode } from '@/app/components/Alarm/AlarmNode';

// ---------------------------------------------------------------------
// 2) DEFINE NODETYPES FUERA DEL COMPONENTE (o usa useMemo())
//    para evitar el warning de React Flow
// ---------------------------------------------------------------------
const nodeTypes: NodeTypes = {
  motor: MotorNode,
  valve: ValveNode,
  gauge: LinearGaugeNode,
  alarm: AlarmNode,
};

// Si en algún momento necesitas edgeTypes custom, también defínelo afuera:
// const edgeTypes = {
//   customEdge: MyCustomEdge,
// };

// 1) DEFINE O IMPORTA AQUI
const availableNodeTypes = [
    { label: 'Motor', type: 'motor' },
    { label: 'Valve', type: 'valve' },
    { label: 'Gauge', type: 'gauge' },
    { label: 'Alarm', type: 'alarm' },
  ];
// ---------------------------------------------------------------------
// 3) ESTILOS (CON ALTO CONTRASTE O COMO PREFIERAS)
// ---------------------------------------------------------------------
const containerStyle: CSSProperties = {
  width: '100%',
  height: '80vh',
  border: '2px solid #444',
  display: 'flex',
  backgroundColor: '#222',
  color: '#f1f1f1',
  fontFamily: 'sans-serif',
};

const sideMenuStyle: CSSProperties = {
  width: '160px',
  backgroundColor: '#333',
  padding: '10px',
  borderRight: '2px solid #444',
};

const menuItemStyle: CSSProperties = {
  cursor: 'move',
  backgroundColor: '#444',
  marginBottom: '6px',
  padding: '8px',
  textAlign: 'center',
  border: '1px solid #666',
  color: '#fff',
};

const canvasStyle: CSSProperties = {
  flex: 1,
  backgroundColor: '#555',
};

const propertiesPanelStyle: CSSProperties = {
  width: '320px',
  backgroundColor: '#333',
  padding: '10px',
  borderLeft: '2px solid #444',
};

const headingStyle: CSSProperties = {
  fontSize: '1.2rem',
  marginBottom: '0.5rem',
};

const inputStyle: CSSProperties = {
  backgroundColor: '#444',
  color: '#fff',
  border: '1px solid #666',
  padding: '6px',
  marginBottom: '6px',
  width: '100%',
};

const selectStyle: CSSProperties = {
  ...inputStyle,
  padding: '6px',
};

function getDefaultDataForNode(nodeType: string) {
    switch (nodeType) {
      case 'motor':
        return {
          label: 'Motor Node',
          state: 'On',
          handles: [
            {
              type: 'target' as const,
              position: Position.Left,
              id: 'motorTarget1',
              style: { top: 20 },
            },
            {
              type: 'source' as const,
              position: Position.Right,
              id: 'motorSource1',
              style: { top: 20 },
            },
          ],
        };
      case 'valve':
        return {
          label: 'Valve Node',
          state: 'Open',
          rotation: 0,
          handles: [
            {
              type: 'target' as const,
              position: Position.Left,
              id: 'valve_1_target_1',
              style: { top: 30 },
            },
            {
              type: 'source' as const,
              position: Position.Right,
              id: 'valve_1_source_1',
              style: { top: 30 },
            },
            {
              type: 'source' as const,
              position: Position.Top,
              id: 'valve_1_source_2',
              style: { left: 10 },
            },
          ],
        };
      case 'gauge':
        return {
          label: 'Gauge Node',
          value: 50,
          setPoint: 60,
          handles: [
            {
              type: 'target' as const,
              position: Position.Left,
              id: 'gaugeTarget1',
              style: { top: 40 },
            },
          ],
        };
      case 'alarm':
        return {
          label: 'Alarm Node',
          isActive: true,
          type: 'HIGH',
          handles: [],
        };
      default:
        return { label: 'Custom Node', handles: [] };
    }
  }

// ---------------------------------------------------------------------
// 4) COMPONENTE PRINCIPAL
// ---------------------------------------------------------------------
export default function CreateHmiScreen(): React.ReactElement {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // OPCIONAL: si tuvieras edgeTypes custom:
  // const edgeTypes = useMemo(() => ({ customEdge: MyCustomEdge }), []);

  // ---------------------------------------------------------------------
  // 4.1) onConnect: al arrastrar un edge en el canvas
  // ---------------------------------------------------------------------
  const onConnect = useCallback(
    (params: Connection) => {
      console.log('[onConnect] Intentando conectar:', params);
      // params: { source, target, sourceHandle, targetHandle, ... }
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  // ---------------------------------------------------------------------
  // 4.2) onNodeClick: selecciona el nodo clicado
  // ---------------------------------------------------------------------
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      console.log('[onNodeClick] Nodo seleccionado:', node);
      setSelectedNode(node);
    },
    []
  );

  // ---------------------------------------------------------------------
  // 4.3) onNodesDelete: si borramos un nodo
  // ---------------------------------------------------------------------
  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      console.log('[onNodesDelete] Nodos borrados:', deleted);
      if (selectedNode && deleted.some((n) => n.id === selectedNode.id)) {
        setSelectedNode(null);
      }
    },
    [selectedNode]
  );

  // ---------------------------------------------------------------------
  // 4.4) onDragOver / onDrop: crear nodos al arrastrar desde el menú
  // ---------------------------------------------------------------------
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData('application/reactflow');
      if (!nodeType) return;

      const reactFlowBounds = (event.target as HTMLDivElement).getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode: Node = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position,
        data: getDefaultDataForNode(nodeType),
      };

      console.log('[onDrop] Creando nodo:', newNode);
      setNodes((nds) => nds.concat(newNode));
    },
    []
  );

  // ---------------------------------------------------------------------
  // 5) getDefaultDataForNode: setea props iniciales según el tipo
  // ---------------------------------------------------------------------
//   function getDefaultDataForNode(nodeType: string) {
//     switch (nodeType) {
//       case 'motor':
//         return { label: 'Motor Node', state: 'On' };
//       case 'valve':
//         return { label: 'Valve Node', state: 'Open', rotation: 0 };
//       case 'gauge':
//         return { label: 'Gauge Node', value: 50, setPoint: 60 };
//       case 'alarm':
//         return { label: 'Alarm Node', isActive: true, type: 'HIGH' };
//       default:
//         return { label: 'Custom Node' };
//     }
//   }

  // ---------------------------------------------------------------------
  // 6) Funciones para editar el nodo seleccionado
  // ---------------------------------------------------------------------
  const updateSelectedNodeData = (field: string, value: any) => {
    if (!selectedNode) return;
    setNodes((prevNodes) =>
      prevNodes.map((node) => {
        if (node.id === selectedNode.id) {
          return { ...node, data: { ...node.data, [field]: value } };
        }
        return node;
      })
    );
  };

  const renameSelectedNodeId = (newId: string) => {
    if (!selectedNode) return;
    const oldId = selectedNode.id;

    // Evitar duplicados
    const isIdInUse = nodes.some((n) => n.id === newId && n.id !== oldId);
    if (isIdInUse) {
      alert(`Ya existe un nodo con id "${newId}".`);
      return;
    }

    // Actualizamos nodos
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === oldId) {
          return { ...node, id: newId };
        }
        return node;
      })
    );

    // Actualizamos edges
    setEdges((eds) =>
      eds.map((edge) => {
        const updated = { ...edge };
        if (updated.source === oldId) {
          updated.source = newId;
        }
        if (updated.target === oldId) {
          updated.target = newId;
        }
        return updated;
      })
    );

    // Actualizamos selectedNode
    setSelectedNode((sel) => {
      if (!sel) return sel;
      if (sel.id === oldId) {
        return { ...sel, id: newId };
      }
      return sel;
    });
  };

  // ---------------------------------------------------------------------
  // 7) Sincronizar selectedNode cuando cambian los nodes
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (!selectedNode) return;
    const found = nodes.find((n) => n.id === selectedNode.id);
    if (found) {
      setSelectedNode(found);
    } else {
      setSelectedNode(null);
    }
  }, [nodes, selectedNode]);

  // ---------------------------------------------------------------------
  // 8) Manejo de edges relacionadas al nodo seleccionado
  // ---------------------------------------------------------------------
  const getEdgesForSelectedNode = (): Edge[] => {
    if (!selectedNode) return [];
    return edges.filter((e) => e.source === selectedNode.id || e.target === selectedNode.id);
  };

  const removeEdgeById = (edgeId: string) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
  };

  const [newEdgeTarget, setNewEdgeTarget] = useState('');

  const handleAddEdge = (targetId: string) => {
    if (!selectedNode) return;
    if (!targetId.trim()) return;

    // Comprobamos si existe un nodo con ese ID
    const targetExists = nodes.some((n) => n.id === targetId);
    if (!targetExists) {
      alert(`No existe un nodo con id "${targetId}".`);
      return;
    }

    // Si tus nodos tienen varios handles, aquí deberías poner sourceHandle / targetHandle
    // const newEdge: Edge = {
    //   id: `edge-${selectedNode.id}-${targetId}-${Date.now()}`,
    //   source: selectedNode.id,
    //   sourceHandle: 'valve_1_source_1', // Ejemplo si fuese Valve con handle "valve_1_source_1"
    //   target: targetId,
    //   targetHandle: 'motorTarget1'
    // };

    const newEdge: Edge = {
      id: `edge-${selectedNode.id}-${targetId}-${Date.now()}`,
      source: selectedNode.id,
      target: targetId,
    };

    console.log('[handleAddEdge] Agregando edge:', newEdge);
    setEdges((eds) => [...eds, newEdge]);
  };

  // ---------------------------------------------------------------------
  // 9) PANEL DE PROPIEDADES
  // ---------------------------------------------------------------------
  const PropertiesPanel = () => {
    if (!selectedNode) {
      return <p style={{ margin: 0 }}>Selecciona un nodo para editar sus propiedades.</p>;
    }

    const { id, type, data } = selectedNode;
    const edgesForNode = getEdgesForSelectedNode();

    // Maneja el cambio de ID
    const handleNodeIdChange = (e: ChangeEvent<HTMLInputElement>) => {
      renameSelectedNodeId(e.target.value);
    };

    // Maneja el cambio de data
    const handleChangeDataField =
      (field: string) =>
      (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        updateSelectedNodeData(field, e.target.value);
      };

    return (
      <div>
        <h3 style={{ ...headingStyle }}>Editar Nodo</h3>

        {/* ID del nodo */}
        <label className="mb-1 block">ID del nodo:</label>
        <input
          style={inputStyle}
          value={id}
          onChange={handleNodeIdChange}
        />

        {/* data.label */}
        <label className="mb-1 block">Etiqueta (data.label):</label>
        <input
          style={inputStyle}
          value={data?.label ?? ''}
          onChange={handleChangeDataField('label')}
        />

        {/* Props segun el type */}
        {type === 'motor' && (
          <>
            <label className="mb-1 block">Estado (data.state):</label>
            <select
              style={selectStyle}
              value={data?.state ?? 'Off'}
              onChange={handleChangeDataField('state')}
            >
              <option value="On">On</option>
              <option value="Off">Off</option>
              <option value="Transition">Transition</option>
            </select>
          </>
        )}

        {type === 'valve' && (
          <>
            <label className="mb-1 block">Estado (data.state):</label>
            <select
              style={selectStyle}
              value={data?.state ?? 'Closed'}
              onChange={handleChangeDataField('state')}
            >
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
              <option value="Transition">Transition</option>
            </select>

            <label className="mb-1 block">Rotación (data.rotation):</label>
            <input
              type="number"
              style={inputStyle}
              value={data?.rotation ?? 0}
              onChange={(e) => updateSelectedNodeData('rotation', Number(e.target.value))}
            />
          </>
        )}

        {type === 'gauge' && (
          <>
            <label className="mb-1 block">Valor (data.value):</label>
            <input
              type="number"
              style={inputStyle}
              value={data?.value ?? 0}
              onChange={(e) => updateSelectedNodeData('value', Number(e.target.value))}
            />
            <label className="mb-1 block">SetPoint (data.setPoint):</label>
            <input
              type="number"
              style={inputStyle}
              value={data?.setPoint ?? 0}
              onChange={(e) => updateSelectedNodeData('setPoint', Number(e.target.value))}
            />
          </>
        )}

        {type === 'alarm' && (
          <>
            <label className="mb-1 block">Activo (data.isActive):</label>
            <select
              style={selectStyle}
              value={data?.isActive ? 'true' : 'false'}
              onChange={(e) => updateSelectedNodeData('isActive', e.target.value === 'true')}
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>

            <label className="mb-1 block">Tipo (data.type):</label>
            <select
              style={selectStyle}
              value={data?.type ?? 'LOW'}
              onChange={handleChangeDataField('type')}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="URGENT">URGENT</option>
            </select>
          </>
        )}

        <hr style={{ margin: '12px 0', borderColor: '#666' }} />

        <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Edges para este nodo</h4>
        {edgesForNode.length === 0 && <p style={{ margin: 0 }}>Ninguna Edge</p>}
        <ul style={{ margin: 0, paddingLeft: '14px', marginBottom: '1rem' }}>
          {edgesForNode.map((edge) => (
            <li key={edge.id} style={{ marginBottom: '6px' }}>
              <span>
                {edge.source} → {edge.target} (id: {edge.id})
              </span>
              <button
                style={{
                  marginLeft: '8px',
                  padding: '2px 6px',
                  backgroundColor: '#e54e4e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                }}
                onClick={() => removeEdgeById(edge.id)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>

        {/* Crear edge */}
        <label className="mb-1 block">Crear edge hacia nodeId:</label>
        <div style={{ display: 'flex', gap: '6px' }}>
          <input
            style={{ ...inputStyle, marginBottom: 0 }}
            placeholder="nodeId destino"
            value={newEdgeTarget}
            onChange={(e) => setNewEdgeTarget(e.target.value)}
          />
          <button
            style={{
              padding: '6px 10px',
              backgroundColor: '#1c6dd0',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={() => {
              handleAddEdge(newEdgeTarget.trim());
              setNewEdgeTarget('');
            }}
          >
            Agregar
          </button>
        </div>
      </div>
    );
  };

  // ---------------------------------------------------------------------
  // 10) Generar JSON
  // ---------------------------------------------------------------------
  const handleGenerateJson = () => {
    // Clonamos los nodos (deep clone)
    const clonedNodes = JSON.parse(JSON.stringify(nodes));

    // Para cada nodo, si data.handles existe, la filtramos
    clonedNodes.forEach((node: any) => {
      if (node.data?.handles?.length) {
        node.data.handles = node.data.handles.filter((handle: any) => {
          const handleId = handle.id;
          // Se conserva si hay un edge que use ese handle
          return edges.some((edge) => {
            return (
              (edge.source === node.id && edge.sourceHandle === handleId) ||
              (edge.target === node.id && edge.targetHandle === handleId)
            );
          });
        });
      }
    });

    const screenData = {
      nodes: clonedNodes,
      edges,
    };
    console.log('JSON final (handles conectados):', screenData);
    alert('JSON generado. Revisa la consola.');
  };

  // ---------------------------------------------------------------------
  // 11) RENDER PRINCIPAL
  // ---------------------------------------------------------------------
  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>
        Creador de Pantallas SCADA
      </h2>
      <p style={{ marginBottom: '1rem' }}>
        Arrastra elementos, haz clic en nodos para editar propiedades e ID, etc.
      </p>

      <div style={containerStyle}>
        {/* Menú de nodos (izquierda) */}
        <aside style={sideMenuStyle}>
          <h3 style={headingStyle}>Elementos</h3>
          {availableNodeTypes.map((item) => (
            <div
              key={item.type}
              onDragStart={(e) => {
                e.dataTransfer.setData('application/reactflow', item.type);
                e.dataTransfer.effectAllowed = 'move';
              }}
              draggable
              style={menuItemStyle}
            >
              {item.label}
            </div>
          ))}
          <button
            onClick={handleGenerateJson}
            style={{
              marginTop: '12px',
              padding: '8px 12px',
              backgroundColor: '#1c6dd0',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Generar JSON
          </button>
        </aside>

        {/* Canvas React Flow (centro) */}
        <div style={canvasStyle}>
          <ReactFlowProvider>
            <ReactFlow
              // nodeTypes y edgeTypes definidas fuera/memoizadas
              nodeTypes={nodeTypes}
              // edgeTypes={edgeTypes} // si usas un edgeTypes custom
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onNodesDelete={onNodesDelete}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
            />
          </ReactFlowProvider>
        </div>

        {/* Panel de propiedades (derecha) */}
        <aside style={propertiesPanelStyle}>
          <h3 style={headingStyle}>Propiedades</h3>
          <PropertiesPanel />
        </aside>
      </div>
    </div>
  );
}
