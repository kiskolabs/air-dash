import React from "react";
import { Group } from "@vx/group";
import { GlyphDot } from "@vx/glyph";
import { LinePath } from "@vx/shape";
import { ScaleSVG } from "@vx/responsive";
import { Text } from "@vx/text";
import { scaleTime, scaleLinear } from "@vx/scale";
import { curveMonotoneX } from "@vx/curve";

// colors
const defaultPrimary = "#2e2e2e";
const defaultSecondary = "#f2f2f2";
const defaultContrast = "#ffffff";

const colors = {
  green: "#3d9970",
  blue: "#0074d9",
  yellow: "#ffdc00",
  orange: "#ff851b",
  red: "#ff4136",
};

const secondaryColors = {
  green: "#b2ffdc",
  blue: "#b2dbff",
  yellow: "#fff3a5",
  orange: "#ffc899",
  red: "#ff9e99",
};

const Label = ({ text, ...rest }) => {
  return (
    <Text x={0} {...rest}>
      {text}
    </Text>
  );
};

export default ({
  data,
  width,
  height,
  margin,
  colorFn,
  domain,
  labelText,
  latestValue,
  valueSuffix,
  valuePrecision,
}) => {
  // accessors
  const date = d => d.date;
  const value = d => d.value;

  const dataMin = Math.min(...data.map(value));
  const dataMax = Math.max(...data.map(value));

  if (typeof domain[0] === "function") {
    domain[0] = domain[0](dataMin);
  }

  if (typeof domain[1] === "function") {
    domain[1] = domain[1](dataMax);
  }

  // scales
  const xScale = scaleTime({
    domain: [Math.min(...data.map(date)), Math.max(...data.map(date))],
  });
  const yScale = scaleLinear({
    domain: domain ? domain : [0, dataMax],
  });

  // positions
  const x = d => xScale(date(d));
  const y = d => yScale(value(d));

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // update scale range to match bounds
  xScale.range([margin.left + margin.right, xMax]);
  yScale.range([yMax, margin.top]);

  const valueText = `${latestValue.toFixed(valuePrecision || 0)}${valueSuffix}`;

  let secondary = defaultSecondary;
  if (latestValue) {
    secondary = secondaryColors[colorFn(latestValue)];
  }

  return (
    <ScaleSVG width={width} height={height}>
      <rect x={0} y={0} width={width} height={height} fill={secondary} rx={14} />
      <Group top={margin.top}>
        <LinePath
          data={data}
          x={x}
          y={y}
          stroke={defaultPrimary}
          strokeWidth={3}
          curve={curveMonotoneX}
        />
        {data.map((d, i) => {
          const cx = x(d);
          const cy = y(d);
          const color = colors[colorFn(d.value)];

          return (
            <g key={`line-point-${i}`}>
              <GlyphDot
                cx={cx}
                cy={cy}
                r={6}
                fill={defaultContrast}
                stroke={secondary}
                strokeWidth={5}
              />
              <GlyphDot cx={cx} cy={cy} r={6} fill={secondary} stroke={color} strokeWidth={3} />
              <GlyphDot cx={cx} cy={cy} r={4} fill={defaultContrast} />
            </g>
          );
        })}
      </Group>
      {labelText && (
        <Label
          text={labelText}
          width={width}
          y={margin.top}
          x={margin.left}
          verticalAnchor="start"
          style={{ fontSize: "22px" }}
        />
      )}
      {latestValue && (
        <Label
          text={valueText}
          width={width}
          y={margin.top}
          x={width - margin.right}
          verticalAnchor="start"
          textAnchor="end"
          style={{ fontWeight: "700", fontSize: "22px", fill: colors[colorFn(latestValue)] }}
        />
      )}
    </ScaleSVG>
  );
};
