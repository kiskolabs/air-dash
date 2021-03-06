import React from "react";
import { Group } from "@vx/group";
import { GlyphDot } from "@vx/glyph";
import { LinePath } from "@vx/shape";
import { ScaleSVG } from "@vx/responsive";
import { Text } from "@vx/text";
import { scaleTime, scaleLinear } from "@vx/scale";
import { curveMonotoneX } from "@vx/curve";
import tinycolor from "tinycolor2";

// colors
const defaultSecondary = "rgba(34, 38, 70, 0.5)";
// const defaultContrast = "rgb(79,82,110)";
const defaultStroke = "rgb(17,3,35)";

const colors = {
  green: "#80FF86",
  blue: "#80FF86",
  yellow: "#FFCA66",
  orange: "#FFCA66",
  red: "#FF7A8A",
};

const secondaryColors = {
  green: "rgba(128,255,134,0.1)",
  blue: "rgba(128,255,134,0.15)",
  yellow: "rgba(255,202,102,0.1)",
  orange: "rgba(255,202,102,0.15)",
  red: "rgba(255,122,138,0.15)",
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

  const valueText = latestValue ? `${latestValue.toFixed(valuePrecision || 0)}${valueSuffix}` : "";

  let secondary = defaultSecondary;
  if (latestValue) {
    secondary = secondaryColors[colorFn(latestValue)];
  }

  return (
    <ScaleSVG width={width} height={height}>
      <rect x={0} y={0} width={width} height={height} fill={secondary} rx={7.5} />
      <Group top={margin.top}>
        <LinePath
          data={data}
          x={x}
          y={y}
          stroke={defaultStroke}
          strokeWidth={3}
          curve={curveMonotoneX}
        />
        {data.map((d, i) => {
          const cx = x(d);
          const cy = y(d);
          const color = colors[colorFn(d.value)];
          const secondary = secondaryColors[colorFn(d.value)];
          const contrast = tinycolor.mix(
            tinycolor.mix("#343662", "#0f0f27", 50),
            tinycolor(secondary).setAlpha(1),
            tinycolor(secondary).getAlpha() * 100
          );

          return (
            <g key={`line-point-${i}`}>
              <GlyphDot cx={cx} cy={cy} r={6} fill={contrast} strokeWidth={5} />
              <GlyphDot cx={cx} cy={cy} r={6} fill={secondary} stroke={color} strokeWidth={2} />
              <GlyphDot cx={cx} cy={cy} r={4} fill={contrast} />
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
          style={{ fontSize: "22px", fill: "#AEB4CB" }}
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
          style={{ fontWeight: "600", fontSize: "22px", fill: colors[colorFn(latestValue)] }}
        />
      )}
    </ScaleSVG>
  );
};
