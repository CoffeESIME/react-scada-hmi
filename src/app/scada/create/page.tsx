'use client';

import React, {
  useCallback,
  useState,
  CSSProperties,
  ChangeEvent,
  useEffect,
} from 'react';
import ReactFlow, {
  Background,
  BackgroundVariant,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  Connection,
  Edge,
  Node,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { TagSelector } from '@/app/components/tags/TagSelector';
import { ScreenSelector } from '@/app/components/screens/ScreenSelector';
import { SaveScreenModal } from '@/app/components/screens/SaveScreenModal';
import { ConfirmationModal } from '@/app/components/common/ConfirmationModal';
import { useRouter } from 'next/navigation';
import { nodeTypes, availableNodeTypes } from '../nodeTypes';
import { ScadaModeProvider } from '@/contexts/ScadaModeContext';
const containerStyle: CSSProperties = {
  width: '100%',
  height: '80vh',
  border: '2px solid #3a3a5c',
  display: 'flex',
  backgroundColor: '#1a1a2e',
  color: '#e2e8f0',
  fontFamily: 'sans-serif',
};

const sideMenuStyle: CSSProperties = {
  width: '160px',
  backgroundColor: '#16213e',
  padding: '10px',
  borderRight: '2px solid #3a3a5c',
};

const menuItemStyle: CSSProperties = {
  cursor: 'move',
  backgroundColor: '#1f1f38',
  marginBottom: '6px',
  padding: '8px',
  textAlign: 'center',
  border: '1px solid #3a3a5c',
  color: '#e2e8f0',
  borderRadius: '4px',
};

const canvasStyle: CSSProperties = {
  flex: 1,
  backgroundColor: '#C0C0C0',
};

const propertiesPanelStyle: CSSProperties = {
  width: '320px',
  backgroundColor: '#16213e',
  padding: '10px',
  borderLeft: '2px solid #3a3a5c',
};

const headingStyle: CSSProperties = {
  fontSize: '1.2rem',
  marginBottom: '0.5rem',
  color: '#e2e8f0',
};

const inputStyle: CSSProperties = {
  backgroundColor: '#1f1f38',
  color: '#e2e8f0',
  border: '1px solid #3a3a5c',
  padding: '6px',
  marginBottom: '6px',
  width: '100%',
  borderRadius: '4px',
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
    case 'tank':
      return {
        handles: [
          {
            type: 'target' as const,
            position: Position.Top,
            id: 'tankInput',
            style: { left: 30 },
          },
          {
            type: 'source' as const,
            position: Position.Bottom,
            id: 'tankOutput',
            style: { left: 30 },
          },
        ],
      };
    case 'label':
      return {
        text: 'Etiqueta',
        width: 100,
        height: 30,
        triangleDirection: 'right' as const,
        handle: {
          type: 'source' as const,
          position: Position.Right,
        },
      };
    case 'button':
      return {
        label: 'Botón',
      };
    case 'box':
      return {};
    case 'cardData':
      return {
        label: ['Título', 'Subtítulo'],
        actionType: 'NONE',
      };
    case 'controlDataCard':
      return {
        title: 'PID Controller',
        processVariable: 'PV',
        processVariableValue: 50,
        setPoint: 60,
        output: 45,
        mode: 'AUTO' as const,
        handleDataSource: {
          position: Position.Right,
          id: 'controlSource',
          style: { top: 50 },
        },
        handleDataTarget: {
          position: Position.Left,
          id: 'controlTarget',
          style: { top: 50 },
        },
      };
    case 'dataTrend':
      return {
        title: 'Trend Chart',
        dataPoints: [20, 35, 45, 50, 55, 60, 58, 62, 65],
        setPoint: 50,
        limitTop: 80,
        limitBottom: 20,
        yAxis: { min: 0, max: 100 },
        width: 300,
        height: 200,
      };
    case 'smallDataTrend':
      return {
        data: [20, 25, 22, 30, 28, 35, 40, 38],
        width: 120,
        height: 60,
        min: 0,
        max: 50,
      };
    default:
      return { label: 'Custom Node', handles: [] };
  }
}

