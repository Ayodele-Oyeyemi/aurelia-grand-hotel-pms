import React from 'react';

export default function CurrencyToggle({ currency, setCurrency }) {
  return (
    <div className="flex items-center bg-elevated border border-card-border rounded-lg p-1 text-xs font-semibold shadow-inner">
      <button
        type="button"
        onClick={() => setCurrency('USD')}
        className={`px-2.5 py-1 rounded transition-all duration-200 cursor-pointer ${
          currency === 'USD'
            ? 'bg-gold text-obsidian font-bold shadow'
            : 'text-text-secondary hover:text-text-primary'
        }`}
        title="View rates in US Dollars ($)"
      >
        USD ($)
      </button>
      <button
        type="button"
        onClick={() => setCurrency('NGN')}
        className={`px-2.5 py-1 rounded transition-all duration-200 cursor-pointer ${
          currency === 'NGN'
            ? 'bg-gold text-obsidian font-bold shadow'
            : 'text-text-secondary hover:text-text-primary'
        }`}
        title="View rates in Nigerian Naira (₦)"
      >
        NGN (₦)
      </button>
    </div>
  );
}
