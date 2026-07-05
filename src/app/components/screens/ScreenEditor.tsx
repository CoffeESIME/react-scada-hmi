'use client';

import React, {
    useCallback,
    useState,
    useEffect,
    CSSProperties,
    ChangeEvent,
} from 'react';
import { useRouter } from 'next/navigation';
import ReactFlow, {
    Background,
    BackgroundVariant,
    ReactFlowProvider,
    addEdge,
    useEdgesState,
    useNodesState,
    useReactFlow,
    Connection,
    Edge,
    Node,
    Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Spinner, Button } from '@nextui-org/react';
import { toast } from 'sonner';

import { api } from '@/lib/api';
import { getAvailableImages } from '@/app/actions/getImages';
import { SaveScreenModal } from '@/app/components/screens/SaveScreenModal';
import { TagSelector } from '@/app/components/tags/TagSelector';
import { ScreenSelector } from '@/app/components/screens/ScreenSelector';
import { ConfirmationModal } from '@/app/components/common/ConfirmationModal';
import { nodeTypes, availableNodeCategories } from '@/app/scada/nodeTypes';
import { ScadaModeProvider } from '@/contexts/ScadaModeContext';

// =====================================================================
// Estilos
// =====================================================================
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

const layerButtonStyle: CSSProperties = {
    flex: 1,
    padding: '5px 4px',
    backgroundColor: '#1f1f38',
    color: '#e2e8f0',
    border: '1px solid #3a3a5c',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '11px',
    textAlign: 'center',
};

// =====================================================================
// Tipos
// =====================================================================
export interface BackgroundSettings {
    color: string;
    dotColor: string;
    dotSize: number;
    dotGap: number;
    variant: 'dots' | 'lines' | 'cross' | 'none';
}

const DEFAULT_BACKGROUND: BackgroundSettings = {
    color: '#C0C0C0',
    dotColor: '#555',
    dotSize: 1,
    dotGap: 20,
    variant: 'dots',
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
        background?: BackgroundSettings;
    };
}

export interface ScreenEditorProps {
    /** Si se pasa, el editor carga la pantalla existente (modo edición). Sin él, modo creación. */
    screenId?: string;
}

// =====================================================================
// Helper para datos por defecto de cada tipo de nodo
// =====================================================================
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
                units: 'lt/s',
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
        case 'image':
            return {
                src: '',
                width: 100,
            };
        default:
            return { label: 'Custom Node', handles: [] };
    }
}

