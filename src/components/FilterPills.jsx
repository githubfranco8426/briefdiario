import React from 'react';

export function FilterPills({ activeFilter, onSelectFilter, counts = {} }) {
  const filters = [
    { id: 'all', label: 'Todos', count: null },
    { id: 'agenda', label: 'Agenda', count: counts.agenda },
    { id: 'guiones', label: 'Guiones RRSS', count: counts.ideas },
    { id: 'papers', label: 'PubMed Papers', count: counts.papers },
    { id: 'noticias', label: 'Noticias Chile', count: counts.noticias },
  ];

  return (
    <section className="mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {filters.map((f) => {
          const isActive = activeFilter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onSelectFilter(f.id)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-bold shadow-glow-cyan scale-[1.02]'
                  : 'frosted-pill text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <span>{f.label}</span>
              {f.count !== null && f.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-black/20 text-slate-900 font-bold' : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {f.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
