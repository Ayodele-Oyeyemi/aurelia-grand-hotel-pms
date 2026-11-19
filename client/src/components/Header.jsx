import React, { useState, useRef, useEffect } from 'react';
import { Crown, ChevronDown, Sun, Moon, Globe, User, LogOut, BookOpen, Menu, X } from 'lucide-react';

// Property dropdown data
const PROPERTY_LINKS = [
  {
    label: 'AURELIA GARDENS',
    wing: 'aurelia-gardens',
    rooms: ['Garden Standard Room', 'Garden Classic Room']
  },
  {
    label: 'AURELIA HOTEL', 
    wing: 'aurelia-hotel',
    rooms: ['Classic Superior Room', 'Atlantic Superior Room', 'Diplomatic Suite', 'Presidential Suite']
  },
  {
    label: 'AURELIA SUITES',
    wing: 'aurelia-suites',
    rooms: ['Studio Suite', 'Executive Suite']
  }
];

const NAV_LEFT = [
  { label: 'HOME', href: '#home' },
  { label: 'DINING', href: '#dining' },
  {
    label: 'MEETINGS & BANQUETING',
    href: '#meetings',
    children: ['Grand Ballroom', 'Convention Centre', 'Fantasia', 'Executive Boardrooms']
  }
];

const NAV_RIGHT = [
  {
    label: 'RECREATIONAL SERVICES',
    href: '#recreational',
    children: ['Swimming Pool', 'Gymnasium', 'Tennis Courts', 'Thermal Spa', 'Salon & Nail Studio']
  },
  {
    label: 'EVENTS',
    href: '#events',
    children: ['Events & Tickets', 'Tropical Wonderland', 'Haute Table', 'Intimate Celebrations']
  },
  { label: 'GALLERY', href: '#gallery' }
];

const STAFF_VIEWS = [
  { id: 'guest', label: '👑 Guest Portal' },
  { id: 'frontdesk', label: '🛎️ Front Desk' },
  { id: 'housekeeping', label: '🧹 Housekeeping' },
  { id: 'analytics', label: '📊 GM Analytics' }
];