// =====================================================================
// Componente interno del editor (necesita ReactFlowProvider arriba)
// =====================================================================
function ScreenEditorContent({ screenId }: ScreenEditorProps) {
    const router = useRouter();
    const { setViewport } = useReactFlow();

    const isEditMode = !!screenId;

    // React Flow state
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);

    // Screen metadata (solo en modo edición)
    const [screenData, setScreenData] = useState<ScreenData | null>(null);
    const [isLoading, setIsLoading] = useState(isEditMode);

    // Background settings
    const [bgSettings, setBgSettings] = useState<BackgroundSettings>(DEFAULT_BACKGROUND);

    // Available images
    const [availableImages, setAvailableImages] = useState<string[]>([]);

    // Sidebar accordion state
    const [expandedCategory, setExpandedCategory] = useState<string>('Normativa ISA');

    // Modales
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Cargar imágenes disponibles
    useEffect(() => {
        getAvailableImages().then(setAvailableImages).catch(console.error);
    }, []);

    // -----------------------------------------------------------------
    // Cargar pantalla al montar (solo en modo edición)
    // -----------------------------------------------------------------
    useEffect(() => {
        if (!screenId) return;

        const loadScreen = async () => {
            setIsLoading(true);
            try {
                const response = await api.get<ScreenData>(`/screens/${screenId}`);
                const data = response.data;
                setScreenData(data);

                if (data.layout_data) {
                    setNodes(data.layout_data.nodes || []);
                    setEdges(data.layout_data.edges || []);

                    if (data.layout_data.background) {
                        setBgSettings({ ...DEFAULT_BACKGROUND, ...data.layout_data.background });
                    }

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

    // -----------------------------------------------------------------
    // React Flow Callbacks
    // -----------------------------------------------------------------
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

    // -----------------------------------------------------------------
    // Funciones de edición de nodos
    // -----------------------------------------------------------------
    const updateSelectedNodeData = (field: string, value: any) => {
        if (!selectedNode) return;

        const updatedNode = {
            ...selectedNode,
            data: { ...selectedNode.data, [field]: value },
        };

        setSelectedNode(updatedNode);
        setNodes((prevNodes) =>
            prevNodes.map((node) =>
                node.id === selectedNode.id ? updatedNode : node
            )
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

    // Sincronizar selectedNode con el estado real de nodes
    useEffect(() => {
        if (!selectedNode) return;
        const found = nodes.find((n) => n.id === selectedNode.id);
        if (found) {
            setSelectedNode(found);
        } else {
            setSelectedNode(null);
        }
    }, [nodes]);

    // Edge helpers
    const getEdgesForSelectedNode = (): Edge[] => {
        if (!selectedNode) return [];
        return edges.filter(
            (e) => e.source === selectedNode.id || e.target === selectedNode.id
        );
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

    // -----------------------------------------------------------------
    // Loading state (solo en modo edición)
    // -----------------------------------------------------------------
    if (isLoading) {
        return (
            <div className="min-h-screen bg-admin-bg flex items-center justify-center">
                <Spinner size="lg" color="primary" />
            </div>
        );
    }

    // -----------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------
    return (
        <ScadaModeProvider isEditMode={true}>
            <div className="bg-admin-bg min-h-screen p-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-admin-text">
                            {isEditMode
                                ? `Editando: ${screenData?.name}`
                                : 'Creador de Pantallas SCADA'}
                        </h2>
                        <p className="text-admin-text-secondary text-sm">
                            {isEditMode
                                ? `Slug: ${screenData?.slug}`
                                : 'Arrastra elementos, haz clic en nodos para editar propiedades.'}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="flat"
                            onPress={() => router.push('/scada/organize')}
                        >
                            {isEditMode ? '← Volver' : '📋 Ver Pantallas'}
                        </Button>
                        <Button
                            color="primary"
                            onPress={() => setIsSaveModalOpen(true)}
                        >
                            💾 {isEditMode ? 'Guardar Cambios' : 'Guardar Pantalla'}
                        </Button>
                    </div>
                </div>

                <div style={containerStyle}>
                    {/* Sidebar izquierda - Elementos */}
                    <aside style={sideMenuStyle}>
                        <h3 style={headingStyle}>Librerías</h3>
                        {availableNodeCategories.map((category) => {
                            const isExpanded = expandedCategory === category.title;
                            return (
                                <div key={category.title} style={{ marginBottom: '8px' }}>
                                    <h4 
                                        onClick={() => setExpandedCategory(isExpanded ? '' : category.title)}
                                        style={{
                                            fontSize: '0.85rem',
                                            color: isExpanded ? '#fff' : '#888',
                                            backgroundColor: isExpanded ? '#1f1f38' : 'transparent',
                                            padding: '8px 4px',
                                            borderRadius: '4px',
                                            textTransform: 'uppercase',
                                            marginBottom: isExpanded ? '8px' : '4px',
                                            letterSpacing: '0.5px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            transition: 'all 0.2s',
                                            userSelect: 'none'
                                        }}
                                        className="hover:bg-[#1f1f38] hover:text-white"
                                    >
                                        {category.title}
                                        <span style={{ fontSize: '10px' }}>{isExpanded ? '▼' : '▶'}</span>
                                    </h4>
                                    
                                    {isExpanded && (
                                        <div style={{ paddingLeft: '4px' }}>
                                            {category.items.map((item) => (
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
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </aside>

                    {/* Canvas React Flow */}
                    <div style={{ ...canvasStyle, backgroundColor: bgSettings.color }}>
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
                            onPaneClick={() => setSelectedNode(null)}
                            fitView
                            style={{ backgroundColor: bgSettings.color }}
                        >
                            {bgSettings.variant !== 'none' && (
                                <Background
                                    variant={
                                        bgSettings.variant === 'dots'
                                            ? BackgroundVariant.Dots
                                            : bgSettings.variant === 'lines'
                                            ? BackgroundVariant.Lines
                                            : BackgroundVariant.Cross
                                    }
                                    gap={bgSettings.dotGap}
                                    size={bgSettings.dotSize}
                                    color={bgSettings.dotColor}
                                />
                            )}
                        </ReactFlow>
                    </div>

                    {/* Panel de propiedades */}
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
                            bgSettings={bgSettings}
                            onBgSettingsChange={setBgSettings}
                            availableImages={availableImages}
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
                        setEdges((eds) =>
                            eds.filter((e) => e.source !== id && e.target !== id)
                        );
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
                    editScreenId={isEditMode ? screenData?.id : undefined}
                    initialValues={
                        isEditMode
                            ? {
                                  name: screenData?.name,
                                  description: screenData?.description || '',
                                  isHome: screenData?.is_home,
                              }
                            : undefined
                    }
                    backgroundSettings={bgSettings}
                    onSaved={(id) => {
                        if (isEditMode) {
                            toast.success('Cambios guardados');
                        } else {
                            router.push(`/scada/edit/${id}`);
                        }
                    }}
                />
            </div>
        </ScadaModeProvider>
    );
}

// =====================================================================
// Componente público: Wrapper con ReactFlowProvider
// =====================================================================
export function ScreenEditor({ screenId }: ScreenEditorProps) {
    return (
        <ReactFlowProvider>
            <ScreenEditorContent screenId={screenId} />
        </ReactFlowProvider>
    );
}

// =====================================================================
// Properties Panel
// =====================================================================
interface PropertiesPanelProps {
    selectedNode: Node | null;
    updateSelectedNodeData: (field: string, value: any) => void;
    updateSelectedNodeStyle: (styleField: string, value: any) => void;
    renameSelectedNodeId: (newId: string) => void;
    onDeleteRequest: () => void;
    edgesForNode: Edge[];
    removeEdgeById: (id: string) => void;
    handleAddEdge: (targetId: string) => void;
    bgSettings: BackgroundSettings;
    onBgSettingsChange: (settings: BackgroundSettings) => void;
    availableImages: string[];
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
    bgSettings,
    onBgSettingsChange,
    availableImages,
}: PropertiesPanelProps) {
    const [newEdgeTarget, setNewEdgeTarget] = useState('');

    if (!selectedNode) {
        return (
            <BackgroundSettingsPanel
                bgSettings={bgSettings}
                onBgSettingsChange={onBgSettingsChange}
            />
        );
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
            <input
                style={inputStyle}
                value={id}
                onChange={handleNodeIdChange}
            />

            {/* ============================================================ */}
            {/* ORDEN DE CAPAS (Z-INDEX)                                      */}
            {/* ============================================================ */}
            <hr style={{ margin: '10px 0', borderColor: '#666' }} />
            <h4 className="text-sm font-semibold text-admin-text mb-2">Orden de Capas</h4>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <button
                    title="Traer al frente (zIndex máximo)"
                    onClick={() => updateSelectedNodeStyle('zIndex', 9999)}
                    style={layerButtonStyle}
                >
                    ⬆⬆ Frente
                </button>
                <button
                    title="Traer hacia adelante (+1)"
                    onClick={() => {
                        const current = Number(selectedNode.style?.zIndex ?? 0);
                        updateSelectedNodeStyle('zIndex', current + 1);
                    }}
                    style={layerButtonStyle}
                >
                    ⬆ Adelante
                </button>
                <button
                    title="Enviar hacia atrás (-1)"
                    onClick={() => {
                        const current = Number(selectedNode.style?.zIndex ?? 0);
                        updateSelectedNodeStyle('zIndex', current - 1);
                    }}
                    style={layerButtonStyle}
                >
                    ⬇ Atrás
                </button>
                <button
                    title="Enviar al fondo (zIndex mínimo)"
                    onClick={() => updateSelectedNodeStyle('zIndex', -9999)}
                    style={layerButtonStyle}
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

            {/* ============================================================ */}
            {/* CARD DATA — Título / Subtítulo                                */}
            {/* ============================================================ */}
            {type === 'cardData' && (
                <>
                    <hr style={{ margin: '12px 0', borderColor: '#666' }} />
                    <h4 className="text-sm font-semibold text-admin-text mb-2">Contenido</h4>

                    <label className="mb-1 block">Título (línea 1):</label>
                    <input
                        style={inputStyle}
                        value={Array.isArray(data?.label) ? data.label[0] ?? '' : ''}
                        onChange={(e) => {
                            const current: string[] = Array.isArray(data?.label) ? [...data.label] : ['', ''];
                            current[0] = e.target.value;
                            updateSelectedNodeData('label', current);
                        }}
                    />

                    <label className="mb-1 block">Subtítulo (línea 2):</label>
                    <input
                        style={inputStyle}
                        value={Array.isArray(data?.label) ? data.label[1] ?? '' : ''}
                        onChange={(e) => {
                            const current: string[] = Array.isArray(data?.label) ? [...data.label] : ['', ''];
                            current[1] = e.target.value;
                            updateSelectedNodeData('label', current);
                        }}
                    />
                </>
            )}

            {/* ============================================================ */}
            {/* MOTOR                                                          */}
            {/* ============================================================ */}
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

                    <label className="mb-1 block text-xs text-gray-400 mt-2">
                        Rotación (grados):
                    </label>
                    <input
                        type="number"
                        style={inputStyle}
                        value={data?.rotation ?? 0}
                        onChange={(e) => updateSelectedNodeData('rotation', Number(e.target.value))}
                    />
                </>
            )}

            {/* ============================================================ */}
            {/* VALVE                                                          */}
            {/* ============================================================ */}
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

                    <label className="mb-1 block text-xs text-gray-400 mt-2">
                        Rotación (grados):
                    </label>
                    <input
                        type="number"
                        style={inputStyle}
                        value={data?.rotation ?? 0}
                        onChange={(e) => updateSelectedNodeData('rotation', Number(e.target.value))}
                    />
                    <label className="mb-1 block text-xs text-gray-400 mt-2">
                        Tamaño del ícono px (data.size):
                    </label>
                    <input
                        type="number"
                        style={inputStyle}
                        value={data?.size ?? 50}
                        min={10}
                        max={200}
                        onChange={(e) => updateSelectedNodeData('size', Number(e.target.value))}
                    />
                </>
            )}

            {/* ============================================================ */}
            {/* BOX (Contenedor)                                               */}
            {/* ============================================================ */}
            {type === 'box' && (
                <>
                    <hr style={{ margin: '12px 0', borderColor: '#666' }} />
                    <h4 className="text-sm font-semibold text-admin-text mb-2">Dimensiones del Contenedor</h4>
                    <div className="flex gap-2 mb-2">
                        <div className="flex-1">
                            <label className="text-xs mb-1 block text-gray-400">Ancho (px)</label>
                            <input
                                type="number"
                                style={inputStyle}
                                value={data?.width ?? 320}
                                onChange={(e) => updateSelectedNodeData('width', Number(e.target.value))}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs mb-1 block text-gray-400">Alto (px)</label>
                            <input
                                type="number"
                                style={inputStyle}
                                value={data?.height ?? 320}
                                onChange={(e) => updateSelectedNodeData('height', Number(e.target.value))}
                            />
                        </div>
                    </div>
                </>
            )}

            {/* ============================================================ */}
            {/* GAUGE                                                          */}
            {/* ============================================================ */}
            {type === 'gauge' && (
                <>
                    <label className="mb-1 block">Unidades (data.units):</label>
                    <input
                        style={inputStyle}
                        value={data?.units ?? ''}
                        maxLength={5}
                        placeholder="lt/s"
                        onChange={handleChangeDataField('units')}
                    />
                    <p style={{ fontSize: '11px', color: '#888', marginBottom: '6px', marginTop: '-4px' }}>Máximo 5 caracteres (ej: lt/s, m³/h, psi)</p>

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
            {/* ALARMA                                                         */}
            {/* ============================================================ */}
            {type === 'alarm' && (
                <>
                    <hr style={{ margin: '12px 0', borderColor: '#666' }} />
                    <h4 className="text-sm font-semibold text-admin-text mb-2">Configuración de Alarma</h4>

                    <label className="mb-1 block text-xs text-gray-400">
                        Color de Alarma (data.type):
                    </label>
                    <select
                        style={selectStyle}
                        value={data?.type ?? 'LOW'}
                        onChange={handleChangeDataField('type')}
                    >
                        <option value="LOW">LOW — 🟣 Morado (#916AAD)</option>
                        <option value="MEDIUM">MEDIUM — 🟡 Amarillo (#F5E11B)</option>
                        <option value="HIGH">HIGH — 🟠 Naranja (#EC8629)</option>
                        <option value="URGENT">URGENT — 🔴 Rojo (#E22028)</option>
                    </select>
                    <p style={{ fontSize: '10px', color: '#888', marginTop: '-4px', marginBottom: '8px' }}>
                        Este es el color mínimo que se mostrará cuando el tag entre en alarma.
                        Si el backend reporta una severidad mayor, se usará la más grave.
                    </p>

                    <label className="mb-1 block text-xs text-gray-400">
                        Estado inicial en editor (data.isActive):
                    </label>
                    <select
                        style={selectStyle}
                        value={data?.isActive ? 'true' : 'false'}
                        onChange={(e) => updateSelectedNodeData('isActive', e.target.value === 'true')}
                    >
                        <option value="true">Activa (preview del color en editor)</option>
                        <option value="false">Inactiva (oculta en editor)</option>
                    </select>

                    <label className="mb-1 block text-xs text-gray-400 mt-2">
                        Mensaje descriptivo (data.message):
                    </label>
                    <input
                        style={inputStyle}
                        value={data?.message ?? ''}
                        placeholder="Ej: Nivel alto de tanque"
                        onChange={handleChangeDataField('message')}
                    />

                    <label className="mb-1 block text-xs text-gray-400">
                        Tamaño del ícono px (data.size):
                    </label>
                    <input
                        type="number"
                        style={inputStyle}
                        value={data?.size ?? 20}
                        min={10}
                        max={100}
                        onChange={(e) => updateSelectedNodeData('size', Number(e.target.value))}
                    />
                </>
            )}

            {/* ============================================================ */}
            {/* INTERACTIVIDAD (COMPARTIDO: BUTTON & CARD)                    */}
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
                        <option value="NAVIGATE">Navegar a Pantalla</option>
                        <option value="SETPOINT_DIALOG">Setpoint (Popup Modal)</option>
                    </select>

                    {/* NAVIGATE CONFIG */}
                    {data?.actionType === 'NAVIGATE' && (
                        <div className="mb-4 mt-2">
                            <ScreenSelector
                                value={data?.targetScreenId ?? null}
                                onChange={(screenId) => updateSelectedNodeData('targetScreenId', screenId)}
                                label="Pantalla Destino"
                                placeholder="Selecciona Pantalla..."
                                size="sm"
                                className="w-full"
                            />
                        </div>
                    )}

                    {/* SETPOINT_DIALOG CONFIG */}
                    {data?.actionType === 'SETPOINT_DIALOG' && (
                        <>
                            <div className="mb-3 mt-2">
                                <TagSelector
                                    value={data?.targetTagId ?? null}
                                    onChange={(tagId) => updateSelectedNodeData('targetTagId', tagId)}
                                    label="Tag Setpoint"
                                    placeholder="Selecciona Tag..."
                                    size="sm"
                                    className="w-full"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="text-xs text-gray-400 mb-1 block">Tipo de Dato</label>
                                <select
                                    style={selectStyle}
                                    value={data?.dataType ?? 'float'}
                                    onChange={(e) => updateSelectedNodeData('dataType', e.target.value)}
                                >
                                    <option value="float">Float (decimales)</option>
                                    <option value="integer">Integer (enteros)</option>
                                    <option value="boolean">Boolean (0 / 1)</option>
                                </select>
                                <p style={{ fontSize: '10px', color: '#888', marginTop: '2px' }}>
                                    Controla qué tipo de input se muestra en el popup.
                                </p>
                            </div>
                        </>
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

            {/* ============================================================ */}
            {/* TRENDS (DataTrend & SmallDataTrend)                           */}
            {/* ============================================================ */}
            {(type === 'dataTrend' || type === 'smallDataTrend') && (
                <>
                    <hr style={{ margin: '12px 0', borderColor: '#666' }} />
                    <h4 className="text-sm font-semibold text-admin-text mb-2">Configuración de Tendencia</h4>

                    {/* PV */}
                    <div className="mb-3">
                        <TagSelector
                            value={data?.tagId ?? null}
                            onChange={(tagId) => updateSelectedNodeData('tagId', tagId)}
                            label="Variable a Graficar (PV)"
                            size="sm"
                        />
                    </div>

                    {/* SP */}
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
                            <label className="text-xs mb-1 block text-gray-400">Límite Alto (Línea)</label>
                            <input type="number" style={inputStyle} value={data?.limitTop ?? ''} onChange={(e) => updateSelectedNodeData('limitTop', Number(e.target.value))} />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs mb-1 block text-gray-400">Límite Bajo (Línea)</label>
                            <input type="number" style={inputStyle} value={data?.limitBottom ?? ''} onChange={(e) => updateSelectedNodeData('limitBottom', Number(e.target.value))} />
                        </div>
                    </div>

                    <div className="flex gap-2 mb-2">
                        <div className="flex-1">
                            <label className="text-xs mb-1 block text-blue-400">Eje Y Max</label>
                            <input
                                type="number"
                                style={inputStyle}
                                placeholder="Ej: 100"
                                value={data?.yAxis?.max ?? ''}
                                onChange={(e) => updateSelectedNodeData('yAxis', {
                                    ...data?.yAxis,
                                    max: e.target.value === '' ? undefined : Number(e.target.value),
                                })}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="text-xs mb-1 block text-blue-400">Eje Y Min</label>
                            <input
                                type="number"
                                style={inputStyle}
                                placeholder="Ej: 0"
                                value={data?.yAxis?.min ?? ''}
                                onChange={(e) => updateSelectedNodeData('yAxis', {
                                    ...data?.yAxis,
                                    min: e.target.value === '' ? undefined : Number(e.target.value),
                                })}
                            />
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

            {/* ============================================================ */}
            {/* IMAGE NODE                                                     */}
            {/* ============================================================ */}
            {type === 'image' && (
                <>
                    <hr style={{ margin: '12px 0', borderColor: '#666' }} />
                    <h4 className="text-sm font-semibold text-admin-text mb-2">Configuración de Imagen</h4>
                    
                    <label className="mb-1 block text-xs text-gray-400">Archivo de Imagen</label>
                    <select
                        style={selectStyle}
                        value={data?.src ?? ''}
                        onChange={handleChangeDataField('src')}
                    >
                        <option value="">Selecciona una imagen...</option>
                        {availableImages.map(img => (
                            <option key={img} value={img}>{img}</option>
                        ))}
                    </select>
                    <p style={{ fontSize: '10px', color: '#888', marginTop: '4px', marginBottom: '8px' }}>
                        Agrega archivos en <code>public/images</code> para que aparezcan aquí.
                    </p>

                    <label className="mb-1 block text-xs text-gray-400">Ancho (px)</label>
                    <input
                        type="number"
                        style={inputStyle}
                        value={data?.width ?? 100}
                        min={10}
                        onChange={(e) => updateSelectedNodeData('width', Number(e.target.value))}
                    />
                </>
            )}

            {/* ============================================================ */}
            {/* TAG BINDING SECTION - Solo para nodos con datos en vivo        */}
            {/* ============================================================ */}
            {['motor', 'valve', 'gauge', 'alarm'].includes(type ?? '') && (
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

                        {/* Edge management */}
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

            {/* ============================================================ */}
            {/* MULTI-BINDING SECTION - Solo para ControlDataCard (PID)        */}
            {/* ============================================================ */}
            {type === 'controlDataCard' && (
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
            )}
        </div>
    );
}

// =====================================================================
// Background Settings Panel (shown when no node is selected)
// =====================================================================
interface BackgroundSettingsPanelProps {
    bgSettings: BackgroundSettings;
    onBgSettingsChange: (settings: BackgroundSettings) => void;
}

const PRESET_COLORS = [
    { label: 'ISA Gris', value: '#C0C0C0' },
    { label: 'Blanco', value: '#FFFFFF' },
    { label: 'Negro', value: '#000000' },
    { label: 'Azul Oscuro', value: '#1a1a2e' },
    { label: 'Gris Oscuro', value: '#2d2d2d' },
    { label: 'Azul Navy', value: '#0a1929' },
    { label: 'Verde Oscuro', value: '#1a2e1a' },
    { label: 'Gris Claro', value: '#E8E8E8' },
];

function BackgroundSettingsPanel({ bgSettings, onBgSettingsChange }: BackgroundSettingsPanelProps) {
    const update = (field: keyof BackgroundSettings, value: any) => {
        onBgSettingsChange({ ...bgSettings, [field]: value });
    };

    return (
        <div>
            <h4 className="text-sm font-semibold text-admin-text mb-3">🎨 Fondo del Canvas</h4>
            <p style={{ fontSize: '11px', color: '#888', marginBottom: '12px' }}>
                Haz clic en el canvas (fuera de un nodo) para ver estas opciones.
            </p>

            {/* Color de Fondo */}
            <label className="mb-1 block text-xs text-gray-400">Color de Fondo</label>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '8px' }}>
                <input
                    type="color"
                    value={bgSettings.color}
                    onChange={(e) => update('color', e.target.value)}
                    style={{
                        width: '36px',
                        height: '36px',
                        border: '1px solid #3a3a5c',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        padding: '2px',
                        backgroundColor: '#1f1f38',
                    }}
                />
                <input
                    style={{ ...inputStyle, marginBottom: 0 }}
                    value={bgSettings.color}
                    onChange={(e) => update('color', e.target.value)}
                    placeholder="#C0C0C0"
                />
            </div>

            {/* Presets */}
            <label className="mb-1 block text-xs text-gray-400">Presets</label>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '4px',
                marginBottom: '12px',
            }}>
                {PRESET_COLORS.map((preset) => (
                    <button
                        key={preset.value}
                        title={preset.label}
                        onClick={() => update('color', preset.value)}
                        style={{
                            width: '100%',
                            aspectRatio: '1',
                            backgroundColor: preset.value,
                            border: bgSettings.color === preset.value
                                ? '2px solid #6366f1'
                                : '1px solid #3a3a5c',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    />
                ))}
            </div>

            <hr style={{ margin: '12px 0', borderColor: '#666' }} />

            {/* Tipo de Patrón */}
            <label className="mb-1 block text-xs text-gray-400">Patrón de Fondo</label>
            <select
                style={selectStyle}
                value={bgSettings.variant}
                onChange={(e) => update('variant', e.target.value)}
            >
                <option value="dots">Puntos</option>
                <option value="lines">Líneas</option>
                <option value="cross">Cruz</option>
                <option value="none">Sin patrón</option>
            </select>

            {/* Opciones del patrón (solo si hay patrón) */}
            {bgSettings.variant !== 'none' && (
                <>
                    {/* Color del patrón */}
                    <label className="mb-1 block text-xs text-gray-400 mt-2">
                        Color del Patrón
                    </label>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '8px' }}>
                        <input
                            type="color"
                            value={bgSettings.dotColor}
                            onChange={(e) => update('dotColor', e.target.value)}
                            style={{
                                width: '36px',
                                height: '36px',
                                border: '1px solid #3a3a5c',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                padding: '2px',
                                backgroundColor: '#1f1f38',
                            }}
                        />
                        <input
                            style={{ ...inputStyle, marginBottom: 0 }}
                            value={bgSettings.dotColor}
                            onChange={(e) => update('dotColor', e.target.value)}
                            placeholder="#555"
                        />
                    </div>

                    {/* Tamaño */}
                    <label className="mb-1 block text-xs text-gray-400">
                        Tamaño ({bgSettings.variant === 'dots' ? 'radio' : 'grosor'}): {bgSettings.dotSize}px
                    </label>
                    <input
                        type="range"
                        min={0.5}
                        max={10}
                        step={0.5}
                        value={bgSettings.dotSize}
                        onChange={(e) => update('dotSize', Number(e.target.value))}
                        style={{ width: '100%', marginBottom: '8px', accentColor: '#6366f1' }}
                    />

                    {/* Espaciado */}
                    <label className="mb-1 block text-xs text-gray-400">
                        Espaciado: {bgSettings.dotGap}px
                    </label>
                    <input
                        type="range"
                        min={5}
                        max={100}
                        step={5}
                        value={bgSettings.dotGap}
                        onChange={(e) => update('dotGap', Number(e.target.value))}
                        style={{ width: '100%', marginBottom: '8px', accentColor: '#6366f1' }}
                    />
                </>
            )}

            <hr style={{ margin: '12px 0', borderColor: '#666' }} />

            {/* Preview */}
            <label className="mb-1 block text-xs text-gray-400">Vista previa</label>
            <div
                style={{
                    width: '100%',
                    height: '80px',
                    backgroundColor: bgSettings.color,
                    border: '1px solid #3a3a5c',
                    borderRadius: '4px',
                    backgroundImage:
                        bgSettings.variant === 'dots'
                            ? `radial-gradient(circle, ${bgSettings.dotColor} ${bgSettings.dotSize}px, transparent ${bgSettings.dotSize}px)`
                            : bgSettings.variant === 'lines'
                            ? `repeating-linear-gradient(0deg, transparent, transparent ${bgSettings.dotGap - bgSettings.dotSize}px, ${bgSettings.dotColor} ${bgSettings.dotGap - bgSettings.dotSize}px, ${bgSettings.dotColor} ${bgSettings.dotGap}px)`
                            : bgSettings.variant === 'cross'
                            ? `repeating-linear-gradient(0deg, transparent, transparent ${bgSettings.dotGap - bgSettings.dotSize}px, ${bgSettings.dotColor} ${bgSettings.dotGap - bgSettings.dotSize}px, ${bgSettings.dotColor} ${bgSettings.dotGap}px), repeating-linear-gradient(90deg, transparent, transparent ${bgSettings.dotGap - bgSettings.dotSize}px, ${bgSettings.dotColor} ${bgSettings.dotGap - bgSettings.dotSize}px, ${bgSettings.dotColor} ${bgSettings.dotGap}px)`
                            : 'none',
                    backgroundSize:
                        bgSettings.variant === 'dots'
                            ? `${bgSettings.dotGap}px ${bgSettings.dotGap}px`
                            : undefined,
                }}
            />

            <hr style={{ margin: '12px 0', borderColor: '#666' }} />
            <button
                onClick={() => onBgSettingsChange({ ...DEFAULT_BACKGROUND })}
                style={{
                    width: '100%',
                    padding: '6px 10px',
                    backgroundColor: '#3a3a5c',
                    color: '#e2e8f0',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                }}
            >
                ↻ Restaurar valores por defecto
            </button>

            <p style={{ fontSize: '10px', color: '#666', marginTop: '12px', textAlign: 'center' }}>
                Haz clic en un nodo para editar sus propiedades.
            </p>
        </div>
    );
}
