import React from "react";

// Simple Pie Chart using SVG (no external library)
function PieChart({ data, colors, size = 180 }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;
  const radius = size / 2;
  const center = size / 2;
  const strokeWidth = 32;

  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent) * radius + center;
    const y = Math.sin(2 * Math.PI * percent) * radius + center;
    return [x, y];
  };

  const slices = data.map((slice, i) => {
    const startPercent = cumulative / total;
    cumulative += slice.value;
    const endPercent = cumulative / total;
    const [startX, startY] = getCoordinatesForPercent(startPercent);
    const [endX, endY] = getCoordinatesForPercent(endPercent);
    const largeArcFlag = endPercent - startPercent > 0.5 ? 1 : 0;
    const pathData = [
      `M ${center} ${center}`,
      `L ${startX} ${startY}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      "Z"
    ].join(" ");
    return (
      <path
        key={slice.label}
        d={pathData}
        fill={colors[i % colors.length]}
        stroke="#fff"
        strokeWidth="2"
      />
    );
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="piechart-svg">
      {slices}
    </svg>
  );
}

export default PieChart;
