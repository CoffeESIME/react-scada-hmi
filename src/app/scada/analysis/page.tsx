'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button, Card, CardBody } from '@nextui-org/react';
import { toast } from 'sonner';

import { TagMultiSelector } from '@/app/components/tags/TagMultiSelector';
import { getHistory, HistorySeries } from '@/lib/api';
import { HistoricalChart, ChartSeries } from '@/app/components/charts/HistoricalChart';
import { useReportExport } from '@/hooks/useReportExport';

export default function AnalysisPage() {
    const searchParams = useSearchParams();

    // State
    const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [chartSeries, setChartSeries] = useState<ChartSeries[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Export Hook
    const { exportToCSV, exportToPDF } = useReportExport();
    const CHART_ID = 'analysis-chart-div';

    // Initialize defaults on mount
    useEffect(() => {
        // Set default time range: Last 24 hours
        const end = new Date();
        const start = new Date();
        start.setHours(start.getHours() - 24);

        // Format for input datetime-local: YYYY-MM-DDTHH:mm
        const formatDateTime = (date: Date) => date.toISOString().slice(0, 16);

        setStartDate(formatDateTime(start));
        setEndDate(formatDateTime(end));

        // Check for preselected tag
        const preselectedId = searchParams.get('preselectedTagId');
        if (preselectedId) {
            const id = Number(preselectedId);
            if (!isNaN(id)) {
                setSelectedTagIds([id]);
                // Load info immediately if we have a tag
                loadHistoryData([id], formatDateTime(start), formatDateTime(end));
            }
        }
    }, [searchParams]);

    const loadHistoryData = async (ids: number[], start: string, end: string) => {
        if (ids.length === 0) {
            setChartSeries([]);
            return;
        }

        setIsLoading(true);
        try {
            // Convert inputs to ISO strings
            const startISO = new Date(start).toISOString();
            const endISO = new Date(end).toISOString();

            const history = await getHistory(ids, startISO, endISO);

            // Transform to Plotly Series
            const formattedSeries: ChartSeries[] = history.map((h: HistorySeries) => ({
                name: h.tagName || `Tag ${h.tagId}`,
                data: h.data.map(p => ({ x: new Date(p.x), y: p.y })),
                unit: ''
            }));

            setChartSeries(formattedSeries);
            toast.success("Datos históricos actualizados");
        } catch (error) {
            console.error(error);
            toast.error("Error al obtener historial");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoadClick = () => {
        if (selectedTagIds.length === 0) {
            toast.warning("Selecciona al menos un tag");
            return;
        }
        loadHistoryData(selectedTagIds, startDate, endDate);
    };

    const handleExportCSV = () => {
        if (chartSeries.length === 0) {
            toast.warning("No hay datos para exportar");
            return;
        }
        const filename = `reporte_scada_${new Date().toISOString().slice(0, 10)}`;
        exportToCSV(chartSeries, filename);
        toast.success("CSV Generado");
    };

    const handleExportPDF = async () => {
        if (chartSeries.length === 0) {
            toast.warning("No hay datos para exportar");
            return;
        }
        const filename = `reporte_scada_${new Date().toISOString().slice(0, 10)}`;
        await exportToPDF(CHART_ID, {
            title: selectedTagIds.map(id => chartSeries.find(s => s.name.includes(id.toString()))?.name || id).join(', '),
            dateRange: `${startDate.replace('T', ' ')} a ${endDate.replace('T', ' ')}`
        }, filename);
        toast.success("PDF Generado");
    };

    const handleExportPDFClick = () => {
        handleExportPDF();
    };


    return (
        <div className="flex h-screen bg-[#1a1a2e] text-white">
            {/* Sidebar Stats / Config */}
            <aside className="w-80 bg-[#16213e] border-r border-[#3a3a5c] p-4 flex flex-col gap-6 shrink-0 z-20 shadow-xl">
                <div>
                    <h2 className="text-xl font-bold text-gray-100 mb-1">Análisis Histórico</h2>
                    <p className="text-xs text-gray-400">Motor: Plotly.js (WebGL)</p>
                </div>

                {/* Configuration Form */}
                <div className="flex flex-col gap-4">
                    <TagMultiSelector
                        label="Selección de Tags (Max 4)"
                        value={selectedTagIds}
                        onChange={setSelectedTagIds}
                        size="sm"
                    />

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-400">Desde</label>
                        <input
                            type="datetime-local"
                            className="bg-[#1f1f38] border border-[#3a3a5c] rounded p-2 text-sm text-white focus:outline-none focus:border-blue-500 w-full"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm text-gray-400">Hasta</label>
                        <input
                            type="datetime-local"
                            className="bg-[#1f1f38] border border-[#3a3a5c] rounded p-2 text-sm text-white focus:outline-none focus:border-blue-500 w-full"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>

                    <Button
                        color="primary"
                        isLoading={isLoading}
                        onPress={handleLoadClick}
                        className="mt-2 w-full font-semibold shadow-lg shadow-blue-900/20"
                    >
                        Generar Gráfica
                    </Button>
                </div>

                <div className="mt-auto p-3 bg-[#1f1f38] rounded border border-[#3a3a5c]">
                    <h4 className="text-xs font-semibold text-gray-300 mb-1">Tips:</h4>
                    <ul className="text-[10px] text-gray-400 list-disc list-inside space-y-1">
                        <li>Usa el zoom para ver detalles.</li>
                        <li>Doble clic para restablecer vista.</li>
                        <li>Max 4 variables simultáneas.</li>
                    </ul>
                </div>
            </aside>

            {/* Main Chart Area */}
            <main className="flex-1 p-6 overflow-hidden flex flex-col relative z-0">
                <header className="flex justify-between items-center mb-4 bg-[#16213e]/50 p-3 rounded-lg border border-[#3a3a5c]">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-200">
                            {chartSeries.length > 0 ? 'Reporte de Tendencia' : 'Configuración Requerida'}
                        </h2>
                        <p className="text-xs text-gray-500">
                            {chartSeries.length} series cargadas
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Button size="sm" variant="flat" onPress={handleExportCSV} className="text-gray-300 hover:text-white">
                            📄 CSV
                        </Button>
                        <Button size="sm" variant="flat" onPress={handleExportPDFClick} className="text-gray-300 hover:text-white">
                            📑 PDF
                        </Button>
                    </div>
                </header>

                <Card className="flex-1 bg-[#1f1f38] border border-[#3a3a5c] shadow-md">
                    <CardBody className="p-0 h-full relative overflow-hidden flex flex-col">
                        {chartSeries.length > 0 ? (
                            <HistoricalChart
                                id={CHART_ID}
                                title="Comparativa de Variables de Proceso"
                                series={chartSeries}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
                                <div className="text-6xl opacity-20">📊</div>
                                <p>Selecciona tags y rango de fechas para visualizar.</p>
                            </div>
                        )}
                    </CardBody>
                </Card>
            </main>
        </div>
    );
}
