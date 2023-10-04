type Threshold = {
    max: number;
    color: string;
}

export const getColorForValue = (value: number, thresholds: Threshold[]): string => {
    for (let threshold of thresholds) {
        if (value <= threshold.max) {
            return threshold.color;
        }
    }
    return '#000'; // default color if no thresholds match
};
