import React, { useEffect, useRef, useState } from 'react';
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
  timedPoints?: DataPoint[];
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
  timedPoints,
  dataPoints = [],
  setPoint,
  limitBottom,
  limitTop,
  yAxis,
  title,
}: DataTrendProps) {
  const [seriesData, setSeriesData] = useState<DataPoint[]>([]);

  // ── RAÍZ DEL BUG ORIGINAL ──────────────────────────────────────────────────
  // `yAxis` es un objeto: aunque sus valores numéricos no cambien, el componente
  // padre puede crear una nueva referencia en cada render (objeto literal inline).
  // Meterlo en el array de deps del useEffect causaba que el efecto se disparara
  // en cada render → setSeriesData → nuevo render → loop infinito.
  //
  // FIX: extraer los primitivos min/max. React compara números por valor,
  // no por referencia, por lo que el efecto sólo corre cuando los números cambian.
  const yAxisMin = yAxis?.min;
  const yAxisMax = yAxis?.max;

  // Guard para dataPoints: comparar el contenido del array, no su referencia.
  // Si el padre recrea el array `[]` en cada render con los mismos valores,
  // este ref evita re-disparar el efecto innecesariamente.
  const dataPointsRef = useRef<string>('');

  useEffect(() => {
    // Caso 1: datos con timestamp ya resueltos (MQTT / histórico de BD).
    if (timedPoints && timedPoints.length > 0) {
      setSeriesData(timedPoints);
      return;
    }

    // Caso 2: array de valores planos → construir timestamps sintéticos.
    if (dataPoints && dataPoints.length > 0) {
      const serialized = JSON.stringify(dataPoints);
      if (serialized === dataPointsRef.current) return; // Mismos datos, no re-renderizar.
      dataPointsRef.current = serialized;

      const now = new Date();
      const points: DataPoint[] = dataPoints.map((val, i) => ({
        x: new Date(now.getTime() - (dataPoints.length - i) * 1000).toISOString(),
        y: val,
      }));
      setSeriesData(points);
      return;
    }

    // Caso 3: sin datos reales → generar datos de preview para el editor.
    // Sólo se genera en el PRIMER montaje (cuando seriesData está vacío).
    // El funcional updater evita que la comparación sea otra dependencia.
    setSeriesData(prev => {
      if (prev.length > 0) return prev; // Ya hay datos mock, no regenerar.
      return generateMockData(20, yAxisMin ?? 0, yAxisMax ?? 100);
    });

  // Las dependencias son PRIMITIVOS (number | undefined), comparables por valor.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timedPoints, dataPoints, yAxisMin, yAxisMax]);

  const annotations: ApexAnnotations = { yaxis: [] };

  if (setPoint !== undefined) {
    annotations.yaxis?.push({
      y: setPoint,
      borderColor: '#3b82f6',
      borderWidth: 1,
      strokeDashArray: 5,
      label: {
        borderColor: 'transparent',
        style: { color: '#3b82f6', background: 'transparent' },
        text: '',
      },
    });
  }

  if (limitTop !== undefined) {
    annotations.yaxis?.push({
      y: limitTop,
      borderColor: '#94a3b8',
      strokeDashArray: 2,
      borderWidth: 1,
      opacity: 0.5,
    });
  }

  if (limitBottom !== undefined) {
    annotations.yaxis?.push({
      y: limitBottom,
      borderColor: '#94a3b8',
      strokeDashArray: 2,
      borderWidth: 1,
      opacity: 0.5,
    });
  }

  const chartOptions: ApexOptions = {
    chart: {
      id: 'dataTrendChart',
      toolbar: { show: false },
      background: 'transparent',
      foreColor: '#64748b',
      animations: { enabled: false },
    },
    title: {
      text: title,
      align: 'left',
      margin: 20,
      style: { color: '#475569', fontSize: '12px', fontWeight: 500 },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        show: true,
        datetimeUTC: false,
        style: { colors: '#64748b', fontSize: '11px' },
        datetimeFormatter: {
          year: 'yyyy',
          month: "MMM 'yy",
          day: 'dd MMM',
          hour: 'HH:mm',
          minute: 'HH:mm:ss',
          second: 'HH:mm:ss',
        },
      },
      tooltip: { enabled: false },
      axisBorder: { show: true, color: '#e2e8f0' },
      axisTicks: { show: true, color: '#e2e8f0' },
    },
    yaxis: {
      min: yAxisMin,
      max: yAxisMax,
      tickAmount: 3,
      labels: {
        style: { colors: '#64748b', fontSize: '11px' },
        formatter: (val) => val.toFixed(1),
      },
    },
    grid: { borderColor: '#e2e8f0', strokeDashArray: 4, position: 'back' },
    stroke: { curve: 'smooth', width: 1.5 },
    theme: { mode: 'light' },
    tooltip: {
      theme: 'dark',
      style: { fontSize: '12px', fontFamily: 'inherit' },
      x: { format: 'HH:mm:ss' },
      y: { formatter: (val) => val.toFixed(1) },
      marker: { show: true },
    },
    annotations: annotations,
    colors: ['#3b82f6'],
    dataLabels: { enabled: false },
  };

  const series = [{ name: title || 'Value', data: seriesData }];

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
