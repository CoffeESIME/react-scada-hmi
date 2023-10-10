import React, { useMemo } from "react";
import { LinearGaugeProps } from "./LinearGauge.type";
import { calculateThresholdBackground } from "./LinearGauge.utils";
import { needleStyle, thresholdsStyle } from "./LinearGauge.style";
import tailwindConfig from 'tailwindConfig'
import "./LinearGauge.css"
const LinearGauge: React.FC<LinearGaugeProps> = ({
  value,
  alarmStatus = false,
  units = 'lt/s',
  width = '20px',
  height = '100px',
  fontSize = '12px',
  fontFamily = 'Arial, sans-serif',
  borderColor = 'black',
  borderWidth = '2px',
  thresholds = thresholdsStyle([
    { max: -30, classColor: "", identifier: "Normal" },
    { max: -20, classColor: "", identifier: "High Priority Alarm" },
    { max: -10, classColor: "", identifier: "Medium Priority Alarm" },
    { max: 70, classColor: "", identifier: "Normal" },
    { max: 90, classColor: "", identifier: "Medium Priority Alarm" },
    { max: 100, classColor: "", identifier: "High Priority Alarm" },
  ], alarmStatus)
  ,
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
  const thresholdBackground = calculateThresholdBackground(thresholds)


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
        <div className="text-xl text-black font-mono" style={{
          fontSize,
        }}>{value}</div>
      </div>

      <div
        className="absolute left-1/2 transform -translate-x-1/2 text-7xlxl text-black"
        style={{
          bottom: "-30%",
          fontSize: '12px',
        }}
      >
        {units}
      </div>

      <div style={setPointStyle}></div>

      <div style={needleStyle(needleSize, (tailwindConfig.theme?.extend?.colors as any)['primary-indicator-fg'] || '#defaultColorValue'
        , value)}></div>
    </div>
  );
}

export default LinearGauge;
