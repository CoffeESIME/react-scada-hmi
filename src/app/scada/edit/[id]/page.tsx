'use client';

import React, {
    useCallback,
    useState,
    useEffect,
    useMemo,
    CSSProperties,
    ChangeEvent,
} from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReactFlow, {
    ReactFlowProvider,
    addEdge,
    useEdgesState,
    useNodesState,
    useReactFlow,
    Connection,
    Edge,
    Node,
    NodeTypes,
    Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Spinner, Button } from '@nextui-org/react';
import { toast } from 'sonner';

import { api } from '@/lib/api';
import { SaveScreenModal } from '@/app/components/screens/SaveScreenModal';
import { TagSelector } from '@/app/components/tags/TagSelector';
import { ConfirmationModal } from '@/app/components/common/ConfirmationModal';
import { nodeTypes, debugNodeTypes, availableNodeTypes } from '../../nodeTypes';
import { ScadaModeProvider } from '@/contexts/ScadaModeContext';

// Estilos
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
    overflowY: 'auto',
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
    overflowY: 'auto',
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

interface ScreenData {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_home: boolean;
    layout_data: {
        nodes: Node[];
        edges: Edge[];
        viewport?: { x: number; y: number; zoom: number };
    };
}

// ---------------------------------------------------------------------
// Helper para datos por defecto (Copiado de create/page.tsx para consistencia)
// ---------------------------------------------------------------------
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

// -----------------------

function EditScreenContent({ screenId }: { screenId: string }) {
    const router = useRouter();
    const { setViewport } = useReactFlow();

    // ... existing hooks ...
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    const [screenData, setScreenData] = useState<ScreenData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);


    // Cargar pantalla al montar
    useEffect(() => {
        const loadScreen = async () => {
            setIsLoading(true);
            try {
                const response = await api.get<ScreenData>(`/screens/${screenId}`);
                const data = response.data;
                setScreenData(data);

                // Cargar nodes y edges
                if (data.layout_data) {
                    setNodes(data.layout_data.nodes || []);
                    setEdges(data.layout_data.edges || []);

                    // Restaurar viewport si existe
                    if (data.layout_data.viewport) {
                        setTimeout(() => {
                            setViewport(data.layout_data.viewport!);
                        }, 100);
                    }
                }

                toast.success(`Pantalla "${data.name}" cargada`);
            } catch (error: any) {
                console.error('Error loading screen:', error);
                toast.error('Error al cargar la pantalla');
                router.push('/scada/organize');
            } finally {
                setIsLoading(false);
            }
        };

        loadScreen();
    }, [screenId]);

    // Handlers de React Flow
    const onConnect = useCallback(
        (params: Connection) => {
            setEdges((eds) => addEdge(params, eds));
        },
        [setEdges]
    );

    const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
    }, []);

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
        [setNodes]
    );

    // Funciones de edición
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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-admin-bg flex items-center justify-center">
                <Spinner size="lg" color="primary" />
            </div>
        );
    }

    return (
        <ScadaModeProvider isEditMode={true}>
            <div className="bg-admin-bg min-h-screen p-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-admin-text">
                            Editando: {screenData?.name}
                        </h2>
                        <p className="text-admin-text-secondary text-sm">
                            Slug: {screenData?.slug}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="flat"
                            onPress={() => router.push('/scada/organize')}
                        >
                            ← Volver
                        </Button>
                        <Button
                            color="primary"
                            onPress={() => setIsSaveModalOpen(true)}
                        >
                            💾 Guardar Cambios
                        </Button>
                    </div>
                </div>

                <div style={containerStyle}>
                    {/* Sidebar izquierda - Elementos */}
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

                    {/* Canvas React Flow */}
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
                        />
                    </div>

                    {/* Panel de propiedades */}
                    <aside style={propertiesPanelStyle}>
                        <h3 style={headingStyle}>Propiedades</h3>
                        <PropertiesPanel
                            selectedNode={selectedNode}
                            updateSelectedNodeData={updateSelectedNodeData}
                            onDeleteRequest={() => {
                                if (selectedNode) setIsDeleteModalOpen(true);
                            }}
                        />
                    </aside>
                </div>

                {/* Modal de Confirmación de Borrado */}
                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={() => {
                        if (!selectedNode) return;
                        const id = selectedNode.id;
                        setNodes((nds) => nds.filter((n) => n.id !== id));
                        // También filtrar edges si fuera necesario, aunque ReactFlow suele manejarlos
                        setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
                        setSelectedNode(null);
                        setIsDeleteModalOpen(false);
                    }}
                    title="Eliminar Nodo"
                    message={`¿Estás seguro de que deseas eliminar el nodo "${selectedNode?.id}"? Esta acción no se puede deshacer.`}
                    confirmLabel="Eliminar"
                    isDanger
                />

                {/* Modal de Guardar */}
                <SaveScreenModal
                    isOpen={isSaveModalOpen}
                    onClose={() => setIsSaveModalOpen(false)}
                    editScreenId={screenData?.id}
                    initialValues={{
                        name: screenData?.name,
                        description: screenData?.description || '',
                        isHome: screenData?.is_home,
                    }}
                    onSaved={() => {
                        toast.success('Cambios guardados');
                    }}
                />
            </div>
        </ScadaModeProvider>
    );
}

