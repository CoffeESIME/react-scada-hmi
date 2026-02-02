'use client';

import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
// Dynamic import for Plotly (client-side only)
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export interface HistoryPoint {
    x: Date;
    y: number;
}

export interface ChartSeries {
    name: string;
    data: HistoryPoint[];
    unit?: string;
    color?: string;
}

interface HistoricalChartProps {
    title: string;
    series: ChartSeries[];
    height?: string | number;
}

export const HistoricalChart: React.FC<HistoricalChartProps> = ({ title, series, height = '100%' }) => {

    // Prepare data for Plotly
    const plotData: Plotly.Data[] = useMemo(() => {
        return series.map((s, index) => ({
            name: s.name,
            x: s.data.map(p => p.x),
            y: s.data.map(p => p.y),
            type: 'scattergl' as const, // WebGL for performance
            mode: 'lines',
            line: {
                width: 2,
                color: s.color // Use provided color or let Plotly assign one
            },
            hovertemplate: `
            <b>${s.name}</b><br>
            Time: %{x}<br>
            Value: %{y:.2f} ${s.unit ?? ''}<br>
            <extra></extra>`
        }));
    }, [series]);

    // Layout Configuration
    const layout: Partial<Plotly.Layout> = {
        title: {
            text: title,
            font: { color: '#e2e8f0', size: 18 }
        },
        autosize: true,
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        showlegend: true,
        legend: {
            orientation: 'h',
            y: -0.2, // Move legend to bottom
            font: { color: '#cbd5e1' }
        },
        xaxis: {
            type: 'date',
            gridcolor: '#334155',
            linecolor: '#475569',
            tickfont: { color: '#94a3b8' },
            title: { text: 'Tiempo', font: { color: '#94a3b8' } },
            autorange: true
        },
        yaxis: {
            gridcolor: '#334155',
            linecolor: '#475569',
            tickfont: { color: '#94a3b8' },
            title: { text: 'Valor', font: { color: '#94a3b8' } },
            autorange: true
        },
        margin: { l: 50, r: 20, t: 50, b: 50 },
        // Interaction tools
        dragmode: 'pan',
    };

    const config: Partial<Plotly.Config> = {
        responsive: true,
        displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: ['lasso2d', 'select2d'],
        toImageButtonOptions: {
            format: 'png',
            filename: 'scada_analysis_export',
            height: 800,
            width: 1200,
            scale: 2
        }
    };

    return (
        <div style={{ width: '100%', height: height, minHeight: '400px' }}>
            <Plot
                data={plotData}
                layout={layout}
                config={config}
                style={{ width: '100%', height: '100%' }}
                useResizeHandler={true}
            />
        </div>
    );
};
