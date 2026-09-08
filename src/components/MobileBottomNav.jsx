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
    <nav className="sm:hidden fixed bottom-2.5 left-1/2 -translate-x-1/2 z-50 flex justify-around items-center px-1.5 py-1.5 bg-[#090e18]/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_20px_rgba(56,189,248,0.2)] w-[94%] max-w-md rounded-2xl pb-safe">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            aria-label={tab.label}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-sky-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(56,189,248,0.45)] scale-105'
                : 'text-slate-400 hover:text-white hover:bg-white/5 active:scale-95'
            }`}
          >
            <Icon className={`h-4 w-4 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className="text-[10px] font-medium tracking-tight mt-0.5 leading-none">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
