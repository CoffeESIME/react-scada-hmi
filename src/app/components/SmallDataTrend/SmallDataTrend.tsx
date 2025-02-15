import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export type smallLineChart = {
  /** Datos para graficar */
  data?: number[];
  /** Ancho del gráfico */
  width?: number;
  /** Alto del gráfico */
  height?: number;
  /** Mínimo de la banda en el eje Y */
  min?: number;
  /** Máximo de la banda en el eje Y */
  max?: number;
};

/**
 * Renderiza un gráfico usando D3.
 * - Si `data` no viene por props (o está vacío), usamos un mock por defecto.
 * - Cada vez que cambien los props, se redibuja el SVG.
 */
export const SmallDataTrend: React.FC<smallLineChart> = ({
  data,
  width = 200,
  height = 80,
  min = 0,
  max = 10,
}) => {
  // Referencia al elemento <svg> donde pintamos con D3
  const svgRef = useRef<SVGSVGElement>(null);

  // Si no llega data por props, tomamos un mock
  const finalData = data && data.length > 0 ? data : [2, 3, 2, 4, 5, 4, 5, 6, 5, 6, 5, 6];

  useEffect(() => {
    // Seleccionamos el <svg>
    const svg = d3.select(svgRef.current);

    // Limpiamos el contenido previo antes de volver a dibujar
    // (evita que se superpongan múltiples paths al actualizar)
    svg.selectAll('*').remove();

    // Escala horizontal (x)
    const xScale = d3
      .scaleLinear()
      .domain([0, finalData.length - 1])
      .range([0, width]);

    // Escala vertical (y)
    // Si deseas que min y max manden 100% (forzando el rango),
    // no uses d3.min() ni d3.max(). En caso contrario, combina:
    const yDomainMin = (min !== undefined) ? min : d3.min(finalData) ?? 0;
    const yDomainMax = (max !== undefined) ? max : d3.max(finalData) ?? 100;

    const yScale = d3
      .scaleLinear()
      .domain([yDomainMin, yDomainMax])
      .range([height, 0]);

    // Generador de línea
    const line = d3
      .line<number>()
      .x((d, i) => xScale(i))
      .y((d) => yScale(d));

    // Dibujamos el rectángulo que marca la "banda" (entre min y max)
    svg
      .append('rect')
      .attr('x', 0)
      // yScale(yDomainMax) => parte superior
      .attr('y', yScale(yDomainMax))
      .attr('width', width)
      // altura = diferencia entre la parte baja y alta de la banda en el svg
      .attr('height', yScale(yDomainMin) - yScale(yDomainMax))
      .attr('fill', 'rgba(100, 150, 240, 0.3)');

    // Dibujamos la línea con los datos
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
