import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export type smallLineChart = {
  data: number[],
  width: number,
  height: number,
  min: number,
  max: number,
}

export const SmallDataTrend: React.FC<smallLineChart> = ({
  data = [2, 3, 2, 4, 5, 4, 5, 6, 5, 6, 7, 8, 6, 7, 6],
  width,
  height,
  min,
  max }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(ref.current);
    const xScale = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([d3.min(data)!, d3.max(data)!])
      .range([height, 0]);

    const line = d3.line<number>()
      .x((d, i) => xScale(i))
      .y(d => yScale(d));
    const y1 = min; // start of the band
    const y2 = max; // end of the band
    svg.append("rect")
      .attr("x", 0)
      .attr("y", yScale(y2))
      .attr("width", width)
      .attr("height", yScale(y1) - yScale(y2))
      .attr("fill", "rgba(100, 150, 240, 0.3)");
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#475CA7")
      .attr("d", line);

  }, []);

  return (
    <svg ref={ref} width={width} height={height}></svg>
  );
};
