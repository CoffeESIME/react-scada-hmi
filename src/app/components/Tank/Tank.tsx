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
    width = 350,
    height = 450,
    fillColor = "#808080",
    strokeColor = "#000",
    strokeWidth = 1,
}) => {
    return (
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
        width={`${width}px`} 
        height={`${height}px`}  viewBox="0 0 444.000000 544.000000"
            >

            <g transform="translate(0.000000,508.000000) scale(0.100000,-0.100000)"
                fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth}>
                <path d="M1840 5034 c-225 -20 -531 -79 -720 -140 -350 -112 -566 -220 -807
-401 -117 -88 -288 -257 -277 -275 3 -5 9 -6 13 -1 157 188 356 343 609 472
283 144 563 233 918 292 184 31 199 32 578 36 420 5 522 -1 736 -43 215 -42
544 -137 685 -198 198 -86 445 -233 600 -358 67 -53 205 -196 205 -212 0 -3
-976 -6 -2170 -6 l-2170 0 0 -2070 0 -2070 2185 0 2185 0 2 2067 3 2068 -42
52 c-145 175 -379 346 -678 493 -173 85 -290 125 -560 195 -359 93 -399 98
-855 100 -217 1 -415 1 -440 -1z m2550 -2904 l0 -2050 -2165 0 -2165 0 0 2050
0 2050 2165 0 2165 0 0 -2050z"/>
            </g>
        </svg>
    );
};
