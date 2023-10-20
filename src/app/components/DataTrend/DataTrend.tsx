import React, { FC, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false })
import { ApexOptions } from "apexcharts";
import { createSeriesConstant } from "./DataTrend.utils";

type SeriesType = {
    name: string;
    data: number[];
}[];

interface DataTrendProps {
    dataPoints: number[];
    yAxis: {
        max: number;
        min: number;
    };
    setPoint: number;
    limitBottom: number;
    limitTop: number;
    xAxis: {
        max: number;
        min: number;
    },
    title: string;
}

export const DataTrend: React.FC<DataTrendProps> = ({ dataPoints, setPoint, limitBottom, limitTop, xAxis, yAxis , title}) => {
    const [options, setOptions] = useState<ApexOptions>({
        chart: {
            id: "basic-bar",
            toolbar: {
                show: false
            },
            animations: {
                enabled: false
            }

        },
        colors: ['#475CA7', '#23903D', '#888888', '#888888'],
        legend: {
            show: false
        },

        yaxis: {
            max: yAxis.max + 2,
            min: yAxis.min - 2,
            tickAmount: 2,
            decimalsInFloat: 1
        },
        xaxis: {
            tickAmount: 4,
            axisTicks: {
                show: false
            }
        },

        tooltip: {
            enabled: false
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            dashArray: [0, 3, 4, 4],
            width: 1
        },
        title:
        {
            text: title,
            margin: 0,
            offsetY: 25,
            offsetX: 35,
            style:{
                fontSize: "11",
                fontWeight: 1
            }
        },
        grid: {
            show: false
        },

    });

    const [series, setSeries] = useState<SeriesType>([
        {
            name: "series-1",
            data: dataPoints,
        },
    ]);

    useEffect(() => {
        const arraySetPoint = createSeriesConstant(setPoint, dataPoints.length)

        const arrayLimMin = createSeriesConstant(limitBottom, dataPoints.length)

        const arrayLimMax = createSeriesConstant(limitTop, dataPoints.length)

        const arraysData = [
            {
                name: "setpoint",
                data: arraySetPoint
            },
            {
                name: "limMax",
                data: arrayLimMax
            },
            {
                name: "limMin",
                data: arrayLimMin
            }
        ]
        setSeries([...series, ...arraysData])
    }, [setPoint, limitBottom, limitTop])

    return (
        <ApexCharts options={options} series={series} type="line" width={300} height={190} />
        
    );
};
