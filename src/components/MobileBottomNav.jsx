import React from 'react';
import { LayoutDashboard, Calendar, Instagram, FileText, Newspaper } from 'lucide-react';

export function MobileBottomNav({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'all', label: 'Todo', icon: LayoutDashboard },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'guiones', label: 'Guiones', icon: Instagram },
    { id: 'papers', label: 'Papers', icon: FileText },
    { id: 'noticias', label: 'Noticias', icon: Newspaper },
  ];

  return (
    <nav className="sm:hidden fixed bottom-2.5 left-1/2 -translate-x-1/2 z-50 frosted-glass shadow-2xl flex justify-around items-center px-1.5 py-1.5 w-[94%] max-w-md rounded-2xl pb-safe">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            aria-label={tab.label}
            className={`relative flex flex-col items-center gap-1 justify-center flex-1 py-1 px-1 transition-all duration-200 cursor-pointer ${
              isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200 active:scale-95'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isActive ? 'bg-cyan-400/15 shadow-inner' : ''}`}>
              <Icon className={`h-4 w-4 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            </div>
            <span className="text-[9px] font-medium tracking-tight leading-none">
              {tab.label}
            </span>
            {isActive && <span className="absolute bottom-0 w-3 h-0.5 bg-cyan-400 rounded-full"></span>}
          </button>
        );
      })}
    </nav>
  );
}
