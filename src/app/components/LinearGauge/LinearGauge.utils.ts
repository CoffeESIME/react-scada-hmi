import { Threshold } from "./LinearGauge.type";
import config from "tailwindConfig";
export const calculateThresholdBackground = (thresholds: Threshold[]): string => {
    thresholds.sort((a, b) => a.max - b.max);
    
    const minValue = thresholds[0].max;
    const maxValue = thresholds[thresholds.length - 1].max;
    const range = maxValue - minValue;
    console.log(minValue, maxValue, range)
    let previousPercentage = 0;

    return `linear-gradient(to top, ${
        thresholds.map((threshold, index) => {
            const currentPercentage = Math.abs(((threshold.max - minValue) / range) * 100);
            const color = config.theme.extend.colors[threshold.classColor];
            const colorSegment = `${color} ${previousPercentage}%, ${color} ${currentPercentage}%`;
            previousPercentage = currentPercentage;
            console.log(colorSegment)
            return colorSegment;
        }).join(', ')
    })`;
};