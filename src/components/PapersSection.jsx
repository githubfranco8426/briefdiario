import React from 'react';
import { FileText, ExternalLink, Bookmark } from 'lucide-react';

export function PapersSection({ papers = [] }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md lg:p-8 transition-all hover:border-white/15">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 opacity-15 blur-2xl"></div>

      <div className="relative mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 shadow-md shadow-cyan-500/20">
            <FileText className="h-5 w-5 text-white" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              PubMed
            </p>
            <h2 className="text-xl font-black tracking-tighter text-white">
              Papers del día
            </h2>
          </div>
        </div>

        <span className="text-xs font-medium text-cyan-300 bg-cyan-500/10 border border-cyan-400/20 px-3 py-1 rounded-full">
          {papers.length} estudios
        </span>
      </div>

      <div className="relative">
        <div className="space-y-4">
          {papers.map((paper) => (
            <article
              key={paper.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.07]"
            >
              <h3 className="font-semibold leading-snug text-white">
                {paper.titulo}
              </h3>
              <p className="mt-1 text-xs font-light italic text-cyan-300/90">
                {paper.revista}
              </p>
              <p className="mt-2.5 text-sm font-light leading-relaxed text-gray-300">
                {paper.resumen}
              </p>

              {/* Caja de recomendación clínica directa */}
              <div className="mt-3.5 rounded-xl border border-white/10 bg-white/5 p-3.5 text-sm font-light leading-relaxed text-gray-200 backdrop-blur-sm">
                <span className="font-semibold text-cyan-300 flex items-center gap-1.5 mb-1 text-xs uppercase tracking-wider">
                  <Bookmark className="h-3.5 w-3.5" />
                  Para tu práctica:
                </span>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {paper.aplicacion}
                </p>
              </div>

              <a
                href={paper.doi}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400 transition hover:text-cyan-300 hover:underline"
              >
                Leer en el DOI <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </article>
          ))}
        </div>

        <p className="mt-5 text-xs font-light text-gray-400">
          Artículos recuperados desde PubMed. Los enlaces llevan al DOI original.
        </p>
      </div>
    </section>
  );
}
