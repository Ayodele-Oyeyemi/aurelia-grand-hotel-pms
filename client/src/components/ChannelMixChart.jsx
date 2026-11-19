import React, { useState } from 'react';

const DEFAULT_CHANNELS = [
  { channel: 'Direct / Brand Website', percentage: 48, count: 54, color: '#D4AF37' },
  { channel: 'Booking.com', percentage: 24, count: 27, color: '#3B82F6' },
  { channel: 'Corporate Accounts', percentage: 18, count: 20, color: '#10B981' },
  { channel: 'Expedia / GDS', percentage: 10, count: 11, color: '#F59E0B' }
];

export default function ChannelMixChart({ channels = DEFAULT_CHANNELS }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const radius = 64;
  const circumference = 2 * Math.PI * radius; // ~402.12

  // Pure functional calculation of stroke offsets without reassigning external variables
  const slices = channels.map((ch, idx) => {
    const precedingSum = channels.slice(0, idx).reduce((acc, curr) => acc + curr.percentage, 0);
    const strokeDash = (ch.percentage / 100) * circumference;
    const strokeOffset = -(precedingSum / 100) * circumference;
    return {
      ...ch,
      strokeDash,
      strokeOffset
    };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
      {/* Donut SVG Ring */}
      <div className="relative w-48 h-48 shrink-0">
        <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
          {/* Base Background Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="var(--border-color)"
            strokeWidth="20"
          />

          {/* Slices */}
          {slices.map((ch, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <circle
                key={ch.channel}
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke={ch.color}
                strokeWidth={isHovered ? '24' : '20'}
                strokeDasharray={`${ch.strokeDash} ${circumference}`}
                strokeDashoffset={ch.strokeOffset}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="transition-all duration-300 cursor-pointer"
              />
            );
          })}
        </svg>

        {/* Center Cutout Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-xl font-serif-display font-bold theme-text-primary">
            {hoveredIdx !== null ? `${channels[hoveredIdx].percentage}%` : '100%'}
          </span>
          <span className="text-[10px] uppercase tracking-wider theme-text-secondary">
            {hoveredIdx !== null ? channels[hoveredIdx].channel.split(' ')[0] : 'Direct Yield'}
          </span>
        </div>
      </div>

      {/* Legend & Breakdown List */}
      <div className="flex-1 space-y-2.5 w-full">
        {channels.map((ch, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={ch.channel}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`p-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between text-xs ${
                isHovered ? 'theme-bg-primary border theme-border shadow' : 'hover:[background-color:var(--bg-secondary)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: ch.color }}
                />
                <span className="font-medium theme-text-primary">
                  {ch.channel}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="theme-text-secondary font-mono text-[11px]">
                  {ch.count} bookings
                </span>
                <span className="font-bold font-mono text-gold min-w-[34px] text-right">
                  {ch.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