// ---------------------------------------------------------------------
// 4) COMPONENTE PRINCIPAL
// ---------------------------------------------------------------------
function CreateHmiScreenContent(): React.ReactElement {
  return (
    <ScadaModeProvider isEditMode={true}>
      <CreateHmiScreenContentInner />
    </ScadaModeProvider>
  );
}

function CreateHmiScreenContentInner(): React.ReactElement {
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {

      setSelectedNode(node);
    },
    []
  );

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {

      if (selectedNode && deleted.some((n) => n.id === selectedNode.id)) {
        setSelectedNode(null);
      }
    },
    [selectedNode]
  );

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


      setNodes((nds) => nds.concat(newNode));
    },
    []
  );

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

  const updateSelectedNodeStyle = (styleField: string, value: any) => {
    if (!selectedNode) return;
    const updatedNode = {
      ...selectedNode,
      style: { ...(selectedNode.style ?? {}), [styleField]: value },
    };
    setSelectedNode(updatedNode);
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === selectedNode.id ? updatedNode : node
      )
    );
  };

  const renameSelectedNodeId = (newId: string) => {
    if (!selectedNode) return;
    const oldId = selectedNode.id;

    const isIdInUse = nodes.some((n) => n.id === newId && n.id !== oldId);
    if (isIdInUse) {
      alert(`Ya existe un nodo con id "${newId}".`);
      return;
    }

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === oldId) {
          return { ...node, id: newId };
        }
        return node;
      })
    );

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

    setSelectedNode((sel) => {
      if (!sel) return sel;
      if (sel.id === oldId) {
        return { ...sel, id: newId };
      }
      return sel;
    });
  };

  useEffect(() => {
    if (!selectedNode) return;
    const found = nodes.find((n) => n.id === selectedNode.id);
    if (found) {
      setSelectedNode(found);
    } else {
      setSelectedNode(null);
    }
  }, [nodes, selectedNode]);

  const getEdgesForSelectedNode = (): Edge[] => {
    if (!selectedNode) return [];
    return edges.filter((e) => e.source === selectedNode.id || e.target === selectedNode.id);
  };

  const removeEdgeById = (edgeId: string) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
  };

  const handleAddEdge = (targetId: string) => {
    if (!selectedNode) return;
    if (!targetId.trim()) return;

    const targetExists = nodes.some((n) => n.id === targetId);
    if (!targetExists) {
      alert(`No existe un nodo con id "${targetId}".`);
      return;
    }

    const newEdge: Edge = {
      id: `edge-${selectedNode.id}-${targetId}-${Date.now()}`,
      source: selectedNode.id,
      target: targetId,
    };

    setEdges((eds) => [...eds, newEdge]);
  };

  return (
    <div className="bg-admin-bg min-h-screen p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-admin-text">
            Creador de Pantallas SCADA
          </h2>
          <p className="text-admin-text-secondary text-sm">
            Arrastra elementos, haz clic en nodos para editar propiedades.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push('/scada/organize')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3a3a5c',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            📋 Ver Pantallas
          </button>
          <button
            onClick={() => setIsSaveModalOpen(true)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#10b981',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            💾 Guardar Pantalla
          </button>
        </div>
      </div>

      <div style={containerStyle}>
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
        </aside>

        <div style={canvasStyle}>
          <ReactFlow
            nodeTypes={nodeTypes}
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
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color="#555"
            />
          </ReactFlow>
        </div>

        <aside style={propertiesPanelStyle}>
          <h3 style={headingStyle}>Propiedades</h3>
          <PropertiesPanel
            selectedNode={selectedNode}
            updateSelectedNodeData={updateSelectedNodeData}
            updateSelectedNodeStyle={updateSelectedNodeStyle}
            renameSelectedNodeId={renameSelectedNodeId}
            onDeleteRequest={() => {
              if (selectedNode) setIsDeleteModalOpen(true);
            }}
            edgesForNode={getEdgesForSelectedNode()}
            removeEdgeById={removeEdgeById}
            handleAddEdge={handleAddEdge}
          />
        </aside>
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (!selectedNode) return;
          const id = selectedNode.id;
          setNodes((nds) => nds.filter((n) => n.id !== id));
          setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
          setSelectedNode(null);
          setIsDeleteModalOpen(false);
        }}
        title="Eliminar Nodo"
        message={`¿Estás seguro de que deseas eliminar el nodo "${selectedNode?.id}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        isDanger
      />

      <SaveScreenModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSaved={(id) => {
          router.push(`/scada/edit/${id}`);
        }}
      />
    </div>
  );
}

export default function CreateHmiScreen(): React.ReactElement {
  return (
    <ReactFlowProvider>
      <CreateHmiScreenContent />
    </ReactFlowProvider>
  );
}

interface PropertiesPanelProps {
  selectedNode: Node | null;
  updateSelectedNodeData: (field: string, value: any) => void;
  updateSelectedNodeStyle: (styleField: string, value: any) => void;
  renameSelectedNodeId: (newId: string) => void;
  onDeleteRequest: () => void;
  edgesForNode: Edge[];
  removeEdgeById: (id: string) => void;
  handleAddEdge: (targetId: string) => void;
}

function PropertiesPanel({
  selectedNode,
  updateSelectedNodeData,
  updateSelectedNodeStyle,
  renameSelectedNodeId,
  onDeleteRequest,
  edgesForNode,
  removeEdgeById,
  handleAddEdge,
}: PropertiesPanelProps) {
  const [newEdgeTarget, setNewEdgeTarget] = useState('');

  if (!selectedNode) {
    return <p style={{ margin: 0 }}>Selecciona un nodo para editar sus propiedades.</p>;
  }

  const { id, type, data } = selectedNode;

  const handleNodeIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    renameSelectedNodeId(e.target.value);
  };
  const handleChangeDataField =
    (field: string) =>
      (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        updateSelectedNodeData(field, e.target.value);
      };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 style={{ ...headingStyle, margin: 0 }}>Editar Nodo</h3>
        <button
          onClick={onDeleteRequest}
          style={{
            padding: '4px 8px',
            backgroundColor: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
          title="Eliminar nodo"
        >
          🗑 Eliminar
        </button>
      </div>

      <label className="mb-1 block">ID del nodo:</label>
      <input
        style={inputStyle}
        value={id}
        onChange={handleNodeIdChange}
      />

      <hr style={{ margin: '10px 0', borderColor: '#666' }} />
      <h4 className="text-sm font-semibold text-admin-text mb-2">Orden de Capas</h4>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', flexWrap: 'wrap' }}>
        <button
          title="Traer al frente (zIndex máximo)"
          onClick={() => updateSelectedNodeStyle('zIndex', 9999)}
          style={{
            flex: 1, padding: '5px 4px', backgroundColor: '#1f1f38',
            color: '#e2e8f0', border: '1px solid #3a3a5c', borderRadius: '4px',
            cursor: 'pointer', fontSize: '11px', textAlign: 'center',
          }}
        >
          ⬆⬆ Frente
        </button>
        <button
          title="Traer hacia adelante (+1)"
          onClick={() => updateSelectedNodeStyle('zIndex', Number(selectedNode.style?.zIndex ?? 0) + 1)}
          style={{
            flex: 1, padding: '5px 4px', backgroundColor: '#1f1f38',
            color: '#e2e8f0', border: '1px solid #3a3a5c', borderRadius: '4px',
            cursor: 'pointer', fontSize: '11px', textAlign: 'center',
          }}
        >
          ⬆ Adelante
        </button>
        <button
          title="Enviar hacia atrás (-1)"
          onClick={() => updateSelectedNodeStyle('zIndex', Number(selectedNode.style?.zIndex ?? 0) - 1)}
          style={{
            flex: 1, padding: '5px 4px', backgroundColor: '#1f1f38',
            color: '#e2e8f0', border: '1px solid #3a3a5c', borderRadius: '4px',
            cursor: 'pointer', fontSize: '11px', textAlign: 'center',
          }}
        >
          ⬇ Atrás
        </button>
        <button
          title="Enviar al fondo (zIndex mínimo)"
          onClick={() => updateSelectedNodeStyle('zIndex', -9999)}
          style={{
            flex: 1, padding: '5px 4px', backgroundColor: '#1f1f38',
            color: '#e2e8f0', border: '1px solid #3a3a5c', borderRadius: '4px',
            cursor: 'pointer', fontSize: '11px', textAlign: 'center',
          }}
        >
          ⬇⬇ Fondo
        </button>
      </div>
      <p style={{ fontSize: '11px', color: '#888', marginBottom: '4px' }}>
        zIndex actual: <strong style={{ color: '#e2e8f0' }}>{selectedNode.style?.zIndex ?? 0}</strong>
      </p>

      <label className="mb-1 block">Etiqueta (data.label):</label>
      <input
        style={inputStyle}
        value={data?.label ?? ''}
        onChange={handleChangeDataField('label')}
      />

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
          <label className="mb-1 block">Valor Inicial (data.initialValue):</label>
          <input
            type="number"
            style={inputStyle}
            value={data?.initialValue ?? 0}
            onChange={(e) => updateSelectedNodeData('initialValue', Number(e.target.value))}
          />
          <label className="mb-1 block">SetPoint (data.setPoint):</label>
          <input
            type="number"
            style={inputStyle}
            value={data?.setPoint ?? 0}
            onChange={(e) => updateSelectedNodeData('setPoint', Number(e.target.value))}
          />

          <hr style={{ margin: '12px 0', borderColor: '#666' }} />
          <h4 className="text-sm font-semibold text-admin-text mb-2">Límites Industriales</h4>

          <div className="flex gap-2 mb-2">
            <div className="flex-1">
              <label className="text-xs mb-1 block">Min (Escala)</label>
              <input
                type="number"
                style={inputStyle}
                value={data?.scaleMin ?? 0}
                onChange={(e) => updateSelectedNodeData('scaleMin', Number(e.target.value))}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs mb-1 block">Max (Escala)</label>
              <input
                type="number"
                style={inputStyle}
                value={data?.scaleMax ?? 100}
                onChange={(e) => updateSelectedNodeData('scaleMax', Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex gap-2 mb-2">
            <div className="flex-1">
              <label className="text-xs mb-1 block text-red-400">HH (Crítico)</label>
              <input
                type="number"
                placeholder="High High"
                style={inputStyle}
                value={data?.limitHH ?? ''}
                onChange={(e) => updateSelectedNodeData('limitHH', e.target.value === '' ? undefined : Number(e.target.value))}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs mb-1 block text-yellow-400">H (Alarma)</label>
              <input
                type="number"
                placeholder="High"
                style={inputStyle}
                value={data?.limitH ?? ''}
                onChange={(e) => updateSelectedNodeData('limitH', e.target.value === '' ? undefined : Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex gap-2 mb-2">
            <div className="flex-1">
              <label className="text-xs mb-1 block text-yellow-400">L (Alarma)</label>
              <input
                type="number"
                placeholder="Low"
                style={inputStyle}
                value={data?.limitL ?? ''}
                onChange={(e) => updateSelectedNodeData('limitL', e.target.value === '' ? undefined : Number(e.target.value))}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs mb-1 block text-red-400">LL (Crítico)</label>
              <input
                type="number"
                placeholder="Low Low"
                style={inputStyle}
                value={data?.limitLL ?? ''}
                onChange={(e) => updateSelectedNodeData('limitLL', e.target.value === '' ? undefined : Number(e.target.value))}
              />
            </div>
          </div>
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

      {['button', 'cardData'].includes(type ?? '') && (
        <>
          <hr style={{ margin: '12px 0', borderColor: '#666' }} />
          <h4 className="text-sm font-semibold text-admin-text mb-2">Interactividad</h4>

          <div className="mb-3">
            <label className="text-xs text-gray-400 mb-1 block">Tipo de Acción</label>
            <select
              style={selectStyle}
              value={data?.actionType ?? 'NONE'}
              onChange={(e) => updateSelectedNodeData('actionType', e.target.value)}
            >
              <option value="NONE">Ninguna</option>
              <option value="NAVIGATE">Navegar a Pantalla</option>
              <option value="WRITE_TAG">Escribir Valor a Tag</option>
              <option value="SETPOINT_INPUT">Input de Setpoint</option>
              <option value="SETPOINT_DIALOG">Diálogo de Setpoint</option>
            </select>
          </div>

          {data?.actionType === 'NAVIGATE' && (
            <div className="mb-3 p-2 bg-gray-800 rounded border border-gray-700">
              <ScreenSelector
                value={data?.targetScreenId ?? null}
                onChange={(screenId) => updateSelectedNodeData('targetScreenId', screenId)}
                label="Pantalla Destino"
                size="sm"
                className="w-full"
              />
            </div>
          )}

          {data?.actionType === 'WRITE_TAG' && (
            <div className="mb-3 p-2 bg-gray-800 rounded border border-gray-700">
              <label className="text-xs text-gray-400 mb-1 block">Tag a Escribir</label>
              <TagSelector
                value={data?.targetTagId ?? null}
                onChange={(tagId) => updateSelectedNodeData('targetTagId', tagId)}
                placeholder="Selecciona Tag..."
                size="sm"
              />
              <label className="text-xs text-gray-400 mt-2 mb-1 block">Valor a Escribir</label>
              <input
                style={inputStyle}
                placeholder="Valor constante (ej: 1, true)"
                value={data?.writeValue ?? ''}
                onChange={(e) => updateSelectedNodeData('writeValue', e.target.value)}
              />
              <p className="text-[10px] text-gray-500 mt-1">Si dejas vacío, usará toggle (bool) o prompt (num).</p>
            </div>
          )}

          {(data?.actionType === 'SETPOINT_INPUT' || data?.actionType === 'SETPOINT_DIALOG') && (
            <div className="mb-3 p-2 bg-gray-800 rounded border border-gray-700">
              <label className="text-xs text-gray-400 mb-1 block">Tag de Setpoint</label>
              <TagSelector
                value={data?.targetTagId ?? null}
                onChange={(tagId) => updateSelectedNodeData('targetTagId', tagId)}
                placeholder="Tag SP..."
                size="sm"
              />
            </div>
          )}

          {type === 'button' && (
            <div className="mt-3">
              <label className="mb-1 block">Texto del Botón</label>
              <input
                style={inputStyle}
                value={data?.label ?? ''}
                onChange={handleChangeDataField('label')}
              />
            </div>
          )}
        </>
      )}

      {type === 'controlDataCard' && (
        <>
          <hr style={{ margin: '12px 0', borderColor: '#666' }} />
          <h4 className="text-sm font-semibold text-admin-text mb-3">Vinculación PID</h4>

          <div className="mb-3">
            <TagSelector
              value={data?.pvTagId ?? null}
              onChange={(tagId) => updateSelectedNodeData('pvTagId', tagId)}
              label="Variable de Proceso (PV)"
              placeholder="Tag PV..."
              size="sm"
            />
          </div>

          <div className="mb-3">
            <TagSelector
              value={data?.spTagId ?? null}
              onChange={(tagId) => updateSelectedNodeData('spTagId', tagId)}
              label="Set Point (SP)"
              placeholder="Tag SP..."
              size="sm"
            />
          </div>

          <div className="mb-3">
            <TagSelector
              value={data?.outTagId ?? null}
              onChange={(tagId) => updateSelectedNodeData('outTagId', tagId)}
              label="Salida (Output)"
              placeholder="Tag Out..."
              size="sm"
            />
          </div>

          <div className="mb-3">
            <TagSelector
              value={data?.modeTagId ?? null}
              onChange={(tagId) => updateSelectedNodeData('modeTagId', tagId)}
              label="Modo (Auto/Man)"
              placeholder="Tag Mode..."
              size="sm"
            />
          </div>
        </>
      )}

      {(type === 'dataTrend' || type === 'smallDataTrend') && (
        <>
          <hr style={{ margin: '12px 0', borderColor: '#666' }} />
          <h4 className="text-sm font-semibold text-admin-text mb-2">Configuración de Tendencia</h4>

          <div className="mb-3">
            <TagSelector
              value={data?.tagId ?? null}
              onChange={(tagId) => updateSelectedNodeData('tagId', tagId)}
              label="Variable a Graficar (PV)"
              size="sm"
            />
          </div>

          <div className="mb-3">
            <TagSelector
              value={data?.spTagId ?? null}
              onChange={(tagId) => updateSelectedNodeData('spTagId', tagId)}
              label="Tag de Setpoint (SP)"
              size="sm"
            />
            <p className="text-[10px] text-gray-500 mt-1">Opcional. Si se omite, usa valor estático/ninguno.</p>
          </div>
        </>
      )}

      {type === 'dataTrend' && (
        <>
          <div className="mb-3">
            <label className="text-xs text-gray-400 mb-1 block">Título</label>
            <input style={inputStyle} value={data?.title ?? ''} onChange={handleChangeDataField('title')} />
          </div>

          <div className="flex gap-2 mb-2">
            <div className="flex-1">
              <label className="text-xs mb-1 block text-gray-400">Límite Alto</label>
              <input type="number" style={inputStyle} value={data?.limitTop ?? ''} onChange={(e) => updateSelectedNodeData('limitTop', Number(e.target.value))} />
            </div>
            <div className="flex-1">
              <label className="text-xs mb-1 block text-gray-400">Límite Bajo</label>
              <input type="number" style={inputStyle} value={data?.limitBottom ?? ''} onChange={(e) => updateSelectedNodeData('limitBottom', Number(e.target.value))} />
            </div>
          </div>

          <div className="mb-3">
            <label className="text-xs mb-1 block text-blue-400">Setpoint Estático</label>
            <input type="number" style={inputStyle} value={data?.setPoint ?? ''} onChange={(e) => updateSelectedNodeData('setPoint', Number(e.target.value))} />
          </div>
        </>
      )}

      {type === 'smallDataTrend' && (
        <div className="mb-3">
          <label className="text-xs text-gray-400 mb-1 block">Banda Muerta (Deadband)</label>
          <input
            type="number"
            style={inputStyle}
            placeholder="Ej: 5"
            value={data?.deadband ?? ''}
            onChange={(e) => updateSelectedNodeData('deadband', Number(e.target.value))}
          />
          <p className="text-[10px] text-gray-500 mt-1">Ancho de banda +/- respecto al SP.</p>
        </div>
      )}

      {['motor', 'valve', 'gauge', 'alarm'].includes(type ?? '') && (
        <>
          <hr style={{ margin: '12px 0', borderColor: '#666' }} />
          <div className="mb-4">
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
                      backgroundColor: '#ef4444',
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

            <h4 className="text-sm font-semibold text-admin-text mb-2">Vinculación de Tag</h4>
            <TagSelector
              value={data?.tagId ?? null}
              onChange={(tagId) => updateSelectedNodeData('tagId', tagId)}
              label="Tag de datos"
              placeholder="Seleccionar tag..."
              size="sm"
              className="w-full"
            />

            <label className="mb-1 block mt-4">Crear edge hacia nodeId:</label>
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
                  backgroundColor: '#6366f1',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
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
        </>
      )}
    </div>
  );
}

