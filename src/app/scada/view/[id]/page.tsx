'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReactFlow, {
    ReactFlowProvider,
    useReactFlow,
    Node,
    Edge,
    NodeTypes,
    Background,
    BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Spinner, Button, Chip } from '@nextui-org/react';
import { toast } from 'sonner';

import { api } from '@/lib/api';

// Node Components
import MotorNode from '@/app/components/Motors/MotorNode';
import ValveNode from '@/app/components/Valves/ValveNode';
import LinearGaugeNode from '@/app/components/LinearGauge/LinearGaugeNode';
import { AlarmNode } from '@/app/components/Alarm/AlarmNode';
import TankNode from '@/app/components/Tank/TankNode';
import { LabelNode } from '@/app/components/Label/LabelNode';
import { ButtonNode } from '@/app/components/Button/ButtonNode';
import { BoxCardNode } from '@/app/components/Boxes/BoxNode';
import { CardDataNode } from '@/app/components/CardData/CardDataNode';
import { ControlDataCardNode } from '@/app/components/ControlDataCard/ControlDataCardNode';
import { DataTrendNode } from '@/app/components/DataTrend/DataTrendNode';
import { SmallDataTrendNode } from '@/app/components/SmallDataTrend/SmallDataTrendNode';

// Node types (definido fuera para evitar re-renders)
const nodeTypes: NodeTypes = {
    motor: MotorNode,
    valve: ValveNode,
    gauge: LinearGaugeNode,
    alarm: AlarmNode,
    tank: TankNode,
    label: LabelNode,
    button: ButtonNode,
    box: BoxCardNode,
    cardData: CardDataNode,
    controlDataCard: ControlDataCardNode,
    dataTrend: DataTrendNode,
    smallDataTrend: SmallDataTrendNode,
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

function ViewScreenContent({ screenId }: { screenId: string }) {
    const router = useRouter();
    const { setViewport, fitView } = useReactFlow();

    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [screenData, setScreenData] = useState<ScreenData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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
                    } else {
                        setTimeout(() => {
                            fitView({ padding: 0.1 });
                        }, 100);
                    }
                }
            } catch (error: any) {
                console.error('Error loading screen:', error);
                toast.error('Error al cargar la pantalla');
                router.push('/scada/organize');
            } finally {
                setIsLoading(false);
            }
        };

        loadScreen();
    }, [screenId, setViewport, fitView, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-admin-bg flex items-center justify-center">
                <div className="text-center">
                    <Spinner size="lg" color="primary" />
                    <p className="text-admin-text mt-4">Cargando pantalla...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-admin-bg min-h-screen flex flex-col">
            {/* Header minimalista */}
            <header className="bg-admin-surface border-b border-admin-border px-4 py-2 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-semibold text-admin-text">
                        {screenData?.name}
                    </h1>
                    {screenData?.is_home && (
                        <Chip color="success" size="sm" variant="flat">
                            🏠 Principal
                        </Chip>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <Chip color="primary" size="sm" variant="flat">
                        🔴 RUNTIME
                    </Chip>
                    <Button
                        size="sm"
                        variant="flat"
                        onPress={() => router.push(`/scada/edit/${screenData?.id}`)}
                    >
                        ✏️ Editar
                    </Button>
                    <Button
                        size="sm"
                        variant="flat"
                        onPress={() => router.push('/scada/organize')}
                    >
                        ← Pantallas
                    </Button>
                </div>
            </header>

            {/* Canvas en modo lectura */}
            <div className="flex-1 bg-[#0f3460]">
                <ReactFlow
                    nodeTypes={nodeTypes}
                    nodes={nodes}
                    edges={edges}
                    // ===== MODO LECTURA =====
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={false}
                    panOnDrag={true}
                    zoomOnScroll={true}
                    zoomOnPinch={true}
                    // ========================
                    fitView
                    fitViewOptions={{ padding: 0.1 }}
                >
                    <Background
                        variant={BackgroundVariant.Dots}
                        gap={20}
                        size={1}
                        color="#1a365d"
                    />
                </ReactFlow>
            </div>

            {/* Footer con info */}
            <footer className="bg-admin-surface border-t border-admin-border px-4 py-1 text-xs text-gray-400 flex justify-between">
                <span>
                    Nodos: {nodes.length} | Conexiones: {edges.length}
                </span>
                <span>
                    Pantalla: {screenData?.slug}
                </span>
            </footer>
        </div>
    );
}

// Wrapper con ReactFlowProvider
export default function ViewScreenPage() {
    const params = useParams();
    const screenId = params.id as string;

    return (
        <ReactFlowProvider>
            <ViewScreenContent screenId={screenId} />
        </ReactFlowProvider>
    );
}
