import React, { useState } from 'react';
import {
  FileText,
  ExternalLink,
  Lightbulb,
  Languages,
  BookOpen,
  Copy,
  Check,
  X,
  Sparkles,
  Stethoscope,
  ChevronRight
} from 'lucide-react';

export function PapersSection({ papers = [] }) {
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [langPreference, setLangPreference] = useState({});

  const toggleLanguage = (paperId) => {
    setLangPreference((prev) => ({
      ...prev,
      [paperId]: prev[paperId] === 'en' ? 'es' : 'en'
    }));
  };

  const handleCopySummary = (paper) => {
    const textToCopy = `🔬 *${paper.titulo}*\n📚 *Revista:* ${paper.revista}\n\n📝 *Resumen:* ${paper.resumen}\n\n💡 *Para la práctica:* ${paper.aplicacion}\n\n🔗 *Enlace:* ${paper.doi}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(paper.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="glass-card rounded-2xl border border-white/10 bg-[#0e1320]/70 p-5 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/20 shadow-xl shadow-black/40 relative overflow-hidden flex flex-col h-full">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>

      <header className="flex flex-wrap justify-between items-center gap-3 border-b border-white/10 pb-4 mb-5 z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-cyan-400">
                Evidencia Científica
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 flex items-center gap-1">
                <Languages className="h-3 w-3" /> En Español
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              PubMed Diario
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-medium">
            {papers.length} estudios
          </span>
        </div>
      </header>

      {/* Sub-aviso de lectura en español */}
      <div className="z-10 mb-4 p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20 flex items-center justify-between gap-3 text-xs text-cyan-200">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="h-4 w-4 text-cyan-400 shrink-0" />
          <p className="truncate">
            Títulos y resúmenes sintetizados en <strong>español clínico</strong>. Toca <strong>"Leer traducido"</strong> para ver el paper original en español.
          </p>
        </div>
      </div>

      <div className="z-10 space-y-4 flex-1">
        {papers.map((paper) => {
          const isEnglish = langPreference[paper.id] === 'en';
          const displayTitle = isEnglish ? (paper.titulo_original || paper.titulo) : paper.titulo;
          const translateUrl = paper.translateUrl || `https://translate.google.com/translate?sl=auto&tl=es&u=${encodeURIComponent(paper.doi)}`;

          return (
            <article
              key={paper.id}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4.5 sm:p-5 transition-all duration-200 hover:border-cyan-400/30 hover:bg-white/[0.06] flex flex-col justify-between"
            >
              <div>
                {/* Metadatos y alternador de idioma */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-semibold text-cyan-400/90 truncate">
                    {paper.revista}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleLanguage(paper.id)}
                    title="Alternar entre título en Español y original en Inglés"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border border-white/10 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/30 text-[11px] font-mono text-gray-300 hover:text-cyan-300 transition cursor-pointer shrink-0"
                  >
                    <Languages className="h-3 w-3" />
                    <span>{isEnglish ? 'EN (Original)' : 'ES (Traducido)'}</span>
                  </button>
                </div>

                {/* Título */}
                <h3 className="font-bold text-sm sm:text-base text-white leading-snug mb-2">
                  {displayTitle}
                </h3>

                {/* Subtítulo con el otro idioma si está en español */}
                {!isEnglish && paper.titulo_original && (
                  <p className="text-[11px] font-mono text-gray-400 italic line-clamp-1 mb-2.5">
                    Orig: {paper.titulo_original}
                  </p>
                )}

                {/* Resumen clínico en español */}
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light border-l-2 border-cyan-500/30 pl-3 mb-3.5">
                  {paper.resumen}
                </p>

                {/* Recomendación clínica 'Para tu práctica' */}
                <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-3 flex items-start gap-2.5 shadow-sm mb-4">
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
              </div>

              {/* Botones de acción y lectura en español */}
              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {/* Botón 1: Leer artículo completo traducido al español */}
                  <a
                    href={translateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs hover:bg-cyan-300 transition shadow-[0_0_12px_rgba(0,240,255,0.3)] active:scale-95"
                    title="Abre la página completa del estudio traducida automáticamente a español por Google Translate"
                  >
                    <Languages className="h-3.5 w-3.5 stroke-[2.5]" />
                    <span>Leer traducido (ES)</span>
                    <ExternalLink className="h-3 w-3 stroke-[2.5]" />
                  </a>

                  {/* Botón 2: Ver Ficha Clínica In-App */}
                  <button
                    type="button"
                    onClick={() => setSelectedPaper(paper)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 text-gray-200 hover:text-white hover:border-cyan-400/40 hover:bg-white/10 text-xs font-semibold transition cursor-pointer"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Ficha clínica</span>
                  </button>
                </div>

                {/* Botón 3: Enlace al DOI Original */}
                <a
                  href={paper.doi}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Abrir estudio original en PubMed / DOI (Inglés)"
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-gray-400 hover:text-cyan-300 transition"
                >
                  <span>DOI</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </article>
          );
        })}
      </div>

      {/* Modal con Ficha Clínica Completa en Español */}
      {selectedPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl border border-white/15 bg-[#0d1424] p-6 sm:p-7 shadow-2xl overflow-y-auto max-h-[90vh]">
            {/* Cerrar modal */}
            <button
              type="button"
              onClick={() => setSelectedPaper(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Cerrar ficha"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Encabezado Ficha */}
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-400/20">
                <Stethoscope className="h-4 w-4" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                Ficha Clínica en Español
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-gray-300">
                {selectedPaper.revista}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white leading-snug mb-2">
              {selectedPaper.titulo}
            </h3>

            {selectedPaper.titulo_original && (
              <p className="text-xs font-mono text-gray-400 italic mb-4 pb-3 border-b border-white/10">
                Título original: {selectedPaper.titulo_original}
              </p>
            )}

            {/* Secciones detalladas en español */}
            <div className="space-y-4 my-4 text-xs sm:text-sm text-gray-200">
              {/* Objetivo */}
              {selectedPaper.objetivo && (
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <h4 className="text-xs font-mono font-bold uppercase text-cyan-400 mb-1 flex items-center gap-1.5">
                    <ChevronRight className="h-3.5 w-3.5" /> Objetivo del Estudio
                  </h4>
                  <p className="text-gray-300 leading-relaxed font-light pl-5">
                    {selectedPaper.objetivo}
                  </p>
                </div>
              )}

              {/* Metodología */}
              {selectedPaper.metodologia && (
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <h4 className="text-xs font-mono font-bold uppercase text-purple-400 mb-1 flex items-center gap-1.5">
                    <ChevronRight className="h-3.5 w-3.5" /> Población y Metodología
                  </h4>
                  <p className="text-gray-300 leading-relaxed font-light pl-5">
                    {selectedPaper.metodologia}
                  </p>
                </div>
              )}

              {/* Hallazgos */}
              {selectedPaper.hallazgos && (
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10">
                  <h4 className="text-xs font-mono font-bold uppercase text-emerald-400 mb-1 flex items-center gap-1.5">
                    <ChevronRight className="h-3.5 w-3.5" /> Resultados y Hallazgos Principales
                  </h4>
                  <p className="text-gray-300 leading-relaxed font-light pl-5">
                    {selectedPaper.hallazgos}
                  </p>
                </div>
              )}

              {/* Aplicación práctica */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                <h4 className="text-xs font-mono font-bold uppercase text-emerald-300 mb-1 flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4 text-emerald-400" /> Aplicación Práctica en Kinesiología
                </h4>
                <p className="text-gray-100 leading-relaxed font-normal pl-5">
                  {selectedPaper.aplicacion}
                </p>
              </div>
            </div>

            {/* Acciones del modal */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={selectedPaper.translateUrl || `https://translate.google.com/translate?sl=auto&tl=es&u=${encodeURIComponent(selectedPaper.doi)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs hover:bg-cyan-300 transition shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                >
                  <Languages className="h-4 w-4 stroke-[2.5]" />
                  <span>Abrir Paper Completo Traducido (Google)</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>

                <a
                  href={selectedPaper.doi}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/15 bg-white/5 text-gray-300 hover:text-white text-xs font-semibold hover:bg-white/10 transition"
                >
                  <span>Ver Fuente Original (DOI)</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <button
                type="button"
                onClick={() => handleCopySummary(selectedPaper)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-xs text-gray-300 hover:text-cyan-300 transition cursor-pointer"
              >
                {copiedId === selectedPaper.id ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-300">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copiar Ficha</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
