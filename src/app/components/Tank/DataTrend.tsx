// src/components/LineChart.tsx
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const LineChart: React.FC = () => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Sample data
    const data = [{x: 1, y: 2}, {x: 2, y: 3}, {x: 3, y: 5}, {x: 4, y: 4}, {x: 5, y: 6}];

    // Select the SVG element
    const svg = d3.select(ref.current);

    // Define scales
    const xScale = d3.scaleLinear().domain([1, 5]).range([40, 460]);
    const yScale = d3.scaleLinear().domain([1, 6]).range([260, 20]);

    // Define the line generator
    const line = d3.line<{x: number, y: number}>()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y));

    // Append the line to the SVG
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("d", line);

    // Append axes to the SVG
    svg.append("g").attr("transform", "translate(0, 260)").call(d3.axisBottom(xScale));
    svg.append("g").attr("transform", "translate(40, 0)").call(d3.axisLeft(yScale));
  }, []);

  return (
    <svg ref={ref} width="500" height="300"></svg>
  );
};

export default LineChart;
