import { useCallback } from 'react';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { ChartSeries } from '@/app/components/charts/HistoricalChart';

interface ReportMetadata {
    title: string;
    dateRange: string;
}

export const useReportExport = () => {

    const exportToCSV = useCallback((seriesData: ChartSeries[], filename: string) => {
        if (!seriesData || seriesData.length === 0) {
            console.warn("No data to export");
            return;
        }

        const header = ['ISO Timestamp', 'Tag Name', 'Value (Units)'];
        const rows: string[] = [];
        const escape = (val: string | number) => `"${String(val).replace(/"/g, '""')}"`;

        seriesData.forEach(series => {
            const tagName = series.name;
            series.data.forEach(point => {
                let timestamp: string;
                if (point.x instanceof Date) {
                    timestamp = isNaN(point.x.getTime())
                        ? 'Invalid Date'
                        : point.x.toISOString();
                } else {
                    timestamp = String(point.x);
                }
                rows.push(`${timestamp},${escape(tagName)},${point.y}`);
            });
        });

        const csvContent = [header.join(','), ...rows].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, []);

    const exportToPDF = useCallback(async (plotDivId: string, metadata: ReportMetadata, filename: string) => {
        const gd = document.getElementById(plotDivId) as any;
        if (!gd) {
            console.error(`Plot element not found: ${plotDivId}`);
            return;
        }

        try {
            const Plotly = (await import('plotly.js')).default;

            const dataUrl = await Plotly.toImage(gd, { format: 'png', width: 800, height: 400 });

            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();

            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.text("Reporte Histórico SCADA", pageWidth / 2, 20, { align: 'center' });
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text(`Rango: ${metadata.dateRange}`, pageWidth / 2, 30, { align: 'center' });
            doc.text(`Tags: ${metadata.title}`, pageWidth / 2, 36, { align: 'center' });

            doc.addImage(dataUrl, 'PNG', 10, 50, 190, 100);

            doc.setFontSize(10);
            doc.setTextColor(100);
            const dateStr = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
            doc.text(`Generado el: ${dateStr}`, 10, 200);

            doc.save(`${filename}.pdf`);

        } catch (error) {
            console.error("PDF Generation failed", error);
        }
    }, []);

    return { exportToCSV, exportToPDF };
};
