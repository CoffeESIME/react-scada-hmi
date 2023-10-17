// src/components/LineChart.tsx
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export const LineChart: React.FC = () => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Sample data with 15 points
    const data = [2, 3, 2, 4, 5, 4, 5, 6, 5, 6, 7, 8, 6, 7, 6];

    const svg = d3.select(ref.current);
    const width = 50;  // Width of SVG
    const height = 30;  // Height of SVG

    const xScale = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([d3.min(data)!, d3.max(data)!])
      .range([height, 0]);

    const line = d3.line<number>()
      .x((d, i) => xScale(i))
      .y(d => yScale(d));

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("d", line);

  }, []);

  return (
    <svg ref={ref} width="150" height="40"></svg>
  );
};
