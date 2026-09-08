import React from 'react';
import { Newspaper, ExternalLink, TrendingUp } from 'lucide-react';

export function NewsSection({ news = [] }) {
  return (
    <section className="glass-card rounded-2xl border border-white/10 bg-[#0e1422]/70 p-5 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:border-emerald-500/20 shadow-xl shadow-black/40 relative overflow-hidden flex flex-col h-full">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl"></div>

      <header className="flex justify-between items-center border-b border-white/10 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-400/20 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <Newspaper className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 block">
              Actualidad & Prensa
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Briefing Nacional
            </h2>
          </div>
        </div>

        <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium flex items-center gap-1">
          <TrendingUp className="h-3 w-3" />
          Chile
        </span>
      </header>

      <div className="space-y-3.5 flex-1 flex flex-col justify-between">
        {news.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-200 hover:border-emerald-400/30 hover:bg-white/[0.06] relative overflow-hidden"
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
