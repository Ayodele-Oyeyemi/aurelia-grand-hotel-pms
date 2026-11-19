import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import GuestPortal from './components/GuestPortal';
import FrontDesk from './components/FrontDesk';
import Housekeeping from './components/Housekeeping';
import Analytics from './components/Analytics';
import DevSpecsModal from './components/DevSpecsModal';
import AuthModal from './components/AuthModal';
import { Crown, Sparkles, MapPin, Phone, Mail } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState('guest');
  const [currency, setCurrency] = useState('USD');
  const [showDevSpecs, setShowDevSpecs] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aurelia-user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [theme, setTheme] = useState(() => localStorage.getItem('aurelia-theme') || 'light');

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('aurelia-theme', next);
  };

  const handleLogin = (user, token) => {
    setCurrentUser(user);
    if (token) localStorage.setItem('aurelia-token', token);
    localStorage.setItem('aurelia-user', JSON.stringify(user));
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('aurelia-user');
    localStorage.removeItem('aurelia-token');
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen theme-bg-primary theme-text-primary flex flex-col selection:bg-gold/20 selection:text-gold">
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        currency={currency}
        setCurrency={setCurrency}
        onOpenDevSpecs={() => setShowDevSpecs(true)}
        onOpenAuth={openAuth}
        currentUser={currentUser}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1 w-full">
        {activeView === 'guest' && (
          <GuestPortal
            currency={currency}
            currentUser={currentUser}
            onOpenAuth={openAuth}
            theme={theme}
          />
        )}
        {activeView === 'frontdesk' && <FrontDesk currency={currency} />}
        {activeView === 'housekeeping' && <Housekeeping />}
        {activeView === 'analytics' && <Analytics currency={currency} />}
      </main>

      {/* Footer */}
      <footer className="theme-bg-elevated border-t theme-border mt-auto print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gold/15 border border-gold/40 flex items-center justify-center text-gold">
                  <Crown className="w-4 h-4" />
                </div>
                <span className="font-serif-display font-bold text-gold text-sm tracking-wide">THE AURELIA GRAND</span>
              </div>
              <p className="theme-text-secondary leading-relaxed text-[11px]">
                An ultra-luxury waterfront sanctuary blending West African cultural richness with timeless European elegance.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold theme-text-primary uppercase tracking-wider text-[11px] text-gold">Resort & Marina</h4>
              <p className="theme-text-secondary flex items-start gap-1.5 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                <span>Plot 104, Ozumba Mbadiwe Avenue, Victoria Island, Lagos</span>
              </p>
              <p className="theme-text-secondary flex items-center gap-1.5 text-[11px]">
                <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>+234 1 800 AURELIA</span>
              </p>
              <p className="theme-text-secondary flex items-center gap-1.5 text-[11px]">
                <Mail className="w-3.5 h-3.5 text-gold shrink-0" />
                <span>concierge@aureliagrand.com</span>
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold theme-text-primary uppercase tracking-wider text-[11px] text-gold">Bespoke Services</h4>
              <ul className="theme-text-secondary space-y-1 text-[11px]">
                <li>• Horizon Helipad & Private Catamaran</li>
                <li>• 24/7 Butler & Valet Suite Service</li>
                <li>• Michelin-Inspired Dining at L'Orangerie</li>
                <li>• Hydrothermal Plunge Pools & Cryotherapy</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold theme-text-primary uppercase tracking-wider text-[11px] text-gold">Open-Source PMS Template</h4>
              <p className="theme-text-secondary text-[11px] leading-relaxed">
                Modular full-stack hospitality boilerplate engineered with React, Tailwind CSS v4, Express, and Supabase.
              </p>
              <button type="button" onClick={() => setShowDevSpecs(true)}
                className="inline-flex items-center gap-1.5 text-gold hover:underline text-[11px] font-semibold cursor-pointer pt-1">
                <Sparkles className="w-3 h-3" />
                <span>Explore PMS Dev Specifications</span>
              </button>
            </div>
          </div>
          <div className="border-t theme-border pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] theme-text-muted gap-3">
            <p>© 2026 The Aurelia Grand & Suites. All Rights Reserved.</p>
            <div className="flex items-center gap-4">
              <span>Obsidian & Champagne Gold Design System</span>
              <span>•</span>
              <span>Zero-Crash Hybrid Data Layer</span>
            </div>
          </div>
        </div>
      </footer>

      <DevSpecsModal isOpen={showDevSpecs} onClose={() => setShowDevSpecs(false)} />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        setMode={setAuthMode}
        onLogin={handleLogin}
      />
    </div>
  );
}
