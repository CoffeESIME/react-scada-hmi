// components/DataTrend.tsx
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface DataPoint {
  x: string;
  y: number;
}

interface DataTrendProps {
  width?: number | string;
  height?: number | string;
  dataPoints?: number[];
  setPoint?: number;
  limitBottom?: number;
  limitTop?: number;
  xAxis?: { min: number; max: number };
  yAxis?: { min: number; max: number };
  title?: string;
}

function generateMockData(numPoints: number, min = 0, max = 100): DataPoint[] {
  const now = new Date();
  const data: DataPoint[] = [];

  for (let i = 0; i < numPoints; i++) {
    const time = new Date(now.getTime() - (numPoints - i) * 1000);
    data.push({
      x: time.toISOString(),
      y: Math.floor(Math.random() * (max - min + 1)) + min,
    });
  }
  return data;
}

export default function DataTrend({
  width = '100%',
  height = 400,
  dataPoints = [],
  setPoint,
  limitBottom,
  limitTop,
  yAxis,
  title,
}: DataTrendProps) {
  const [seriesData, setSeriesData] = useState<DataPoint[]>([]);

  useEffect(() => {
    if (dataPoints && dataPoints.length > 0) {
      const now = new Date();
      const points: DataPoint[] = dataPoints.map((val, i) => ({
        x: new Date(now.getTime() - (dataPoints.length - i) * 1000).toISOString(),
        y: val,
      }));
      setSeriesData(points);
    } else {
      setSeriesData(generateMockData(20, yAxis?.min ?? 0, yAxis?.max ?? 100));
    }
  }, [dataPoints, yAxis]);

  const annotations: ApexAnnotations = {
    yaxis: [],
  };

  if (setPoint !== undefined) {
    annotations.yaxis?.push({
      y: setPoint,
      borderColor: '#3b82f6', // Azul más sutil/estándar
      borderWidth: 1,
      strokeDashArray: 5,
      label: {
        borderColor: 'transparent',
        style: { color: '#3b82f6', background: 'transparent' },
        text: '', // Sin texto, solo línea como en la imagen
      },
    });
  }

  if (limitTop !== undefined) {
    annotations.yaxis?.push({
      y: limitTop,
      borderColor: '#94a3b8', // Gris
      strokeDashArray: 2,
      borderWidth: 1,
      opacity: 0.5,
    });
  }

  if (limitBottom !== undefined) {
    annotations.yaxis?.push({
      y: limitBottom,
      borderColor: '#94a3b8', // Gris
      strokeDashArray: 2,
      borderWidth: 1,
      opacity: 0.5,
    });
  }

  // Estilo basado en la imagen de referencia (SCADA clásico/limpio)
  const chartOptions: ApexOptions = {
    chart: {
      id: 'dataTrendChart',
      toolbar: { show: false },
      background: 'transparent',
      foreColor: '#64748b', // Slate-500 para texto
      animations: { enabled: false }, // SCADA real-time feel
    },
    title: {
      text: title,
      align: 'left',
      margin: 20, // Reducir margen para acercarlo a los datos
      style: {
        color: '#475569', // Slate-600
        fontSize: '12px',
        fontWeight: 500
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        show: true,
        style: { colors: '#64748b', fontSize: '11px' },
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMM \'yy',
          day: 'dd MMM',
          hour: 'HH:mm',
          minute: 'HH:mm:ss',
          second: 'HH:mm:ss',
        },
      }, // Mostrar etiquetas X
      tooltip: { enabled: false },
      axisBorder: { show: true, color: '#e2e8f0' }, // Mostrar línea de eje X
      axisTicks: { show: true, color: '#e2e8f0' }, // Mostrar ticks
    },
    yaxis: {
      min: yAxis?.min,
      max: yAxis?.max,
      tickAmount: 3, // Pocos ticks como en la imagen
      labels: {
        style: { colors: '#64748b', fontSize: '11px' },
        formatter: (val) => val.toFixed(1),
      },
    },
    grid: {
      borderColor: '#e2e8f0', // Color muy claro (o usa 'transparent' para quitarla del todo)
      strokeDashArray: 4, // Líneas punteadas (más sutil que sólidas)
      position: 'back',
    },
    stroke: {
      curve: 'smooth', // O 'straight' según preferencia, 'smooth' se ve bien
      width: 1.5, // Línea delgada como en la imagen
    },
    theme: {
      mode: 'light', // Forzamos light para el look limpio
    },
    tooltip: {
      theme: 'dark', // Tooltip oscuro para alto contraste
      style: {
        fontSize: '12px',
        fontFamily: 'inherit',
      },
      x: { format: 'HH:mm:ss' },
      y: {
        formatter: (val) => val.toFixed(1),
      },
      marker: { show: true },
    },
    annotations: annotations,
    colors: ['#3b82f6'], // Azul clásico
    dataLabels: { enabled: false },
  };

  const series = [
    {
      name: title || 'Value',
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
