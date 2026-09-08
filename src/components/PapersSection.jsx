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
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Share2,
  Smartphone
} from 'lucide-react';

export function PapersSection({ papers = [] }) {
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [langPreference, setLangPreference] = useState({});

  const toggleLanguage = (paperId, e) => {
    e?.stopPropagation();
    setLangPreference((prev) => ({
      ...prev,
      [paperId]: prev[paperId] === 'en' ? 'es' : 'en'
    }));
  };

  const toggleExpand = (paperId) => {
    setExpandedId((prev) => (prev === paperId ? null : paperId));
  };

  const handleCopySummary = (paper) => {
    const textToCopy = `🔬 *${paper.titulo}*\n📚 *Revista:* ${paper.revista}\n\n🎯 *Objetivo:* ${paper.objetivo || paper.resumen}\n\n📊 *Hallazgos:* ${paper.hallazgos || 'Ver estudio completo'}\n\n💡 *Para la práctica:* ${paper.aplicacion}\n\n🔗 *Enlace:* ${paper.doi}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(paper.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getDirectGoogleTranslateUrl = (paper) => {
    const text = `${paper.titulo_original || paper.titulo}\n\n${paper.resumen}\n\n${paper.aplicacion}`;
    return `https://translate.google.com/?sl=en&tl=es&text=${encodeURIComponent(text)}&op=translate`;
  };

  return (
    <section className="glass-card rounded-2xl border border-white/10 bg-[#0e1422]/70 p-5 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:border-sky-500/20 shadow-xl shadow-black/40 relative overflow-hidden flex flex-col h-full">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>

      <header className="flex flex-wrap justify-between items-center gap-3 border-b border-white/10 pb-4 mb-5 z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-400/20 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-sky-400">
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

        <span className="text-xs font-mono px-3 py-1 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20 font-medium">
          {papers.length} estudios
        </span>
      </header>

      {/* Sub-aviso de lectura instantánea */}
      <div className="z-10 mb-4 p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-between gap-3 text-xs text-sky-200">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="h-4 w-4 text-sky-400 shrink-0" />
          <p className="truncate">
            Toca <strong>"Leer en Español"</strong> para abrir la síntesis clínica completa traducida al instante.
          </p>
        </div>
      </div>

      <div className="z-10 space-y-4 flex-1">
        {papers.map((paper) => {
          const isEnglish = langPreference[paper.id] === 'en';
          const isExpanded = expandedId === paper.id;
          const displayTitle = isEnglish ? (paper.titulo_original || paper.titulo) : paper.titulo;

          return (
            <article
              key={paper.id}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4.5 sm:p-5 transition-all duration-200 hover:border-sky-400/30 hover:bg-white/[0.05] flex flex-col justify-between"
            >
              <div>
                {/* Metadatos y alternador de idioma */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono font-semibold text-sky-400/90 truncate">
                    {paper.revista}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => toggleLanguage(paper.id, e)}
                    title="Alternar entre título en Español y original en Inglés"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border border-white/10 bg-white/5 hover:bg-sky-500/10 hover:border-sky-500/30 text-[11px] font-mono text-slate-300 hover:text-sky-300 transition cursor-pointer shrink-0"
                  >
                    <Languages className="h-3 w-3" />
                    <span>{isEnglish ? 'EN (Original)' : 'ES (Traducido)'}</span>
                  </button>
                </div>

                {/* Título */}
                <h3
                  onClick={() => setSelectedPaper(paper)}
                  className="font-bold text-sm sm:text-base text-white leading-snug mb-2 cursor-pointer hover:text-sky-300 transition"
                >
                  {displayTitle}
                </h3>

                {/* Subtítulo original si está en español */}
                {!isEnglish && paper.titulo_original && (
                  <p className="text-[11px] font-mono text-slate-400 italic line-clamp-1 mb-2.5">
                    Orig: {paper.titulo_original}
                  </p>
                )}

                {/* Resumen clínico en español */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light border-l-2 border-sky-500/40 pl-3 mb-3.5">
                  {paper.resumen}
                </p>

                {/* Recomendación clínica 'Para tu práctica' */}
                <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-3 flex items-start gap-2.5 shadow-sm mb-3">
                  <Lightbulb className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300 block mb-0.5">
                      Para tu práctica clínica
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed font-normal">
                      {paper.aplicacion}
                    </p>
                  </div>
                </div>

                {/* Desglose inline si está expandido */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-3 text-xs text-slate-200 animate-fade-in bg-white/[0.02] p-3 rounded-xl">
                    {paper.objetivo && (
                      <div>
                        <strong className="text-sky-400 block mb-0.5 font-mono uppercase text-[10px]">
                          🎯 Objetivo:
                        </strong>
                        <p className="text-slate-300">{paper.objetivo}</p>
                      </div>
                    )}
                    {paper.metodologia && (
                      <div>
                        <strong className="text-teal-400 block mb-0.5 font-mono uppercase text-[10px]">
                          👥 Metodología:
                        </strong>
                        <p className="text-slate-300">{paper.metodologia}</p>
                      </div>
                    )}
                    {paper.hallazgos && (
                      <div>
                        <strong className="text-emerald-400 block mb-0.5 font-mono uppercase text-[10px]">
                          📊 Hallazgos clave:
                        </strong>
                        <p className="text-slate-300">{paper.hallazgos}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Botones de acción principales */}
              <div className="pt-3.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  {/* Botón Principal: Abrir Ficha Completa en Español (0 Espera) */}
                  <button
                    type="button"
                    onClick={() => setSelectedPaper(paper)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-400 text-slate-950 font-bold text-xs hover:bg-sky-300 transition shadow-[0_0_15px_rgba(56,189,248,0.35)] active:scale-95 cursor-pointer"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Leer en Español</span>
                  </button>

                  {/* Botón Expansión rápida dentro de la tarjeta */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(paper.id)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-white/15 bg-white/5 text-slate-200 hover:text-white hover:border-sky-400/40 hover:bg-white/10 text-xs font-medium transition cursor-pointer"
                  >
                    <span>{isExpanded ? 'Menos' : 'Detalles'}</span>
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                </div>

                {/* Botón Fuente original DOI */}
                <a
                  href={paper.doi}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Abrir estudio oficial en la revista científica (DOI)"
                  className="inline-flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-sky-300 transition p-2 rounded-lg hover:bg-white/5"
                >
                  <span>DOI</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </article>
          );
        })}
      </div>

      {/* Modal con Lectura Clínica Completa en Español */}
      {selectedPaper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overscroll-contain">
          <div className="relative w-full max-w-2xl rounded-2xl sm:rounded-3xl border border-sky-500/30 bg-[#0a101d] p-4 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-y-auto max-h-[85vh] overscroll-contain pb-6">
            {/* Cerrar modal */}
            <button
              type="button"
              onClick={() => setSelectedPaper(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              aria-label="Cerrar lectura"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Encabezado */}
            <div className="flex items-center gap-2 mb-3 pr-8">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400 border border-sky-400/30 shrink-0">
                <Stethoscope className="h-4 w-4" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-300 truncate">
                Lectura Clínica en Español
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300 truncate">
                {selectedPaper.revista}
              </span>
            </div>

            {/* Título en español */}
            <h3 className="text-base sm:text-xl font-bold text-white leading-snug mb-2">
              {selectedPaper.titulo}
            </h3>

            {/* Subtítulo original */}
            {selectedPaper.titulo_original && (
              <p className="text-xs font-mono text-slate-400 italic mb-4 pb-3 border-b border-white/10">
                Original: {selectedPaper.titulo_original}
              </p>
            )}

            {/* Contenido en español estructurado */}
            <div className="space-y-3.5 sm:space-y-4 my-4 text-xs sm:text-sm text-slate-200">
              {/* Objetivo */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                <h4 className="text-xs font-mono font-bold uppercase text-sky-400 mb-1.5 flex items-center gap-1.5">
                  <ChevronRight className="h-4 w-4 shrink-0" /> 1. Objetivo del Estudio
                </h4>
                <p className="text-slate-300 leading-relaxed font-light pl-5">
                  {selectedPaper.objetivo || selectedPaper.resumen}
                </p>
              </div>

              {/* Metodología */}
              {selectedPaper.metodologia && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <h4 className="text-xs font-mono font-bold uppercase text-teal-400 mb-1.5 flex items-center gap-1.5">
                    <ChevronRight className="h-4 w-4 shrink-0" /> 2. Población y Metodología
                  </h4>
                  <p className="text-slate-300 leading-relaxed font-light pl-5">
                    {selectedPaper.metodologia}
                  </p>
                </div>
              )}

              {/* Resultados */}
              {selectedPaper.hallazgos && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10">
                  <h4 className="text-xs font-mono font-bold uppercase text-emerald-400 mb-1.5 flex items-center gap-1.5">
                    <ChevronRight className="h-4 w-4 shrink-0" /> 3. Resultados y Hallazgos Principales
                  </h4>
                  <p className="text-slate-300 leading-relaxed font-light pl-5">
                    {selectedPaper.hallazgos}
                  </p>
                </div>
              )}

              {/* Aplicación práctica */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/35 shadow-inner">
                <h4 className="text-xs font-mono font-bold uppercase text-emerald-300 mb-1.5 flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4 text-emerald-400 shrink-0" /> 4. Aplicación Práctica en Kinesiología (rehabilita.me)
                </h4>
                <p className="text-slate-100 leading-relaxed font-normal pl-5">
                  {selectedPaper.aplicacion}
                </p>
              </div>

              {/* Tip de traducción en el navegador del celular */}
              <div className="p-3.5 rounded-2xl bg-sky-950/30 border border-sky-500/20 text-[11px] text-sky-200/90 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-sky-300">
                  <Smartphone className="h-3.5 w-3.5 shrink-0" />
                  <span>¿Deseas leer el paper completo original en la revista?</span>
                </div>
                <p className="text-slate-300 pl-5 leading-relaxed">
                  Abre el enlace oficial abajo y usa el traductor nativo de tu teléfono (en iPhone toca <strong>"aA"</strong> en Safari y elige <em>"Traducir al español"</em>; en Android toca los <strong>3 puntos ⋮</strong> en Chrome y elige <em>"Traducir"</em>).
                </p>
              </div>
            </div>

            {/* Barra de Acciones */}
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                {/* Enlace al DOI Oficial */}
                <a
                  href={selectedPaper.doi}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-400 text-slate-950 font-bold text-xs hover:bg-sky-300 transition shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                >
                  <span>Abrir en Revista (DOI)</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>

                {/* Enlace directo a Google Traductor de texto */}
                <a
                  href={getDirectGoogleTranslateUrl(selectedPaper)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-white/15 bg-white/5 text-slate-200 hover:text-white text-xs font-semibold hover:bg-white/10 transition"
                  title="Abre Google Traductor con el texto del estudio traducido al instante"
                >
                  <Languages className="h-4 w-4 text-sky-400" />
                  <span>Texto en Google Traductor</span>
                </a>
              </div>

              {/* Botón copiar ficha */}
              <button
                type="button"
                onClick={() => handleCopySummary(selectedPaper)}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs text-slate-300 hover:text-sky-300 transition cursor-pointer"
              >
                {copiedId === selectedPaper.id ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-300">¡Ficha Copiada!</span>
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

