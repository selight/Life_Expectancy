import {useEffect, useRef, useState} from "react";
import {select} from "d3-selection";
import {scaleBand, scaleLinear} from "d3-scale";
import {axisBottom, axisLeft} from "d3-axis";

export const DEVELOPING_COLOR = "#f46d43";
export const DEVELOPED_COLOR = "#66c2a5";
function AxisBottom({ scale, transform }) {
    const ref = useRef (null);

    useEffect(() => {
        if (ref.current) {
            select(ref.current).call(axisBottom(scale).tickValues([]));
        }
    }, [scale]);

    return <g ref={ref} transform={transform} />;
}
function AxisLeft({ scale }) {
    const ref = useRef(null);

    useEffect(() => {
        if (ref.current) {
            select(ref.current).call(axisLeft(scale));
        }
    }, [scale]);

    return <g ref={ref} />;
}
function Bars({ data, height, scaleX, scaleY }) {
    return (
        <>
            {data.map(({ value, label,status }) => (
                <rect
                    key={`bar-${label}`}
                    x={scaleX(label)}
                    y={scaleY(value)}
                    width={scaleX.bandwidth()}
                    height={height - scaleY(value)}
                    fill= {status === "Developing" ? DEVELOPING_COLOR : DEVELOPED_COLOR}
                />
            ))}
        </>
    );
}
export function BarChart({ data }) {
    const [tooltip, setTooltip] = useState(null);
    const margin = { top: 10, right: 0, bottom: 20, left: 30 };
    const width = 1000 - margin.left - margin.right;
    const height = 1000 - margin.top - margin.bottom;

    const scaleX = scaleBand()
        .domain(data.map(({ label }) => label))
        .range([0, width])
        .padding(0.5);
    const scaleY = scaleLinear()
        .domain([Math.min(...data.map(({ value }) => value)), Math.max(...data.map(({ value }) => value))])
        .range([height, 0]);

    return (
        <svg
            width={width + margin.left + margin.right}
            height={height + margin.top + margin.bottom}
        >
            <g transform={`translate(${margin.left}, ${margin.top})`}>
                <AxisBottom scale={scaleX} transform={`translate(0, ${height})`}  />
                <AxisLeft scale={scaleY} />
                {/* Axis labels */}
                <text className="axis-label" transform={`translate(${margin.left + width / 2}, 
                        ${height - margin.bottom + 35})`}>Country</text>
                <Bars data={data} height={height} scaleX={scaleX}
                      scaleY={scaleY}
                      onMouseEnter={(event) => {
                          setTooltip({
                              x: event.clientX,
                              y: event.clientY,
                          });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                />
            </g>
            {tooltip !== null ? (
                <div className="tooltip" style={{ top: tooltip.y, left: tooltip.x }}>
                    <span className="tooltip__title">hi</span>
                </div>
            ) : null}
        </svg>
            );
}