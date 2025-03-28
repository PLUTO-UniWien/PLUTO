import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import "./styles.css";

type QuadrantPlotProps = {
  xLowerBound: number;
  xUpperBound: number;
  yLowerBound: number;
  yUpperBound: number;
  pointCoordinate: [number, number];
  quadrantLabels: [string, string, string, string];
  viewBoxSize?: number;
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  pointRadius?: number;
  quadrantColors?: [string, string, string, string];
  rootId?: string;
  scoreLabels?: { x: string; y: string };
};

const getScale = (
  domainLower: number,
  domainUpper: number,
  rangeLower: number,
  rangeUpper: number,
) => {
  return d3.scaleLinear().domain([domainLower, domainUpper]).range([rangeLower, rangeUpper]);
};

export default function QuadrantPlot({
  xLowerBound,
  xUpperBound,
  yLowerBound,
  yUpperBound,
  pointCoordinate,
  quadrantLabels,
  viewBoxSize = 500,
  margins = { top: 16, right: 16, bottom: 16, left: 16 },
  pointRadius = 7.5,
  quadrantColors = ["#d9edd6", "#faf1d3", "#faf1d3", "#f2cfcc"],
  rootId = "quadrant-plot",
  scoreLabels = { x: "X Score", y: "Y Score" },
}: QuadrantPlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing SVG
    d3.select(containerRef.current).selectAll("*").remove();

    const svg = d3
      .select(containerRef.current)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${viewBoxSize} ${viewBoxSize}`);

    const xScale = getScale(xLowerBound, xUpperBound, margins.left, viewBoxSize - margins.right);
    const yScale = getScale(yLowerBound, yUpperBound, viewBoxSize - margins.bottom, margins.top);

    const quadrantSize = "50%";
    // Quadrant rects
    svg
      .append("rect")
      .attr("width", quadrantSize)
      .attr("height", quadrantSize)
      .attr("fill", quadrantColors[0]); // Upper left rect
    svg
      .append("rect")
      .attr("width", quadrantSize)
      .attr("height", quadrantSize)
      .attr("x", quadrantSize)
      .attr("fill", quadrantColors[1]); // Upper right
    svg
      .append("rect")
      .attr("width", quadrantSize)
      .attr("height", quadrantSize)
      .attr("y", quadrantSize)
      .attr("fill", quadrantColors[2]); // Lower left
    svg
      .append("rect")
      .attr("width", quadrantSize)
      .attr("height", quadrantSize)
      .attr("x", quadrantSize)
      .attr("y", quadrantSize)
      .attr("fill", quadrantColors[3]); // Lower right

    // Quadrant labels
    const offsetFactor = 0.05;
    svg
      .append("text")
      .attr("x", (0.5 - offsetFactor) * viewBoxSize)
      .attr("y", offsetFactor * viewBoxSize)
      .attr("text-anchor", "end")
      .text(quadrantLabels[0]); // Upper left label
    svg
      .append("text")
      .attr("x", (1 - offsetFactor) * viewBoxSize)
      .attr("y", (0.5 + offsetFactor) * viewBoxSize)
      .attr("text-anchor", "end")
      .text(quadrantLabels[1]); // Upper right label
    svg
      .append("text")
      .attr("x", offsetFactor * viewBoxSize)
      .attr("y", (0.5 + offsetFactor) * viewBoxSize)
      .attr("text-anchor", "start")
      .text(quadrantLabels[2]); // Lower left label
    svg
      .append("text")
      .attr("x", (0.5 - offsetFactor) * viewBoxSize)
      .attr("y", (1 - offsetFactor) * viewBoxSize)
      .attr("text-anchor", "end")
      .text(quadrantLabels[3]); // Lower right label

    const xAxis = d3.axisBottom(xScale).ticks(4);
    // Hide the tick labels
    xAxis.tickFormat(() => "");

    const yAxis = d3.axisLeft(yScale).ticks(4);
    // Hide the tick labels
    yAxis.tickFormat(() => "");

    svg
      .append("g")
      .attr("transform", `translate(0, ${viewBoxSize / 2})`)
      .call(xAxis);
    svg
      .append("g")
      .attr("transform", `translate(${viewBoxSize / 2}, 0)`)
      .call(yAxis);

    const resultPointId = "resultPoint";
    svg
      .append("circle")
      .attr("id", resultPointId)
      .attr("cx", xScale(pointCoordinate[0]))
      .attr("cy", yScale(pointCoordinate[1]))
      .attr("r", pointRadius)
      .on("mouseover", () => {
        d3.select(`#${resultPointId}`)
          .transition()
          .duration(100)
          .attr("r", 1.25 * pointRadius);
      })
      .on("mouseout", () => {
        d3.select(`#${resultPointId}`).transition().duration(100).attr("r", pointRadius);
      });
  }, [
    xLowerBound,
    xUpperBound,
    yLowerBound,
    yUpperBound,
    pointCoordinate,
    quadrantLabels,
    viewBoxSize,
    margins,
    pointRadius,
    quadrantColors,
  ]);

  return (
    <div id={rootId} className="quadrant-plot relative">
      <div ref={containerRef} />
      <QuadrantPlotHoverCard
        pointCoordinate={pointCoordinate}
        xLowerBound={xLowerBound}
        xUpperBound={xUpperBound}
        yLowerBound={yLowerBound}
        yUpperBound={yUpperBound}
        quadrantLabels={quadrantLabels}
        pointRadius={pointRadius}
        scoreLabels={scoreLabels}
      />
    </div>
  );
}

