// components/DataTrend.tsx
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface DataPoint {
  x: string;
  y: number;
}

interface DataTrendProps {
  width?: number | string;
  height?: number | string;
}

function generateMockData(numPoints: number): DataPoint[] {
  const now = new Date();
  const data: DataPoint[] = [];

  for (let i = 0; i < numPoints; i++) {
    const time = new Date(now.getTime() - (numPoints - i) * 1000);
    data.push({
      x: time.toISOString(),
      y: Math.floor(Math.random() * 100),
    });
  }
  return data;
}

export default function DataTrend({ width = '100%', height = 400 }: DataTrendProps) {
  const [seriesData, setSeriesData] = useState<DataPoint[]>([]);

  const [chartOptions, setChartOptions] = useState<any>({
    chart: {
      id: 'dataTrendChart',
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        format: 'HH:mm:ss',
      },
    },
    stroke: {
      curve: 'smooth',
    },
    yaxis: {
      min: 0,
      max: 100,
    },
    tooltip: {
      x: {
        format: 'HH:mm:ss',
      },
    },
  });

  useEffect(() => {
    const initialData = generateMockData(20);
    setSeriesData(initialData);

    const interval = setInterval(() => {
      setSeriesData(prevData => {
        const newData = [...prevData];
        const nextPoint = {
          x: new Date().toISOString(),
          y: Math.floor(Math.random() * 100),
        };
        newData.push(nextPoint);
        newData.shift();
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const series = [
    {
      name: 'MyDataTrend',
      data: seriesData,
    },
  ];

  return (
    <div style={{ width: width, height: height }}>
      <Chart
        options={chartOptions}
        series={series}
        type="line"
        width="100%"
        height="100%"
      />
    </div>
  );
}
