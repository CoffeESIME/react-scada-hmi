import { useCallback } from 'react';
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import { ChartSeries } from '@/app/components/charts/HistoricalChart';
// We need the Plotly object to verify or use types if strictly typed, 
// but for toImage we might need to cast the element or use window.Plotly if strictly necessary.
// Usually standard DOM element access + casting works if generic Plotly types are not perfectly set.
// Actually, it's better to expect the user to pass the element ID and we find it.
// We'll treat the retrieved element as 'any' to call a plot method if needed, 
// or import Plotly reference if we use Plotly.toImage directly.
// The user prompt said: "Use Plotly.toImage(div, ...)". 
// To allow this without importing the heavyweight Plotly lib here (which might break SSR or bloat), 
// we will rely on the global Plotly object or pass the Plotly instance. 
// However, since we are in a hook, we might not have access to the specific Plotly instance used by react-plotly.js easily.
// A common trick with react-plotly.js is that the DOM element ITSELF has the Plotly methods attached.
// So: const gd = document.getElementById(plotDivId); Plotly.toImage(gd, ...)

// Define metadata type
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

        // 1. Build CSV Content
        // Columns: ISO Timestamp, Tag Name, Value
        const header = ['ISO Timestamp', 'Tag Name', 'Value (Units)'];
        const rows: string[] = [];

        // Helper to escape CSV fields if needed
        const escape = (val: string | number) => `"${String(val).replace(/"/g, '""')}"`;

        seriesData.forEach(series => {
            const tagName = series.name;
            series.data.forEach(point => {
                const timestamp = point.x instanceof Date ? point.x.toISOString() : String(point.x);
                // Stacking data: simple approach
                rows.push(`${timestamp},${escape(tagName)},${point.y}`);
            });
        });

        const csvContent = [header.join(','), ...rows].join('\n');

        // 2. Create Blob and Download
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
            // We rely on the Plotly method attached to the graph div by the library
            // Or if 'Plotly' is available globally. Import("plotly.js") is heavy.
            // Usually react-plotly.js exposes the Plotly instance via onInitialized, but accessing the DOM node directly 
            // often gives access to the underlying _fullLayout or toImage via generic call if Plotly is global. 
            // WAIT: react-plotly.js components don't always expose global 'Plotly'. 
            // But the user prompt explicitly said: "Usa Plotly.toImage(div...)"
            // Let's assume 'Plotly' is explicitly imported or we dynamically import it?
            // Better yet: we can use the library's static method if we import it.
            // "import Plotly from 'plotly.js-dist-min'" or similar? 
            // Actually, importing 'plotly.js' here brings the whole lib. 
            // Let's simplify: we assume `window.Plotly` might exist or we import it dynamically to avoid huge bundle in initial chunks.
            // Let's try dynamic import of plotly.js-dist-min if implicit global fails, or just use `Chart` ref.

            // Simpler approach for this specific request:
            // Use the 'toImage' from the module if possible.
            const Plotly = (await import('plotly.js')).default;

            const dataUrl = await Plotly.toImage(gd, { format: 'png', width: 800, height: 400 });

            // Generate PDF
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();

            // Header
            doc.setFontSize(18);
            doc.setFont("helvetica", "bold");
            doc.text("Reporte Histórico SCADA", pageWidth / 2, 20, { align: 'center' });

            // Subtitle
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text(`Rango: ${metadata.dateRange}`, pageWidth / 2, 30, { align: 'center' });
            doc.text(`Tags: ${metadata.title}`, pageWidth / 2, 36, { align: 'center' });

            // Image
            // x=10, y=40, w=190 (page is ~210mm wide)
            doc.addImage(dataUrl, 'PNG', 10, 50, 190, 100);

            // Footer
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
