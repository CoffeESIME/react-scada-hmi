import React from 'react';

interface LabelProps {
    text: string;
    width?: number;
    height?: number;
    backgroundColor?: string;
    borderColor?: string;
    textColor?: string;
    fontSize?: number;
}

export const Label: React.FC<LabelProps> = ({
    text= "Cooling System",
    width = 100,
    height = 40,
    backgroundColor = "#f5f5f5",
    borderColor = "gray",
    textColor = "black",
    fontSize = 14
}) => {
    return (
        <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
            <path 
                d={`M10,0 L${width},0 L${width},${height} L10,${height} L0,${height/2} L10,0`} 
                fill={backgroundColor} 
                stroke={borderColor}
            />
            <text x="20" y={(height / 2) + (fontSize / 3)} 
                fontFamily="Arial" 
                fontSize={fontSize} 
                fill={textColor}>
                {text}
            </text>
        </svg>
    );
}