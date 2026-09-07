import React from 'react';
import { LayoutDashboard, Calendar, Instagram, FileText, Newspaper, QrCode } from 'lucide-react';

export function MobileBottomNav({ activeTab, onSelectTab, onOpenConnect }) {
  const tabs = [
    { id: 'all', label: 'Todo', icon: LayoutDashboard },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'guiones', label: 'Guiones', icon: Instagram },
    { id: 'papers', label: 'Papers', icon: FileText },
    { id: 'noticias', label: 'Noticias', icon: Newspaper },
  ];

  return (
    <nav className="sm:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex justify-between items-center px-3 py-2 bg-[#0c121e]/85 backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_20px_rgba(0,240,255,0.1)] w-[92%] max-w-md rounded-full safe-bottom">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            aria-label={tab.label}
            className={`flex items-center justify-center transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-cyan-400 text-slate-950 rounded-full w-10 h-10 shadow-[0_0_15px_rgba(0,240,255,0.5)] scale-105'
                : 'text-gray-400 hover:text-white w-10 h-10 rounded-full hover:bg-white/5 active:scale-95'
            }`}
          >
            <Icon className={`h-4.5 w-4.5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          </button>
        );
      })}

      <button
        type="button"
        onClick={onOpenConnect}
        aria-label="Conectar celular"
        title="QR Celular"
        className="flex items-center justify-center text-purple-300 hover:text-purple-200 w-10 h-10 rounded-full hover:bg-purple-500/10 transition active:scale-95"
      >
        <QrCode className="h-4.5 w-4.5" />
      </button>
    </nav>
  );
}
