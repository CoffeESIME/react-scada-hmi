import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export type smallLineChart = {
  data?: number[];
  width?: number;
  height?: number;
  min?: number;
  max?: number;
};

export const SmallDataTrend: React.FC<smallLineChart> = ({
  data,
  width = 200,
  height = 80,
  min = 0,
  max = 10,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const finalData = data && data.length > 0 ? data : [2, 3, 2, 4, 5, 4, 5, 6, 5, 6, 5, 6];

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    svg.selectAll('*').remove();

    const xScale = d3
      .scaleLinear()
      .domain([0, finalData.length - 1])
      .range([0, width]);

    const dataMin = d3.min(finalData) ?? 0;
    const dataMax = d3.max(finalData) ?? 100;
    const bandMin = min ?? dataMin;
    const bandMax = max ?? dataMax;

    const viewMin = Math.min(dataMin, bandMin);
    const viewMax = Math.max(dataMax, bandMax);

    const padding = (viewMax - viewMin) * 0.1 || 1;

    const yScale = d3
      .scaleLinear()
      .domain([viewMin - padding, viewMax + padding])
      .range([height, 0]);

    const line = d3
      .line<number>()
      .x((d, i) => xScale(i))
      .y((d) => yScale(d));
    svg
      .append('rect')
      .attr('x', 0)
      .attr('y', yScale(bandMax))
      .attr('width', width)
      .attr('height', yScale(bandMin) - yScale(bandMax))
      .attr('fill', 'rgba(100, 150, 240, 0.3)');

    svg
      .append('path')
      .datum(finalData)
      .attr('fill', 'none')
      .attr('stroke', '#475CA7')
      .attr('stroke-width', 2)
      .attr('d', line);
  }, [finalData, width, height, min, max]);

  return (
    <svg ref={svgRef} width={width} height={height} />
  );
};
