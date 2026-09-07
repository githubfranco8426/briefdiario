import React from 'react';
import { FileText, ExternalLink, Lightbulb, Bookmark } from 'lucide-react';

export function PapersSection({ papers = [] }) {
  return (
    <section className="glass-card rounded-2xl border border-white/10 bg-[#0e1320]/70 p-5 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/20 shadow-xl shadow-black/40 relative overflow-hidden flex flex-col h-full">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>

      <header className="flex justify-between items-center border-b border-white/10 pb-4 mb-5 z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-400/20">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-gray-400 block">
              NCBI PubMed API
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              PubMed Diario
            </h2>
          </div>
        </div>

        <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-medium">
          {papers.length} estudios
        </span>
      </header>

      <div className="z-10 space-y-4 flex-1">
        {papers.map((paper) => (
          <article
            key={paper.id}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4.5 transition-all duration-200 hover:border-cyan-400/30 hover:bg-white/[0.06]"
          >
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <h3 className="font-bold text-sm sm:text-base text-white leading-snug">
                {paper.titulo}
              </h3>
              <a
                href={paper.doi}
                target="_blank"
                rel="noopener noreferrer"
                title="Abrir en DOI"
                className="shrink-0 p-1.5 rounded-lg border border-white/10 bg-white/5 text-cyan-400 hover:text-cyan-200 hover:border-cyan-400/40 hover:bg-cyan-500/10 transition"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            <p className="text-xs font-mono italic text-cyan-300/80 mb-2">
              {paper.revista}
            </p>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light border-l-2 border-white/15 pl-3 mb-3">
              {paper.resumen}
            </p>

            {/* Caja de recomendación clínica 'Para tu práctica' */}
            <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-3 flex items-start gap-2.5 shadow-sm">
              <Lightbulb className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 block mb-0.5">
                  Para tu práctica clínica
                </span>
                <p className="text-xs text-gray-200 leading-relaxed font-normal">
                  {paper.aplicacion}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
