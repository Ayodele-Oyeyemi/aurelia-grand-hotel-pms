import React from 'react';
import { Users, Maximize2, Check, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../api';

export default function SuiteCard({ suite, currency, onReserve }) {
  const isAvailable = suite.status !== 'occupied';

  return (
    <div className="group relative bg-elevated rounded-2xl border border-card-border overflow-hidden hover:border-gold/50 transition-all duration-300 shadow-xl flex flex-col">
      {/* Suite Image with Gradient Overlay */}
      <div className="relative h-64 w-full overflow-hidden">
        <img
          src={suite.image_url}
          alt={suite.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-elevated via-elevated/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-obsidian/85 text-gold border border-gold/40 backdrop-blur-md">
            {suite.category}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-tight bg-obsidian/80 text-text-secondary border border-card-border backdrop-blur-md">
            Floor {suite.floor} • Suite {suite.room_number}
          </span>
        </div>

        {/* Availability Status */}
        <div className="absolute top-3.5 right-3.5">
          {isAvailable ? (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald/20 text-emerald border border-emerald/40 backdrop-blur-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
              Available
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-rose/20 text-rose border border-rose/40 backdrop-blur-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose" />
              Occupied
            </span>
          )}
        </div>

        {/* Bottom Price on Image */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-text-secondary font-medium block">
              Nightly From
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-serif-display font-bold text-gold">
                {formatCurrency(suite.base_rate_usd, currency)}
              </span>
              <span className="text-xs text-text-secondary">/ night</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-text-secondary bg-obsidian/80 px-2.5 py-1 rounded-lg border border-card-border/60 backdrop-blur-sm">
            <span className="flex items-center gap-1" title="Max Guests">
              <Users className="w-3.5 h-3.5 text-gold/80" /> {suite.max_guests} Guests
            </span>
            <span className="flex items-center gap-1" title="Suite Area">
              <Maximize2 className="w-3.5 h-3.5 text-gold/80" /> {suite.sqft.toLocaleString()} sq ft
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-lg font-serif-display font-semibold text-text-primary group-hover:text-gold transition-colors duration-200">
            {suite.name}
          </h3>
          <p className="mt-2 text-xs text-text-secondary leading-relaxed line-clamp-2">
            {suite.description}
          </p>
        </div>

        {/* Amenity Pills */}
        <div>
          <div className="flex flex-wrap gap-1.5">
            {suite.amenities.slice(0, 4).map((amenity, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-[11px] bg-obsidian/60 text-text-secondary border border-card-border/80 flex items-center gap-1"
              >
                <Check className="w-2.5 h-2.5 text-gold" />
                {amenity}
              </span>
            ))}
            {suite.amenities.length > 4 && (
              <span className="px-2 py-0.5 rounded text-[11px] bg-obsidian/60 text-gold/80 border border-card-border/80">
                +{suite.amenities.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-card-border/60">
          <button
            type="button"
            onClick={() => onReserve(suite)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gold hover:bg-gold-hover text-obsidian font-semibold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-md hover:shadow-gold/20"
          >
            <span>Reserve Suite</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
