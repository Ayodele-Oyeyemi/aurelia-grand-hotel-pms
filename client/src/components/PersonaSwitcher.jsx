import React from 'react';
import { Crown, Bell, Sparkles, BarChart3, UserCheck } from 'lucide-react';

const PERSONAS = [
  {
    id: 'guest',
    label: 'Guest Portal',
    icon: Crown,
    name: 'Chidi Okafor',
    role: 'Black Tier VIP Guest',
    badge: 'VIP Member'
  },
  {
    id: 'frontdesk',
    label: 'Front Desk',
    icon: Bell,
    name: 'Amara Nwosu',
    role: 'Duty Manager',
    badge: 'Front Office'
  },
  {
    id: 'housekeeping',
    label: 'Housekeeping',
    icon: Sparkles,
    name: 'Tunde Bakare',
    role: 'Floor Supervisor',
    badge: 'Operations'
  },
  {
    id: 'analytics',
    label: 'GM Analytics',
    icon: BarChart3,
    name: 'Elena Rostova',
    role: 'General Manager',
    badge: 'Executive'
  }
];

export default function PersonaSwitcher({ activeView, setActiveView }) {
  const currentPersona = PERSONAS.find(p => p.id === activeView) || PERSONAS[0];

  return (
    <div className="flex flex-col items-center sm:items-end gap-1.5">
      {/* Persona selection pills */}
      <div className="inline-flex flex-wrap items-center bg-obsidian/80 p-1 rounded-xl border border-card-border gap-1">
        {PERSONAS.map((persona) => {
          const Icon = persona.icon;
          const isActive = activeView === persona.id;
          return (
            <button
              key={persona.id}
              onClick={() => setActiveView(persona.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gold text-obsidian font-semibold shadow-md ring-1 ring-gold/50'
                  : 'text-text-secondary hover:text-text-primary hover:bg-elevated'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{persona.label}</span>
            </button>
          );
        })}
      </div>

      {/* Subtext indicator */}
      <div className="flex items-center gap-1.5 text-[11px] text-text-secondary">
        <UserCheck className="w-3 h-3 text-gold" />
        <span>
          Viewing as: <strong className="text-text-primary font-medium">{currentPersona.name}</strong> — {currentPersona.role}
        </span>
      </div>
    </div>
  );
}
