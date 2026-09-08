import React from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';

export function NewsSection({ news = [] }) {
  return (
    <section className="glass-card shadow-glass rounded-2xl p-5 sm:p-7 transition-all duration-300 hover:border-emerald-500/30 relative overflow-hidden flex flex-col h-full">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl"></div>

      <header className="flex justify-between items-center border-b border-white/10 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-inner">
            <Newspaper className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 block">
              Actualidad & Prensa
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight font-display">
              Briefing Nacional
            </h2>
          </div>
        </div>

        <span className="text-[10px] font-mono text-slate-400">
          Chile Hoy
        </span>
      </header>

      <div className="space-y-3.5 flex-1 flex flex-col justify-between">
        {news.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-xl border border-white/5 bg-slate-900/60 p-4 transition-all duration-200 hover:border-emerald-500/30 relative overflow-hidden"
          >
            {/* Indicador vertical de color */}
            <span
              className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${
                item.borderGradient || 'from-emerald-400 to-teal-500'
              }`}
            ></span>

            <div className="pl-2">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400">
                  {item.categoria}
                </span>
                <span className="text-[11px] text-gray-400 group-hover:text-emerald-300 flex items-center gap-1 transition-colors">
                  {item.fuente} <ExternalLink className="h-3 w-3" />
                </span>
              </div>

              <h3 className="font-bold text-sm text-white leading-snug group-hover:text-emerald-200 transition-colors">
                {item.titulo}
              </h3>

              <p className="mt-1.5 text-xs text-gray-300 leading-relaxed font-light line-clamp-2">
                {item.detalle}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
