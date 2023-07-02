<template>
  <div id="resultPlot"></div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as d3 from 'd3';

export default Vue.extend({
  name: 'ResultPlot',
  props: {
    xLowerBound: { type: Number, required: true },
    xUpperBound: { type: Number, required: true },
    yLowerBound: { type: Number, required: true },
    yUpperBound: { type: Number, required: true },
    pointCoordinate: {
      type: Array as unknown as () => [number, number],
      required: true,
    },
    quadrantLabels: {
      type: Array as unknown as () => [string, string, string, string],
      required: true,
    },
    tooltipElementId: { type: String, default: 'resultPointTooltip' },
    viewBoxSize: { type: Number, default: 500 },
    margins: {
      type: Object,
      default: () => ({ top: 16, right: 16, bottom: 16, left: 16 }),
    },
    pointRadius: { type: Number, default: 7.5 },
    quadrantColors: {
      type: Array as unknown as () => [number, number, number, number],
      default: () => ['#d9edd6', '#faf1d3', '#faf1d3', '#f2cfcc'],
    },
  },
  mounted() {
    this.createResultPlot();
  },
  methods: {
    createResultPlot() {
      const svg = d3
        .select('#resultPlot')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${this.viewBoxSize} ${this.viewBoxSize}`);

      const xScale = this.getScale(
        this.xLowerBound,
        this.xUpperBound,
        this.margins.left,
        this.viewBoxSize - this.margins.right
      );
      const yScale = this.getScale(
        this.yLowerBound,
        this.yUpperBound,
        this.viewBoxSize - this.margins.bottom,
        this.margins.top
      );

      const quadrantSize = '50%';
      // Quadrant rects
      svg
        .append('rect')
        .attr('width', quadrantSize)
        .attr('height', quadrantSize)
        .attr('fill', this.quadrantColors[0]); // Upper left rect
      svg
        .append('rect')
        .attr('width', quadrantSize)
        .attr('height', quadrantSize)
        .attr('x', quadrantSize)
        .attr('fill', this.quadrantColors[1]); // Upper right
      svg
        .append('rect')
        .attr('width', quadrantSize)
        .attr('height', quadrantSize)
        .attr('y', quadrantSize)
        .attr('fill', this.quadrantColors[2]); // Lower left
      svg
        .append('rect')
        .attr('width', quadrantSize)
        .attr('height', quadrantSize)
        .attr('x', quadrantSize)
        .attr('y', quadrantSize)
        .attr('fill', this.quadrantColors[3]); // Lower right

      // Quadrant labels
      const offsetFactor = 0.05;
      svg
        .append('text')
        .attr('x', (0.5 - offsetFactor) * this.viewBoxSize)
        .attr('y', offsetFactor * this.viewBoxSize)
        .attr('text-anchor', 'end')
        .text(this.quadrantLabels[0]); // Upper left label
      svg
        .append('text')
        .attr('x', (1 - offsetFactor) * this.viewBoxSize)
        .attr('y', (0.5 + offsetFactor) * this.viewBoxSize)
        .attr('text-anchor', 'end')
        .text(this.quadrantLabels[1]); // Upper right label
      svg
        .append('text')
        .attr('x', offsetFactor * this.viewBoxSize)
        .attr('y', (0.5 + offsetFactor) * this.viewBoxSize)
        .attr('text-anchor', 'start')
        .text(this.quadrantLabels[2]); // Lower left label
      svg
        .append('text')
        .attr('x', (0.5 - offsetFactor) * this.viewBoxSize)
        .attr('y', (1 - offsetFactor) * this.viewBoxSize)
        .attr('text-anchor', 'end')
        .text(this.quadrantLabels[3]); // Lower right label

      const xAxis = d3.axisBottom(xScale).ticks(4);
      // Hide the tick labels
      xAxis.tickFormat(() => '');

      const yAxis = d3.axisLeft(yScale).ticks(4);
      // Hide the tick labels
      yAxis.tickFormat(() => '');

      svg
        .append('g')
        .attr('transform', `translate(0, ${this.viewBoxSize / 2})`)
        .call(xAxis);
      svg
        .append('g')
        .attr('transform', `translate(${this.viewBoxSize / 2}, 0)`)
        .call(yAxis);

      const resultPointId = 'resultPoint';
      svg
        .append('circle')
        .attr('id', resultPointId)
        .attr('cx', xScale(this.pointCoordinate[0]))
        .attr('cy', yScale(this.pointCoordinate[1]))
        .attr('r', this.pointRadius)
        .on('mouseover', () => {
          d3.select(`#${resultPointId}`)
            .transition()
            .duration(100)
            .attr('r', 1.25 * this.pointRadius);
        })
        .on('mouseout', () => {
          d3.select(`#${resultPointId}`)
            .transition()
            .duration(100)
            .attr('r', this.pointRadius);
        });
    },
    getScale(
      domainLower: number,
      domainUpper: number,
      rangeLower: number,
      rangeUpper: number
    ) {
      return d3
        .scaleLinear()
        .domain([domainLower, domainUpper])
        .range([rangeLower, rangeUpper]);
    },
  },
});
</script>

<style lang="scss">
@import '../styles/bootstrap.scss';
#resultPlot {
  svg {
    border-radius: 10px;
    box-shadow: 3px 3px 6px #cccccc;

    .domain {
      stroke: #797979;
      stroke-width: 2px;
    }
    .tick {
      line {
        stroke: #797979;
        stroke-width: 2px;
      }
    }

    text {
      font-size: 1rem;
      font-weight: lighter;
    }
  }
  #resultPoint {
    fill: $primary;
  }
}
</style>
