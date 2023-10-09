import React, { FC, useState } from "react";
import dynamic from "next/dynamic";
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false })
import { ApexOptions } from "apexcharts";

type SeriesType = {
    name: string;
    data: number[];
}[];

export const DataTrend: FC = () => {
    const [options, setOptions] = useState<ApexOptions>({
        chart: {
            id: "basic-bar",
            toolbar: {
                show: false
            },
            
        },
        xaxis: {
            categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998],
        },
        tooltip: {
            enabled: false
        }
    });

    const [series, setSeries] = useState<SeriesType>([
        {
            name: "series-1",
            data: [30, 40, 45, 50, 49, 60, 70, 91],
        },
    ]);

    return (
        <ApexCharts options={options} series={series} type="line" width={500} height={250} />
    );
};
