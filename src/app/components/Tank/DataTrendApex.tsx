import React, { FC, useState } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

type SeriesType = {
  name: string;
  data: number[];
}[];

export const DataTrendApex: FC = () => {
  // Define state using useState hook
  const [options, setOptions] = useState<ApexOptions>({
    chart: {
      id: 'basic-bar',
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
    },
  });

  const [series, setSeries] = useState<SeriesType>([
    {
      name: 'series-1',
      data: [30, 40, 45, 50, 49, 60, 70, 91],
    },
  ]);

  return (
    <div className="app">
      <div className="row">
        <div className="mixed-chart">
          <Chart options={options} series={series} type="line" width="100" />
        </div>
      </div>
    </div>
  );
};
