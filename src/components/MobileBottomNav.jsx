import React from 'react';
import { Calendar, Instagram, FileText, Newspaper, QrCode } from 'lucide-react';

export function MobileBottomNav({ activeTab, onSelectTab, onOpenConnect }) {
  const tabs = [
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'guiones', label: 'Guiones', icon: Instagram },
    { id: 'papers', label: 'Papers', icon: FileText },
    { id: 'noticias', label: 'Noticias', icon: Newspaper },
  ];

  const scrollToSection = (tabId) => {
    onSelectTab(tabId);
    const element = document.getElementById(tabId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090d16]/95 backdrop-blur-xl border-t border-white/10 px-2 py-2 safe-bottom">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => scrollToSection(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-blue-400 font-semibold'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
              <span className="text-[10px] mt-1 tracking-tight">{tab.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onOpenConnect}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-xl text-purple-400 hover:text-purple-300 transition-all"
        >
          <QrCode className="h-5 w-5" />
          <span className="text-[10px] mt-1 tracking-tight">QR Celular</span>
        </button>
      </div>
    </nav>
  );
}
