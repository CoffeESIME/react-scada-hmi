import React from 'react';

interface LabelProps {
  text: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  fontSize?: number;
  triangleDirection?: 'left' | 'right';
}

export const Label: React.FC<LabelProps> = ({
  text = 'Cooling System',
  width = 100,
  height = 40,
  backgroundColor = '#C6C6C6',
  borderColor = 'gray',
  textColor = 'black',
  fontSize = 14,
  triangleDirection = 'right',
}) => {
  const pathD =
    triangleDirection === 'left'
      ? `M0,${
          height / 2
        } L10,0 L${width},0 L${width},${height} L10,${height} L0,${height / 2}`
      : `M0,0 L${width - 10},0 L${width},${height / 2} L${
          width - 10
        },${height} L0,${height} L0,0`;

  return (
    <svg width={width} height={height} xmlns='http://www.w3.org/2000/svg'>
      <path d={pathD} fill={backgroundColor} stroke={borderColor} />
      <text
        x='20'
        y={height / 2 + fontSize / 3}
        fontFamily='Arial'
        fontSize={fontSize}
        fill={textColor}
      >
        {text}
      </text>
    </svg>
  );
};