type QuadrantPlotHoverCardProps = {
  pointCoordinate: [number, number];
  xLowerBound: number;
  xUpperBound: number;
  yLowerBound: number;
  yUpperBound: number;
  quadrantLabels: [string, string, string, string];
  pointRadius: number;
  scoreLabels: { x: string; y: string };
};

const QuadrantPlotHoverCard = ({
  pointCoordinate,
  xLowerBound,
  xUpperBound,
  yLowerBound,
  yUpperBound,
  quadrantLabels,
  pointRadius,
  scoreLabels,
}: QuadrantPlotHoverCardProps) => {
  // Determine which quadrant the point is in or if it's neutral (at origin)
  const getResultType = () => {
    const [x, y] = pointCoordinate;
    const [yUp, xUp, xDown, yDown] = quadrantLabels;
    // Check if point is at origin (0,0)
    if (x === 0 && y === 0) {
      return "Neutral";
    }

    const xMidpoint = (xUpperBound + xLowerBound) / 2;
    const yMidpoint = (yUpperBound + yLowerBound) / 2;

    // Quadrant 1 if x > 0 and y > 0
    if (x > xMidpoint && y > yMidpoint) {
      return `C: ${[xUp, yUp].join(", ")}`;
    }
    // Quadrant 2 if x < 0 and y > 0
    if (x < xMidpoint && y > yMidpoint) {
      return `A: ${[xDown, yUp].join(", ")}`;
    }
    // Quadrant 3 if x < 0 and y < 0
    if (x < xMidpoint && y < yMidpoint) {
      return `B: ${[xDown, yDown].join(", ")}`;
    }
    // Quadrant 4 if x > 0 and y < 0
    return `D: ${[xUp, yDown].join(", ")}`;
  };

  const resultType = getResultType();

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          className="absolute pointer-events-auto"
          style={{
            left: `calc(50% + ${((pointCoordinate[0] - (xUpperBound + xLowerBound) / 2) / (xUpperBound - xLowerBound)) * 100}%)`,
            top: `calc(50% - ${((pointCoordinate[1] - (yUpperBound + yLowerBound) / 2) / (yUpperBound - yLowerBound)) * 100}%)`,
            width: `${pointRadius * 2}px`,
            height: `${pointRadius * 2}px`,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            cursor: "pointer",
          }}
        />
      </HoverCardTrigger>
      <HoverCardContent className="w-auto" side="top">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Result</h4>
          <div className="flex justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">{scoreLabels.x}</p>
              <p className="font-medium">{pointCoordinate[0].toFixed(2)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">{scoreLabels.y}</p>
              <p className="font-medium">{pointCoordinate[1].toFixed(2)}</p>
            </div>
          </div>
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">Type</p>
            <p className="font-medium">{resultType}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
