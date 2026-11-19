import React, { useState } from 'react';
import { X, Code2, Database, Terminal, Check, Copy } from 'lucide-react';

export default function DevSpecsModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyEnvSnippet = () => {
    navigator.clipboard.writeText(`PORT=5000\nSUPABASE_URL=your-supabase-url\nSUPABASE_KEY=your-supabase-anon-key\nGEMINI_API_KEY=your-gemini-key`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] theme-bg-elevated rounded-2xl border theme-border shadow-2xl flex flex-col overflow-hidden theme-text-primary"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b theme-border [background-color:var(--bg-secondary)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif-display font-semibold theme-text-primary">
                Aurelia Grand &amp; Suites — Dev Architecture &amp; PMS Specs
              </h2>
              <p className="text-xs theme-text-secondary">
                Modular Open-Source Hospitality Template v2.4
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg theme-text-secondary hover:theme-text-primary hover:theme-bg-primary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Overview */}
          <div className="[background-color:var(--bg-secondary)] p-4 rounded-xl border theme-border">
            <h3 className="text-gold font-semibold text-xs tracking-wider uppercase mb-2 flex items-center gap-2">
              <Database className="w-4 h-4" /> Zero-Crash Hybrid Architecture
            </h3>
            <p className="text-xs theme-text-secondary leading-relaxed">
              Designed as a reference standard for modern hotel booking engines and property management systems (PMS).
              If Supabase credentials are not connected, the server automatically defaults to an in-memory, stateful mock engine
              pre-seeded with luxury suites, guest VIP tiers, folios, and housekeeping matrices. Every reservation, room check-in,
              and folio charge persists seamlessly throughout your session.
            </p>
          </div>

          {/* Tech Stack Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="[background-color:var(--bg-secondary)] p-4 rounded-xl border theme-border">
              <h4 className="font-semibold theme-text-primary text-xs uppercase tracking-wider text-gold mb-2.5">
                Frontend Architecture (/client)
              </h4>
              <ul className="space-y-1.5 text-xs theme-text-secondary">
                <li>• <strong className="theme-text-primary">React 18 SPA:</strong> Single-page role-based persona switching</li>
                <li>• <strong className="theme-text-primary">Tailwind CSS v4:</strong> Theme CSS variables (`--color-gold`, etc.)</li>
                <li>• <strong className="theme-text-primary">Vite Build Engine:</strong> Hot-module reload with `/api` proxy to `:5000`</li>
                <li>• <strong className="theme-text-primary">Pure SVG Charts:</strong> Zero heavy chart library dependencies</li>
                <li>• <strong className="theme-text-primary">Dual Currency:</strong> Real-time USD ($) and Nigerian Naira (₦ 1,580)</li>
              </ul>
            </div>

            <div className="[background-color:var(--bg-secondary)] p-4 rounded-xl border theme-border">
              <h4 className="font-semibold theme-text-primary text-xs uppercase tracking-wider text-gold mb-2.5">
                Backend Architecture (/server)
              </h4>
              <ul className="space-y-1.5 text-xs theme-text-secondary">
                <li>• <strong className="theme-text-primary">Node.js / Express:</strong> RESTful hotel API with CORS &amp; JSON body parsing</li>
                <li>• <strong className="theme-text-primary">Supabase Client:</strong> PostgreSQL with RLS, foreign keys &amp; indexes</li>
                <li>• <strong className="theme-text-primary">Google Gemini 2.5 Flash:</strong> Private hotel concierge agent</li>
                <li>• <strong className="theme-text-primary">Folio Ledger:</strong> Audit-ready guest room charges, minibar &amp; settlements</li>
                <li>• <strong className="theme-text-primary">Housekeeping Matrix:</strong> 4-floor 16-room real-time state machine</li>
              </ul>
            </div>
          </div>

          {/* API Endpoints */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-gold mb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Core PMS REST Endpoints
            </h4>
            <div className="theme-bg-primary rounded-xl border theme-border overflow-hidden text-xs font-mono">
              <div className="p-2.5 border-b border-[var(--border-color)]/60 flex items-center justify-between [background-color:var(--bg-secondary)] theme-text-secondary font-sans font-medium">
                <span>Method &amp; Route</span>
                <span>Function</span>
              </div>
              <div className="p-3 space-y-2 text-[11px] leading-relaxed">
                <div className="flex justify-between items-center"><span className="text-emerald font-bold">GET</span> <span className="theme-text-primary">/api/suites</span> <span className="theme-text-secondary font-sans">Fetch luxury inventory + category filters</span></div>
                <div className="flex justify-between items-center"><span className="text-emerald font-bold">GET</span> <span className="theme-text-primary">/api/reservations</span> <span className="theme-text-secondary font-sans">Tape chart bookings, in-house &amp; arrivals</span></div>
                <div className="flex justify-between items-center"><span className="text-amber font-bold">POST</span> <span className="theme-text-primary">/api/reservations</span> <span className="theme-text-secondary font-sans">Create booking with add-ons &amp; promo codes</span></div>
                <div className="flex justify-between items-center"><span className="text-blue-400 font-bold">PATCH</span> <span className="theme-text-primary">/api/reservations/:id</span> <span className="theme-text-secondary font-sans">Check-in, room assignment &amp; check-out</span></div>
                <div className="flex justify-between items-center"><span className="text-emerald font-bold">GET</span> <span className="theme-text-primary">/api/folio/:id</span> <span className="theme-text-secondary font-sans">Live guest billing statement &amp; balance</span></div>
                <div className="flex justify-between items-center"><span className="text-amber font-bold">POST</span> <span className="theme-text-primary">/api/folio/:id</span> <span className="theme-text-secondary font-sans">Post room service, spa or minibar charges</span></div>
                <div className="flex justify-between items-center"><span className="text-blue-400 font-bold">PATCH</span> <span className="theme-text-primary">/api/folio/:id/settle</span> <span className="theme-text-secondary font-sans">Settle all outstanding guest charges</span></div>
                <div className="flex justify-between items-center"><span className="text-emerald font-bold">GET</span> <span className="theme-text-primary">/api/housekeeping</span> <span className="theme-text-secondary font-sans">16-room floor matrix status</span></div>
                <div className="flex justify-between items-center"><span className="text-amber font-bold">POST</span> <span className="theme-text-primary">/api/concierge</span> <span className="theme-text-secondary font-sans">AI Concierge guest query (Gemini powered)</span></div>
                <div className="flex justify-between items-center"><span className="text-emerald font-bold">GET</span> <span className="theme-text-primary">/api/analytics</span> <span className="theme-text-secondary font-sans">Occupancy, ADR, RevPAR &amp; dynamic pricing</span></div>
              </div>
            </div>
          </div>

          {/* Quick Environment Snippet */}
          <div className="[background-color:var(--bg-secondary)] p-4 rounded-xl border theme-border flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold theme-text-primary">Environment Variables</p>
              <p className="text-[11px] theme-text-secondary">Copy template `.env` for your local or cloud setup</p>
            </div>
            <button
              onClick={copyEnvSnippet}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg theme-bg-elevated hover:bg-gold/20 theme-text-primary hover:text-gold text-xs transition-colors cursor-pointer border theme-border"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy .env'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t theme-border [background-color:var(--bg-secondary)] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gold hover:bg-gold-hover text-white font-semibold text-xs tracking-wide transition-colors cursor-pointer"
          >
            Close Specs
          </button>
        </div>
      </div>
    </div>
  );
}
