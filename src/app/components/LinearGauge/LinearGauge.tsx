import React, { useMemo } from "react";
import { LinearGaugeProps } from "./LinearGauge.type";
import { getColorForValue } from "./LinearGauge.utils";
import { needleStyle } from "./LinearGauge.style";
import "./LinearGauge.css"
const LinearGauge: React.FC<LinearGaugeProps> = ({
  value,
  width = '80px',
  height = '300px',
  fontSize = '3rem',
  fontFamily = 'Arial, sans-serif',
  borderColor = 'black',
  borderWidth = '2px',
  thresholds = [
    { max: 20, color: "#cccccc" },
    { max: 40, color: "#999999" },
    { max: 70, color: "#666666" },
    { max: 90, color: "#333333" },
    { max: 100, color: "#000000" },
  ],
}) => {

  const needleSize: number = useMemo(() => parseInt(width) * 0.3, [width]);
  const setPointSize: number = parseInt(width) / 2;
  const setPointStyle = {
    width: `${setPointSize}px`,
    height: `${setPointSize}px`,
    backgroundColor: "black",
    position: "absolute" as "absolute",
    bottom: "50%",
    left: "50%",
    transform: "translate(-50%, 50%) rotate(45deg)",
    zIndex: 2,
  };
  const thresholdBackground: string = useMemo(() => {
    let colors = thresholds.map((t) => t.color);
    let segments = [];
    for (let i = 0; i < colors.length; i++) {
      segments.push(
        `${colors[i]} ${i > 0 ? thresholds[i - 1].max : 0}%, ${colors[i]} ${thresholds[i].max}%`
      );
    }
    return `linear-gradient(to top, ${segments.join(", ")})`;
  }, [thresholds]);

  return (
    <div className="relative flex flex-col-reverse justify-between border-solid"
      style={{
        width,
        height,
        border: `${borderWidth} solid ${borderColor}`,
        fontFamily,
      }}
    >
      <div
        className="w-full flex-1 z-0"
        style={{
          background: thresholdBackground,
        }}
      ></div>

      <div
        className="absolute left-3/4 transform translate-x-9 flex flex-col items-center"
        style={{
          bottom: `${value - 1}%`,
        }}
      >
        <div className="text-xl text-black" style={{
          fontSize,
        }}>{value}</div>
      </div>

      <div
        className="absolute left-1/2 transform -translate-x-1/2 text-7xlxl text-black"
        style={{
          bottom: "-20%",
          fontSize: '2rem',
        }}
      >
        lt
      </div>

      <div style={setPointStyle}></div>

      <div style={needleStyle(needleSize, getColorForValue(value, thresholds), value)}></div>
    </div>
  );
}

export default LinearGauge;
