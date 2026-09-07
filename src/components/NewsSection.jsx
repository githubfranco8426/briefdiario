import React from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';

export function NewsSection({ news = [] }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md lg:p-8 transition-all hover:border-white/15">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 opacity-15 blur-2xl"></div>

      <div className="relative mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md shadow-teal-500/20">
            <Newspaper className="h-5 w-5 text-white" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Actualidad
            </p>
            <h2 className="text-xl font-black tracking-tighter text-white">
              Lo importante de hoy
            </h2>
          </div>
        </div>

        <span className="text-xs font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-400/20 px-3 py-1 rounded-full">
          Chile & Economía
        </span>
      </div>

      <div className="relative">
        <div className="space-y-4">
          {news.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-200 hover:border-white/25 hover:bg-white/[0.08]"
            >
              {/* Colored left indicator line */}
              <span
                className={`absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b ${
                  item.borderGradient || 'from-emerald-400 to-teal-500'
                }`}
              ></span>

              <p className="pl-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {item.categoria}
              </p>
              <h3 className="mt-1 pl-2 font-semibold leading-snug text-white group-hover:text-emerald-300 transition-colors">
                {item.titulo}
              </h3>
              <p className="mt-2 pl-2 text-sm font-light leading-relaxed text-gray-300">
                {item.detalle}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 pl-2 text-xs font-light text-gray-400 group-hover:text-emerald-400 transition-colors">
                {item.fuente} <ExternalLink className="h-3 w-3" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
