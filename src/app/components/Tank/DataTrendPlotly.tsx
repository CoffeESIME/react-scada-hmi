import React from 'react';
import Plot from 'react-plotly.js';
import { Data, Layout } from 'plotly.js';

// Define the type for the data prop
type PlotType = 'scatter' | 'bar';
type DataType = {
    x: number[];
    y: number[];
    type: PlotType;
    mode?: string;
    marker?: { color: string };
}[];

// Define the type for the layout prop
type LayoutType = {
    width: number;
    height: number;
    title: string;
};

// Define the props type
type LineChartProps = {
    data?: DataType;
    layout?: LayoutType;
};

export const LineChartPlotly: React.FC<LineChartProps> = ({
    data = [
        {
            x: [1, 2, 3],
            y: [2, 6, 3],
            type: 'scatter',
            mode: 'lines+markers',
            marker: { color: 'red' },
        },
    ],
    layout = { width: 120, height: 240, title: 'A Fancy Plot' },
}) => {
    return <Plot data={data as Data[]} layout={layout as Layout}  config={{responsive: true}}/>;
};
