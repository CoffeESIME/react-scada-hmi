import React from 'react';
interface TankProps {
    width?: number;
    height?: number;
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    cornerRadius?: number;
}

export const Tank: React.FC<TankProps> = ({
    width = 500,
    height = 700,
    fillColor = "#ddd",
    strokeColor = "#000",
    strokeWidth = 1,
    cornerRadius = 160
}) => {
    return (
        <svg width={width} height={height}>
            
            <rect
                x={0}
                y={0}
                width={width}
                height={height}
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                rx={cornerRadius}
                ry={cornerRadius}
            >
                
            </rect>
        </svg>
    );
};
