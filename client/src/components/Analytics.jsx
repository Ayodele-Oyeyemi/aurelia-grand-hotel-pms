import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, DollarSign, Percent, BarChart2, Sparkles, ArrowUpRight, Calendar, RefreshCw, Zap } from 'lucide-react';
import OccupancyChart from './OccupancyChart';
import RevenueChart from './RevenueChart';
import ChannelMixChart from './ChannelMixChart';
import { api, formatCurrency } from '../api';

export default function Analytics({ currency }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getAnalytics();
      if (res && res.data) {
        setAnalytics(res.data);
      }
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const kpis = analytics?.kpis || {
    occupancy_rate: 87.5,
    occupancy_trend: '+4.2% vs last week',
    adr_usd: 685.00,
    adr_trend: '+8.1% vs last month',
    revpar_usd: 599.38,
    revpar_trend: '+12.4% YoY',
    monthly_revenue_usd: 287400.00,
    monthly_revenue_trend: '+15.3% ahead of target'
  };

  const trendData = analytics?.trend_14d || [];
  const channelData = analytics?.channel_mix || [];
  const aiRecommendation = analytics?.ai_pricing_recommendation || {
    title: 'Weekend Surge & Penthouse Yield Adjustment',
    headline: 'High demand detected for upcoming weekend (Nov 14-16)',
    suggestion: 'Recommend increasing Presidential Penthouse & Royal Villa base rates by 18% (+$225/night) due to the Lagos Tech Summit and private charter bookings. Studio availability is tight at 95% forecast occupancy. Apply a 2-night minimum length-of-stay (MLOS) restriction across Deluxe King suites to maximize yield.'
  };

  return (
    <div className={`min-h-screen theme-bg-primary theme-text-primary p-4 sm:p-6 lg:p-8 space-y-8 transition-opacity duration-300 ${loading ? 'opacity-90' : 'opacity-100'}`}>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b theme-border pb-6">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-gold">
            Executive Performance &amp; Revenue Management
          </span>
          <h1 className="text-2xl font-serif-display font-semibold theme-text-primary">
            General Manager Dashboard — Elena Rostova
          </h1>
          <p className="text-xs theme-text-secondary mt-0.5">
            14-Day Trailing Occupancy, ADR, RevPAR Yield &amp; Gemini Dynamic Pricing Insights
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl theme-bg-elevated border theme-border text-xs theme-text-secondary">
            <Calendar className="w-3.5 h-3.5 text-gold" />
            <span>Reporting: Nov 8, 2026</span>
          </div>

          <button
            onClick={loadAnalytics}
            title="Refresh Performance KPIs"
            className="p-2 rounded-xl theme-bg-elevated border theme-border theme-text-secondary hover:text-gold transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-gold' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Occupancy Rate */}
        <div className="p-5 rounded-2xl theme-bg-elevated border theme-border shadow-lg flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider theme-text-secondary">
              Occupancy Rate
            </span>
            <div className="p-2 rounded-xl bg-gold/15 text-gold">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-serif-display font-bold theme-text-primary">
              {kpis.occupancy_rate}%
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald mt-1 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{kpis.occupancy_trend}</span>
            </div>
          </div>
        </div>

        {/* ADR */}
        <div className="p-5 rounded-2xl theme-bg-elevated border theme-border shadow-lg flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider theme-text-secondary">
              Average Daily Rate (ADR)
            </span>
            <div className="p-2 rounded-xl bg-gold/15 text-gold">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-serif-display font-bold text-gold">
              {formatCurrency(kpis.adr_usd, currency)}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald mt-1 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{kpis.adr_trend}</span>
            </div>
          </div>
        </div>

        {/* RevPAR */}
        <div className="p-5 rounded-2xl theme-bg-elevated border theme-border shadow-lg flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider theme-text-secondary">
              RevPAR (Yield / Room)
            </span>
            <div className="p-2 rounded-xl bg-gold/15 text-gold">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-serif-display font-bold theme-text-primary">
              {formatCurrency(kpis.revpar_usd, currency)}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald mt-1 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{kpis.revpar_trend}</span>
            </div>
          </div>
        </div>

        {/* Total Monthly Revenue */}
        <div className="p-5 rounded-2xl theme-bg-elevated border theme-border shadow-lg flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider theme-text-secondary">
              Monthly Gross Revenue
            </span>
            <div className="p-2 rounded-xl bg-emerald/15 text-emerald">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-serif-display font-bold text-emerald">
              {formatCurrency(kpis.monthly_revenue_usd, currency)}
            </span>
            <div className="flex items-center gap-1 text-[11px] text-emerald mt-1 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>{kpis.monthly_revenue_trend}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analytical Section: Charts & Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left 2 Columns: Occupancy & Revenue Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Occupancy Trend Card */}
          <div className="p-6 rounded-3xl theme-bg-elevated border theme-border shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif-display font-semibold theme-text-primary">
                  14-Day Occupancy Trend (%)
                </h3>
                <p className="text-xs theme-text-secondary">
                  Gold bars represent daily suite occupancy with overlaid spline velocity
                </p>
              </div>
              <span className="text-xs font-mono text-gold px-2.5 py-1 rounded-lg bg-gold/10 border border-gold/30">
                Avg: 86.4%
              </span>
            </div>

            <OccupancyChart data={trendData} />
          </div>

          {/* Revenue Yield Companion Card */}
          <div className="p-6 rounded-3xl theme-bg-elevated border theme-border shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-serif-display font-semibold theme-text-primary">
                  Companion Daily Gross Yield
                </h3>
                <p className="text-xs theme-text-secondary">
                  Combined room rates and folio service revenue in {currency}
                </p>
              </div>
              <span className="text-xs font-mono text-emerald px-2.5 py-1 rounded-lg bg-emerald/10 border border-emerald/30">
                Peak: {formatCurrency(25400, currency)}
              </span>
            </div>

            <RevenueChart data={trendData} currency={currency} />
          </div>
        </div>

        {/* Right 1 Column: Channel Mix & AI Rate Recommendation */}
        <div className="space-y-6">

          {/* Channel Mix Card */}
          <div className="p-6 rounded-3xl theme-bg-elevated border theme-border shadow-xl space-y-5">
            <div>
              <h3 className="text-base font-serif-display font-semibold theme-text-primary">
                Channel Distribution Mix
              </h3>
              <p className="text-xs theme-text-secondary">
                Direct brand bookings vs OTA commission attribution
              </p>
            </div>

            <ChannelMixChart channels={channelData} />

            <div className="p-3 rounded-xl theme-bg-primary border theme-border text-[11px] theme-text-secondary">
              Direct bookings represent <strong className="text-gold">48%</strong> of total volume, saving ~$14,200/mo in third-party OTA commissions.
            </div>
          </div>

          {/* AI Dynamic Pricing Card */}
          <div className="relative p-6 rounded-3xl theme-bg-elevated border border-gold/50 shadow-2xl space-y-4 overflow-hidden">
            <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 bg-gold/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold">
                <Sparkles className="w-4 h-4 animate-spin-slow" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold block">
                  Gemini Flash Dynamic Yield Engine
                </span>
                <h3 className="text-sm font-serif-display font-semibold theme-text-primary">
                  {aiRecommendation.title}
                </h3>
              </div>
            </div>

            <div className="p-3.5 rounded-xl theme-bg-primary border theme-border space-y-2 text-xs">
              <p className="font-semibold text-gold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-gold" />
                {aiRecommendation.headline}
              </p>
              <p className="theme-text-secondary leading-relaxed text-[11.5px]">
                {aiRecommendation.suggestion}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] theme-text-secondary font-mono">
                Projected Yield Impact: +$18,400
              </span>
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-xl bg-gold hover:bg-gold-hover text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md"
              >
                Apply AI Surge Rules
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
