'use client';

import React, { useState, useEffect, CSSProperties } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ReactFlow, {
    ReactFlowProvider,
    useReactFlow,
    Node,
    Edge,
    Background,
    BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Spinner, Button, Chip } from '@nextui-org/react';
import { toast } from 'sonner';

import { api } from '@/lib/api';
import { nodeTypes } from '../../nodeTypes'; // Shared nodeTypes
import { ScadaModeProvider } from '@/contexts/ScadaModeContext';

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

const canvasStyle: CSSProperties = {
    height: 'calc(100vh - 50px)',
    //flex: 1,
    backgroundColor: '#C0C0C0',
};

function ViewScreenContent({ screenId }: { screenId: string }) {
    const router = useRouter();
    const { setViewport, fitView } = useReactFlow();

    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [screenData, setScreenData] = useState<ScreenData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar pantalla al montar
    useEffect(() => {
        if (!screenId) return;

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
    }, [screenId]);

    // Memoize imported nodeTypes to satisfy React Flow stability check
    const nodeTypesMemo = React.useMemo(() => nodeTypes, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Spinner size="lg" color="primary" />
                    <p className="text-gray-400 mt-4">Cargando pantalla...</p>
                </div>
            </div>
        );
    }

    return (
        <ScadaModeProvider isEditMode={false}>
            <div className="bg-[#1a1a2e] h-screen flex flex-col overflow-hidden">
                {/* Header minimalista */}
                <header className="bg-[#16213e] border-b border-[#3a3a5c] px-4 py-2 flex justify-between items-center h-[50px] shrink-0 z-50">
                    <div className="flex items-center gap-4">
                        <h1 className="text-lg font-semibold text-gray-200">
                            {screenData?.name}
                        </h1>
                        {screenData?.is_home && (
                            <Chip color="success" size="sm" variant="flat" className="text-xs">
                                🏠 Principal
                            </Chip>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <Chip color="danger" size="sm" variant="dot" className="border-none bg-transparent text-gray-400">
                            RUNTIME
                        </Chip>
                        <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            className="bg-[#3a3a5c] text-white hover:bg-[#4a4a6c]"
                            onPress={() => router.push(`/scada/edit/${screenData?.id}`)}
                        >
                            ✏️ Editar
                        </Button>
                        <Button
                            size="sm"
                            variant="light"
                            className="text-gray-400 hover:text-white"
                            onPress={() => router.push('/scada/organize')}
                        >
                            Salie
                        </Button>
                    </div>
                </header>

                {/* Canvas en modo lectura */}
                <div className="flex-1 w-full relative" style={canvasStyle}>
                    <ReactFlow
                        nodeTypes={nodeTypesMemo}
                        nodes={nodes}
                        edges={edges}
                        // ===== MODO LECTURA ESTRICTO =====
                        nodesDraggable={false}
                        nodesConnectable={false}
                        elementsSelectable={false}
                        panOnDrag={true}
                        zoomOnScroll={true}
                        zoomOnPinch={true}
                        zoomOnDoubleClick={false}
                        preventScrolling={true}
                        // =================================
                        fitView
                    //className="bg-[#0f0f1a]"
                    >
                        <Background
                            variant={BackgroundVariant.Dots}
                            gap={24}
                            size={1}
                            color="#3a3a5c"
                        />
                    </ReactFlow>
                </div>
            </div>
        </ScadaModeProvider>
    );
}

// Wrapper con ReactFlowProvider
export default function ViewScreenPage() {
    const params = useParams();
    // Use 'screenId' as defined in the folder structure [screenId]
    const screenId = params.screenId as string;

    return (
        <ReactFlowProvider>
            <ViewScreenContent screenId={screenId} />
        </ReactFlowProvider>
    );
}
