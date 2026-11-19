import React, { useState } from 'react';
import { formatCurrency } from '../api';

export default function RevenueChart({ data = [], currency = 'USD' }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs theme-text-secondary">
        No revenue trend data available
      </div>
    );
  }

  const width = 720;
  const height = 180;
  const paddingLeft = 65;
  const paddingRight = 25;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxRevenue = Math.max(...data.map(d => d.revenue), 30000);
  const barWidth = Math.floor(chartWidth / data.length) - 8;

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible select-none"
      >
        <defs>
          <linearGradient id="revBarGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Horizontal Gridlines */}
        {[0, maxRevenue * 0.5, maxRevenue].map((val, idx) => {
          const y = paddingTop + chartHeight - (val / maxRevenue) * chartHeight;
          return (
            <g key={idx}>
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
                fontSize="9"
                fontFamily="Inter, sans-serif"
                textAnchor="end"
              >
                {formatCurrency(val, currency)}
              </text>
            </g>
          );
        })}

        {/* Revenue Bars */}
        {data.map((d, i) => {
          const x = paddingLeft + i * (chartWidth / data.length) + 4;
          const barH = (d.revenue / maxRevenue) * chartHeight;
          const y = paddingTop + chartHeight - barH;
          const isHovered = hoveredPoint?.date === d.date;

          return (
            <g
              key={d.date}
              onMouseEnter={() => setHoveredPoint(d)}
              onMouseLeave={() => setHoveredPoint(null)}
              className="cursor-pointer"
            >
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx="3"
                fill={isHovered ? '#34D399' : 'url(#revBarGradient)'}
                className="transition-colors duration-150"
              />
              <text
                x={x + barWidth / 2}
                y={height - 8}
                fill={isHovered ? '#10B981' : 'var(--text-secondary)'}
                fontSize="9"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {d.date}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Hover Tooltip */}
      {hoveredPoint && (
        <div className="absolute top-2 right-4 theme-bg-elevated border border-emerald/40 px-3 py-1.5 rounded-lg shadow-xl text-xs flex items-center gap-3 backdrop-blur-md pointer-events-none">
          <span className="font-mono text-emerald font-bold">{hoveredPoint.date}</span>
          <span className="theme-text-primary">
            Daily Yield: <strong>{formatCurrency(hoveredPoint.revenue, currency)}</strong>
          </span>
        </div>
      )}
    </div>
  );
}
