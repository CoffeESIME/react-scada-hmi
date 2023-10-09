import React from 'react';
import { Card, Text, Metric } from "@tremor/react";
export const LineChart: React.FC = ({
}) => {
    return <Card className="max-w-xs mx-auto">
        <Text>Sales</Text>
        <Metric>$ 34,743</Metric>
    </Card>;
};