function DropdownMenu({ label, children, wing, onWingSelect, href }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  return (
    <div ref={ref} className="relative">
      <button onClick={() => children ? setOpen(!open) : null}
        className="flex items-center gap-1 text-xs font-semibold tracking-wider uppercase theme-text-primary hover:text-gold transition-colors whitespace-nowrap cursor-pointer py-1">
        {label}
        {children && <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />}
      </button>
      {open && children && (
        <div className="absolute top-full left-0 mt-2 w-52 theme-bg-elevated border theme-border rounded-xl shadow-xl z-50 py-1.5 overflow-hidden">
          {children.map((item, i) => (
            <button key={i} onClick={() => { if (onWingSelect) onWingSelect(item); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-xs theme-text-secondary hover:theme-bg-secondary hover:text-gold transition-colors">
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Header({ activeView, setActiveView, currency, setCurrency, onOpenDevSpecs, onOpenAuth, currentUser, onLogout, theme, onToggleTheme }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [staffDropOpen, setStaffDropOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const staffRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (staffRef.current && !staffRef.current.contains(e.target)) setStaffDropOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id.replace('#', ''));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full" style={{ backgroundColor: 'var(--header-bg)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-color)' }}>
      
      {/* ── TOP UTILITY BAR ── */}
      <div className="border-b theme-border">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-9 gap-4">

            {/* Left: Property Wing Dropdowns */}
            <div className="hidden lg:flex items-center gap-5">
              {PROPERTY_LINKS.map((prop) => (
                <DropdownMenu
                  key={prop.wing}
                  label={prop.label}
                  children={prop.rooms}
                  onWingSelect={(room) => {
                    setActiveView('guest');
                    setTimeout(() => {
                      const el = document.getElementById('suite-grid');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                />
              ))}
            </div>

            {/* Right: Utility controls */}
            <div className="flex items-center gap-2 ml-auto">
              {/* The Company */}
              <button className="hidden sm:block text-xs font-semibold tracking-wider uppercase theme-text-secondary hover:text-gold transition-colors cursor-pointer">
                THE COMPANY
              </button>

              <div className="hidden sm:block h-4 w-px" style={{ backgroundColor: 'var(--border-color)' }} />

              {/* Currency */}
              <button onClick={() => setCurrency(c => c === 'USD' ? 'NGN' : 'USD')}
                className="flex items-center gap-1 text-xs font-semibold text-gold hover:text-gold-hover cursor-pointer transition-colors">
                <Globe className="w-3.5 h-3.5" />
                <span>{currency === 'USD' ? 'USD $' : 'NGN ₦'}</span>
              </button>

              <div className="hidden sm:block h-4 w-px" style={{ backgroundColor: 'var(--border-color)' }} />

              {/* Theme Toggle */}
              <button onClick={onToggleTheme}
                className="flex items-center gap-1 text-xs font-medium theme-text-secondary hover:text-gold cursor-pointer transition-colors"
                title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
                {theme === 'light'
                  ? <><Moon className="w-3.5 h-3.5" /><span className="hidden sm:inline">Dark</span></>
                  : <><Sun className="w-3.5 h-3.5" /><span className="hidden sm:inline">Light</span></>
                }
              </button>

              <div className="hidden sm:block h-4 w-px" style={{ backgroundColor: 'var(--border-color)' }} />

              {/* PMS Staff Views Dropdown */}
              {activeView !== 'guest' && (
                <div ref={staffRef} className="relative">
                  <button onClick={() => setStaffDropOpen(!staffDropOpen)}
                    className="flex items-center gap-1 text-xs font-semibold tracking-wider uppercase text-amber hover:text-gold cursor-pointer transition-colors">
                    PMS Staff Views
                    <ChevronDown className={`w-3 h-3 transition-transform ${staffDropOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {staffDropOpen && (
                    <div className="absolute top-full right-0 mt-2 w-44 theme-bg-elevated border theme-border rounded-xl shadow-xl z-50 py-1.5">
                      {STAFF_VIEWS.map(v => (
                        <button key={v.id} onClick={() => { setActiveView(v.id); setStaffDropOpen(false); }}
                          className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${activeView === v.id ? 'text-gold font-semibold' : 'theme-text-secondary hover:text-gold'}`}>
                          {v.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Auth */}
              {currentUser ? (
                <div ref={userRef} className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold text-white text-xs font-semibold cursor-pointer hover:bg-gold-hover transition-colors">
                    <User className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{currentUser.name?.split(' ')[0]}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-white/20">{currentUser.vip_tier?.toUpperCase()}</span>
                  </button>
                  {userMenuOpen && (
                    <div className="absolute top-full right-0 mt-2 w-44 theme-bg-elevated border theme-border rounded-xl shadow-xl z-50 py-1.5">
                      <div className="px-4 py-2 border-b theme-border">
                        <p className="text-xs font-semibold theme-text-primary">{currentUser.name}</p>
                        <p className="text-[11px] theme-text-muted">{currentUser.email}</p>
                      </div>
                      <button className="w-full text-left px-4 py-2.5 text-xs theme-text-secondary hover:text-gold flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5" /> My Bookings
                      </button>
                      <button onClick={() => { onLogout(); setUserMenuOpen(false); }}
                        className="w-full text-left px-4 py-2.5 text-xs text-rose hover:text-rose/80 flex items-center gap-2">
                        <LogOut className="w-3.5 h-3.5" /> Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => onOpenAuth('login')}
                  className="px-4 py-1.5 rounded-full bg-gold hover:bg-gold-hover text-white text-xs font-bold tracking-wide cursor-pointer transition-colors shadow-sm">
                  Login / Sign Up
                </button>
              )}

              {/* Mobile menu toggle */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-1 theme-text-secondary hover:text-gold cursor-pointer">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN SPLIT NAV BAR with Centered Crest ── */}
      <div className="hidden lg:block">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-6">
            
            {/* Left nav */}
            <nav className="flex items-center gap-6 flex-1">
              {NAV_LEFT.map((item) =>
                item.children ? (
                  <DropdownMenu key={item.label} label={item.label} children={item.children}
                    onWingSelect={() => scrollToSection(item.href)} />
                ) : (
                  <button key={item.label} onClick={() => scrollToSection(item.href)}
                    className="text-xs font-bold tracking-wider uppercase theme-text-primary hover:text-gold transition-colors cursor-pointer">
                    {item.label}
                  </button>
                )
              )}
            </nav>

            {/* Center: Crest Logo */}
            <div onClick={() => { setActiveView('guest'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex flex-col items-center cursor-pointer flex-shrink-0 group">
              <div className="w-12 h-12 rounded-full border-2 border-gold bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                <Crown className="w-6 h-6 text-gold" />
              </div>
              <div className="text-center mt-1">
                <p className="text-[11px] font-serif-display font-bold tracking-widest text-gold leading-tight">THE AURELIA GRAND</p>
                <p className="text-[8px] tracking-[0.2em] theme-text-muted uppercase">& SUITES</p>
              </div>
            </div>

            {/* Right nav */}
            <nav className="flex items-center gap-6 flex-1 justify-end">
              {NAV_RIGHT.map((item) =>
                item.children ? (
                  <DropdownMenu key={item.label} label={item.label} children={item.children}
                    onWingSelect={() => scrollToSection(item.href)} />
                ) : (
                  <button key={item.label} onClick={() => scrollToSection(item.href)}
                    className="text-xs font-bold tracking-wider uppercase theme-text-primary hover:text-gold transition-colors cursor-pointer">
                    {item.label}
                  </button>
                )
              )}
            </nav>

          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden theme-bg-elevated border-t theme-border px-4 py-4 space-y-2">
          {STAFF_VIEWS.map(v => (
            <button key={v.id} onClick={() => { setActiveView(v.id); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeView === v.id ? 'bg-gold/10 text-gold font-semibold' : 'theme-text-secondary hover:text-gold'}`}>
              {v.label}
            </button>
          ))}
          {!currentUser && (
            <button onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }}
              className="w-full py-2.5 rounded-xl bg-gold text-white text-sm font-bold">
              Login / Sign Up
            </button>
          )}
        </div>
      )}
    </header>
  );
}
