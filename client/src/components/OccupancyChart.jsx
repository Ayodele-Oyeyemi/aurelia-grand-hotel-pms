import React, { useState } from 'react';

export default function OccupancyChart({ data = [] }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs theme-text-secondary">
        No occupancy history available
      </div>
    );
  }

  const width = 720;
  const height = 240;
  const paddingLeft = 45;
  const paddingRight = 25;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const barWidth = Math.floor(chartWidth / data.length) - 8;

  // Points for trend line
  const points = data.map((d, i) => {
    const x = paddingLeft + i * (chartWidth / (data.length - 1 || 1));
    const y = paddingTop + chartHeight - (d.occupancy / 100) * chartHeight;
    return { x, y, ...d };
  });

  const linePath = points.reduce((acc, p, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`;
  }, '');

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible select-none"
      >
        <defs>
          {/* Gold Bar Gradient */}
          <linearGradient id="occBarGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.15" />
          </linearGradient>

          {/* Line Glow Filter */}
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Horizontal Gridlines & Y-Axis Labels */}
        {[0, 25, 50, 75, 100].map((val) => {
          const y = paddingTop + chartHeight - (val / 100) * chartHeight;
          return (
            <g key={val}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="var(--border-color)"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
              <text
                x={paddingLeft - 8}
                y={y + 3.5}
                fill="var(--text-secondary)"
                fontSize="10"
                fontFamily="Inter, sans-serif"
                textAnchor="end"
              >
                {val}%
              </text>
            </g>
          );
        })}

        {/* 14 Daily Occupancy Bars */}
        {data.map((d, i) => {
          const x = paddingLeft + i * (chartWidth / data.length) + 4;
          const barH = (d.occupancy / 100) * chartHeight;
          const y = paddingTop + chartHeight - barH;
          const isHovered = hoveredPoint?.date === d.date;

          return (
            <g
              key={d.date}
              onMouseEnter={() => setHoveredPoint(d)}
              onMouseLeave={() => setHoveredPoint(null)}
              className="cursor-pointer transition-all duration-150"
            >
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx="4"
                fill={isHovered ? '#E5C453' : 'url(#occBarGradient)'}
                className="transition-all duration-200"
              />
              {/* X-axis date label */}
              <text
                x={x + barWidth / 2}
                y={height - 10}
                fill={isHovered ? '#D4AF37' : 'var(--text-secondary)'}
                fontSize="9.5"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {d.date}
              </text>
            </g>
          );
        })}

        {/* Smooth Trend Overlay Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2.5"
          filter="url(#goldGlow)"
        />

        {/* Line Dots */}
        {points.map((p, idx) => (
          <circle
            key={idx}
            cx={p.x}
            cy={p.y}
            r={hoveredPoint?.date === p.date ? 5 : 3}
            fill="var(--bg-primary)"
            stroke="#D4AF37"
            strokeWidth="2"
            className="transition-all duration-200"
          />
        ))}
      </svg>

      {/* Floating Hover Tooltip */}
      {hoveredPoint && (
        <div className="absolute top-2 right-4 theme-bg-elevated border border-gold/40 px-3 py-1.5 rounded-lg shadow-xl text-xs flex items-center gap-3 backdrop-blur-md pointer-events-none">
          <span className="font-mono text-gold font-bold">{hoveredPoint.date}</span>
          <span className="theme-text-primary">
            Occupancy: <strong>{hoveredPoint.occupancy}%</strong>
          </span>
        </div>
      )}
    </div>
  );
}