// Wrapper con ReactFlowProvider
export default function EditScreenPage() {
    const params = useParams();
    const screenId = params.id as string;

    return (
        <ReactFlowProvider>
            <EditScreenContent screenId={screenId} />
        </ReactFlowProvider>
    );
}

// ---------------------------------------------------------------------
// Properties Panel (Extracted)
// ---------------------------------------------------------------------
interface PropertiesPanelProps {
    selectedNode: Node | null;
    updateSelectedNodeData: (field: string, value: any) => void;
    onDeleteRequest: () => void;
}

function PropertiesPanel({
    selectedNode,
    updateSelectedNodeData,
    onDeleteRequest
}: PropertiesPanelProps) {
    if (!selectedNode) {
        return <p style={{ margin: 0 }}>Selecciona un nodo para editar sus propiedades.</p>;
    }

    const { id, type, data } = selectedNode;

    const handleChangeDataField =
        (field: string) =>
            (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
                updateSelectedNodeData(field, e.target.value);
            };

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-semibold text-admin-text m-0">Editar Nodo</h4>
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
            <input style={inputStyle} value={id} disabled />

            <label className="mb-1 block">Etiqueta (data.label):</label>
            <input
                style={inputStyle}
                value={data?.label ?? ''}
                onChange={handleChangeDataField('label')}
            />

            {/* Props según el tipo */}
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

                    {/* Scale Min/Max */}
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

                    {/* HH / H */}
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

                    {/* L / LL */}
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

            {/* ============================================================ */}
            {/* INTERACTIVIDAD (COMPARTIDO: BUTTON & CARD) */}
            {/* ============================================================ */}
            {['button', 'cardData'].includes(type ?? '') && (
                <>
                    <hr style={{ margin: '12px 0', borderColor: '#666' }} />
                    <h4 className="text-sm font-semibold text-admin-text mb-2">Interactividad</h4>

                    <label className="mb-1 block">Tipo de Acción:</label>
                    <select
                        style={selectStyle}
                        value={data?.actionType ?? 'NONE'}
                        onChange={handleChangeDataField('actionType')}
                    >
                        <option value="NONE">Ninguna</option>
                        <option value="NAVIGATE">Navegación</option>
                        <option value="WRITE_TAG">Comando (Write Tag)</option>
                        <option value="SETPOINT_DIALOG">Setpoint (Popup)</option>
                        {/* SETPOINT_INPUT solo tiene sentido si el componente tiene input visual (ButtonNode lo tiene) */}
                        {type === 'button' && <option value="SETPOINT_INPUT">Input de Setpoint (Inline)</option>}
                    </select>

                    {/* 1. NAVIGATE CONFIG */}
                    {data?.actionType === 'NAVIGATE' && (
                        <>
                            <label className="mb-1 block mt-2">ID Pantalla Destino:</label>
                            <input
                                style={inputStyle}
                                type="number"
                                placeholder="Ej: 12"
                                value={data?.targetScreenId ?? ''}
                                onChange={handleChangeDataField('targetScreenId')}
                            />
                        </>
                    )}

                    {/* 2. WRITE_TAG CONFIG */}
                    {data?.actionType === 'WRITE_TAG' && (
                        <>
                            <div className="mb-4 mt-2">
                                <TagSelector
                                    value={data?.targetTagId ?? null}
                                    onChange={(tagId) => updateSelectedNodeData('targetTagId', tagId)}
                                    label="Tag de Comando"
                                    placeholder="Selecciona Tag..."
                                    size="sm"
                                    className="w-full"
                                />
                            </div>
                            <label className="mb-1 block">Valor a Escribir:</label>
                            <input
                                style={inputStyle}
                                placeholder="Ej: 1, true, 50.5"
                                value={data?.writeValue ?? ''}
                                onChange={handleChangeDataField('writeValue')}
                            />
                        </>
                    )}

                    {/* 3. SETPOINT CONFIG (DIALOG OR INPUT) */}
                    {(data?.actionType === 'SETPOINT_DIALOG' || data?.actionType === 'SETPOINT_INPUT') && (
                        <>
                            <div className="mb-4 mt-2">
                                <TagSelector
                                    value={data?.targetTagId ?? null}
                                    onChange={(tagId) => updateSelectedNodeData('targetTagId', tagId)}
                                    label="Tag Setpoint"
                                    placeholder="Selecciona Tag..."
                                    size="sm"
                                    className="w-full"
                                />
                            </div>
                        </>
                    )}
                </>
            )}

            {/* ============================================================ */}
            {/* TAG BINDING SECTION - Solo para nodos con datos en vivo */}
            {/* ============================================================ */}
            {['motor', 'valve', 'gauge', 'alarm', 'dataTrend', 'smallDataTrend'].includes(type ?? '') && (
                <>
                    <hr style={{ margin: '12px 0', borderColor: '#666' }} />
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-semibold text-admin-text">Vinculación de Tag</h4>
                            {data?.tagId ? (
                                <span className="flex items-center gap-1 text-xs text-green-400">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                    Vinculado
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-xs text-gray-400">
                                    <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                    Sin vínculo
                                </span>
                            )}
                        </div>
                        <TagSelector
                            value={data?.tagId ?? null}
                            onChange={(tagId) => updateSelectedNodeData('tagId', tagId)}
                            label="Tag de datos"
                            placeholder="Seleccionar tag..."
                            size="sm"
                            className="w-full"
                        />
                    </div>
                </>
            )}


            {/* ============================================================ */}
            {/* MULTI-BINDING SECTION - Solo para ControlDataCard (PID)    */}
            {/* ============================================================ */}
            {
                type === 'controlDataCard' && (
                    <>
                        <hr style={{ margin: '12px 0', borderColor: '#666' }} />
                        <h4 className="text-sm font-semibold text-admin-text mb-3">Vinculación PID</h4>

                        {/* 1. PV */}
                        <div className="mb-3">
                            <TagSelector
                                value={data?.pvTagId ?? null}
                                onChange={(tagId) => updateSelectedNodeData('pvTagId', tagId)}
                                label="Variable de Proceso (PV)"
                                placeholder="Tag PV..."
                                size="sm"
                            />
                        </div>

                        {/* 2. SP */}
                        <div className="mb-3">
                            <TagSelector
                                value={data?.spTagId ?? null}
                                onChange={(tagId) => updateSelectedNodeData('spTagId', tagId)}
                                label="Set Point (SP)"
                                placeholder="Tag SP..."
                                size="sm"
                            />
                        </div>

                        {/* 3. Output */}
                        <div className="mb-3">
                            <TagSelector
                                value={data?.outTagId ?? null}
                                onChange={(tagId) => updateSelectedNodeData('outTagId', tagId)}
                                label="Salida (Output)"
                                placeholder="Tag Out..."
                                size="sm"
                            />
                        </div>

                        {/* 4. Mode */}
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
                )
            }
        </div>
    );
};
