// components/DataTrend.tsx
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface DataPoint {
  x: string;
  y: number;
}

function generateMockData(numPoints: number): DataPoint[] {
  const now = new Date();
  const data: DataPoint[] = [];

  for (let i = 0; i < numPoints; i++) {
    // Genera puntos en un intervalo de 1 segundo entre cada uno (por ejemplo)
    const time = new Date(now.getTime() - (numPoints - i) * 1000);
    data.push({
      x: time.toISOString(),
      y: Math.floor(Math.random() * 100), // valor aleatorio entre 0 y 100
    });
  }
  return data;
}

export default function DataTrend() {
  // State para guardar los datos del gráfico
  const [seriesData, setSeriesData] = useState<DataPoint[]>([]);

  // Config del gráfico
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
    // Generamos datos mock al montar el componente
    const initialData = generateMockData(20); // 20 puntos iniciales
    setSeriesData(initialData);

    // Si quieres simular datos en tiempo real, puedes usar un setInterval
    // para agregar nuevos puntos de forma periódica.
    const interval = setInterval(() => {
      setSeriesData(prevData => {
        const newData = [...prevData];
        const nextPoint = {
          x: new Date().toISOString(),
          y: Math.floor(Math.random() * 100),
        };
        // Agrega al final y elimina el primer dato para que se mantenga la longitud
        newData.push(nextPoint);
        newData.shift();
        return newData;
      });
    }, 3000); // cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  const series = [
    {
      name: 'MyDataTrend',
      data: seriesData,
    },
  ];

  return (
    <div style={{ width: '100%', height: '400px' }}>
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
