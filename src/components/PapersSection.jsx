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
  Smartphone,
  BookMarked,
  Settings2,
  Library,
  Clapperboard
} from 'lucide-react';
import { classifyPaper } from '../hooks/useLibrary';

const NOTEBOOK_COLOR_CLASSES = {
  cyan: { pillActive: 'bg-cyan-400 text-slate-950 shadow-glow-cyan', dot: 'bg-cyan-400', text: 'text-cyan-300' },
  teal: { pillActive: 'bg-teal-400 text-slate-950 shadow-sm', dot: 'bg-teal-400', text: 'text-teal-300' },
  violet: { pillActive: 'bg-violet-400 text-slate-950 shadow-sm', dot: 'bg-violet-400', text: 'text-violet-300' },
};

function generateReelScript(paper) {
  return [
    `GANCHO: ¿Sabías esto sobre "${paper.titulo}"?`,
    `EL PAPER: ${paper.resumen}`,
    `PARA TU PRÁCTICA: ${paper.aplicacion}`,
    `CIERRE: Fuente — ${paper.revista}. Kinesiología basada en evidencia.`,
  ].join('\n\n');
}

export function PapersSection({ papers = [], library, onOpenSettings, onOpenLibrary }) {
  const { notebooks = [], savedPapers = [], saveToLibrary, isSaved } = library || {};
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [langPreference, setLangPreference] = useState({});
  const [notebookFilter, setNotebookFilter] = useState('all');
  const [scriptPaperId, setScriptPaperId] = useState(null);
  const [scriptCopied, setScriptCopied] = useState(false);

  const classifiedPapers = papers.map((p) => ({ paper: p, notebook: classifyPaper(p, notebooks) }));
  const visiblePapers = notebookFilter === 'all'
    ? classifiedPapers
    : classifiedPapers.filter(({ notebook }) => notebook?.id === notebookFilter);

  const handleSave = (paper, e) => {
    e?.stopPropagation();
    saveToLibrary?.(paper);
  };

  const handleGenerateScript = (paper) => {
    setScriptPaperId((prev) => (prev === paper.id ? null : paper.id));
    setScriptCopied(false);
  };

  const copyScript = (paper) => {
    navigator.clipboard.writeText(generateReelScript(paper));
    setScriptCopied(true);
    setTimeout(() => setScriptCopied(false), 2000);
  };

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
    <section className="glass-card shadow-glass rounded-2xl p-5 sm:p-7 transition-all duration-300 hover:border-cyan-500/40 relative overflow-hidden flex flex-col h-full">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-20 -bottom-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>

      <header className="flex flex-wrap justify-between items-center gap-3 border-b border-white/10 pb-4 mb-5 z-10">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-inner">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400">
                Evidencia Científica
              </span>
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <Languages className="h-3 w-3" /> En Español
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight font-display">
              PubMed Diario
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenLibrary}
            title="Ver biblioteca de papers guardados"
            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-950/50 text-cyan-400 border border-cyan-800/40 font-medium inline-flex items-center gap-1 hover:bg-cyan-900/60 transition cursor-pointer"
          >
            <Library className="h-3 w-3" />
            {savedPapers.length} guardados
          </button>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-400 border border-white/10 font-medium">
            {papers.length} estudios
          </span>
        </div>
      </header>

      {/* Estado de sincronización NotebookLM (local, no es la app real de Google) */}
      <button
        type="button"
        onClick={onOpenSettings}
        title="Configurar libretas y reglas de auto-tagging"
        className="z-10 mb-3 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between gap-3 text-[10px] text-cyan-300 hover:bg-cyan-950/60 transition cursor-pointer w-full text-left"
      >
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="h-4 w-4 text-cyan-400 shrink-0 animate-pulse" />
          <span className="truncate">
            <strong>NotebookLM local</strong> · Auto-tagging por libretas activo
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-cyan-400 shrink-0">
          <Settings2 className="h-3.5 w-3.5" />
          Configurar
        </span>
      </button>

      {/* Filtro de Libretas */}
      <div className="z-10 mb-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-[10px]">
        <button
          type="button"
          onClick={() => setNotebookFilter('all')}
          className={`px-2.5 py-1 rounded-full font-mono whitespace-nowrap transition shrink-0 ${
            notebookFilter === 'all' ? 'bg-cyan-400 text-slate-950 font-bold shadow-glow-cyan' : 'frosted-pill text-slate-300 hover:bg-slate-800/70'
          }`}
        >
          Todas ({papers.length})
        </button>
        {notebooks.map((nb) => {
          const count = classifiedPapers.filter(({ notebook }) => notebook?.id === nb.id).length;
          const colors = NOTEBOOK_COLOR_CLASSES[nb.color] || NOTEBOOK_COLOR_CLASSES.cyan;
          return (
            <button
              key={nb.id}
              type="button"
              onClick={() => setNotebookFilter(nb.id)}
              className={`px-2.5 py-1 rounded-full font-mono whitespace-nowrap transition shrink-0 flex items-center gap-1 ${
                notebookFilter === nb.id ? colors.pillActive + ' font-bold' : 'frosted-pill text-slate-300 hover:bg-slate-800/70'
              }`}
            >
              <span>{nb.emoji} {nb.name}</span>
              <span className={notebookFilter === nb.id ? 'opacity-80' : 'text-slate-500'}>({count})</span>
            </button>
          );
        })}
      </div>

      <div className="z-10 space-y-4 flex-1">
        {visiblePapers.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-6">No hay papers de hoy clasificados en esta libreta.</p>
        )}
        {visiblePapers.map(({ paper, notebook }) => {
          const isEnglish = langPreference[paper.id] === 'en';
          const isExpanded = expandedId === paper.id;
          const displayTitle = isEnglish ? (paper.titulo_original || paper.titulo) : paper.titulo;
          const saved = isSaved?.(paper.id);
          const showingScript = scriptPaperId === paper.id;

          return (
            <article
              key={paper.id}
              className="rounded-xl border border-white/5 bg-slate-900/60 p-4.5 sm:p-5 transition-all duration-200 hover:border-cyan-500/30 flex flex-col justify-between"
            >
              <div>
                {/* Metadatos y alternador de idioma */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wide truncate">
                      {paper.revista}
                    </span>
                    {notebook && (
                      <span className="text-[9px] font-mono text-slate-400 shrink-0">
                        {notebook.emoji} {notebook.name}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => toggleLanguage(paper.id, e)}
                    title="Alternar entre título en Español y original en Inglés"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border border-white/10 bg-white/5 hover:bg-cyan-500/10 hover:border-cyan-500/30 text-[11px] font-mono text-slate-300 hover:text-cyan-300 transition cursor-pointer shrink-0"
                  >
                    <Languages className="h-3 w-3" />
                    <span>{isEnglish ? 'EN (Original)' : 'ES (Traducido)'}</span>
                  </button>
                </div>

                {/* Título */}
                <h3
                  onClick={() => setSelectedPaper(paper)}
                  className="font-bold text-sm sm:text-base text-white leading-snug mb-2 cursor-pointer hover:text-cyan-300 transition"
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
                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-xs sm:text-sm text-slate-300 leading-relaxed mb-3.5">
                  {paper.resumen}
                </div>

                {/* Recomendación clínica 'Para tu práctica' */}
                <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-3 flex items-start gap-2.5 shadow-sm mb-3">
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
                        <strong className="text-cyan-400 block mb-0.5 font-mono uppercase text-[10px]">
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

                {/* Guion RRSS generado a partir del paper */}
                {showingScript && (
                  <div className="mt-3 p-3 rounded-xl bg-violet-950/30 border border-violet-500/25 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet-300 flex items-center gap-1.5">
                        <Clapperboard className="h-3.5 w-3.5" /> Guion Reel / RRSS
                      </span>
                      <button
                        type="button"
                        onClick={() => copyScript(paper)}
                        className="text-[10px] font-mono text-violet-300 hover:text-white inline-flex items-center gap-1"
                      >
                        {scriptCopied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        {scriptCopied ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                    <pre className="text-[11px] text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">{generateReelScript(paper)}</pre>
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
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition shadow-glow-cyan active:scale-95 cursor-pointer"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span>Leer en Español</span>
                  </button>

                  {/* Botón Guardar en Biblioteca */}
                  <button
                    type="button"
                    onClick={(e) => handleSave(paper, e)}
                    disabled={saved}
                    title="Guardar en Biblioteca (auto-tagging por libreta)"
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                      saved
                        ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300 cursor-default'
                        : 'bg-cyan-950/60 hover:bg-cyan-900/70 border-cyan-500/30 text-cyan-300 active:scale-95'
                    }`}
                  >
                    <BookMarked className="h-3.5 w-3.5" />
                    <span>{saved ? 'Guardado' : 'Guardar'}</span>
                  </button>

                  {/* Botón Expansión rápida dentro de la tarjeta */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(paper.id)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-200 hover:text-white hover:border-cyan-400/40 hover:bg-white/10 text-xs font-medium transition cursor-pointer"
                  >
                    <span>{isExpanded ? 'Menos' : 'Detalles'}</span>
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>

                  {/* Botón Generar guion RRSS */}
                  <button
                    type="button"
                    onClick={() => handleGenerateScript(paper)}
                    title="Generar guion divulgativo a partir de este paper"
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
                      showingScript
                        ? 'bg-violet-500/20 border-violet-500/40 text-violet-200'
                        : 'bg-white/5 border-white/10 text-slate-200 hover:text-white hover:border-violet-400/40'
                    }`}
                  >
                    <Clapperboard className="h-3.5 w-3.5" />
                    <span>Guion RRSS</span>
                  </button>
                </div>

                {/* Botón Fuente original DOI */}
                <a
                  href={paper.doi}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Abrir estudio oficial en la revista científica (DOI)"
                  className="inline-flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-cyan-300 transition p-2 rounded-lg hover:bg-white/5"
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
          <div className="relative w-full max-w-2xl rounded-2xl sm:rounded-3xl border border-cyan-500/30 bg-[#0B1120] p-4 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-y-auto max-h-[85vh] overscroll-contain pb-6">
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
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shrink-0">
                <Stethoscope className="h-4 w-4" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300 truncate">
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
                <h4 className="text-xs font-mono font-bold uppercase text-cyan-400 mb-1.5 flex items-center gap-1.5">
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
              <div className="p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-200/90 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-cyan-300">
                  <Smartphone className="h-3.5 w-3.5 shrink-0" />
                  <span>¿Deseas leer el paper completo original en la revista?</span>
                </div>
                <p className="text-slate-300 pl-5 leading-relaxed">
                  Abre el enlace oficial abajo y usa el traductor nativo de tu teléfono (en iPhone toca <strong>"aA"</strong> en Safari y elige <em>"Traducir al español"</em>; en Android toca los <strong>3 puntos ⋮</strong> en Chrome y elige <em>"Traducir"</em>).
                </p>
              </div>

              {/* Herramientas de transferencia clínica */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
                <h4 className="text-xs font-mono font-bold uppercase text-violet-300 mb-1 flex items-center gap-1.5">
                  <Clapperboard className="h-4 w-4 shrink-0" /> Herramientas de Transferencia
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleSave(selectedPaper, e)}
                    disabled={isSaved?.(selectedPaper.id)}
                    className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-semibold transition cursor-pointer ${
                      isSaved?.(selectedPaper.id)
                        ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300 cursor-default'
                        : 'bg-cyan-950/60 hover:bg-cyan-900/70 border-cyan-500/30 text-cyan-300'
                    }`}
                  >
                    <BookMarked className="h-3.5 w-3.5" />
                    {isSaved?.(selectedPaper.id) ? 'En Biblioteca' : 'Guardar en Biblioteca'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGenerateScript(selectedPaper)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-violet-500/30 bg-violet-950/40 text-violet-300 hover:bg-violet-900/50 text-[11px] font-semibold transition cursor-pointer"
                  >
                    <Clapperboard className="h-3.5 w-3.5" />
                    Generar guion RRSS
                  </button>
                  <a
                    href="https://notebooklm.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Abre la app real de Google NotebookLM en una pestaña nueva"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:border-cyan-400/40 text-[11px] font-medium transition"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Abrir en NotebookLM
                  </a>
                </div>
                {scriptPaperId === selectedPaper.id && (
                  <div className="p-3 rounded-xl bg-violet-950/30 border border-violet-500/25 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet-300">Guion Reel / RRSS</span>
                      <button
                        type="button"
                        onClick={() => copyScript(selectedPaper)}
                        className="text-[10px] font-mono text-violet-300 hover:text-white inline-flex items-center gap-1"
                      >
                        {scriptCopied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        {scriptCopied ? 'Copiado' : 'Copiar'}
                      </button>
                    </div>
                    <pre className="text-[11px] text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">{generateReelScript(selectedPaper)}</pre>
                  </div>
                )}
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
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition shadow-glow-cyan"
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
                  <Languages className="h-4 w-4 text-cyan-400" />
                  <span>Texto en Google Traductor</span>
                </a>
              </div>

              {/* Botón copiar ficha */}
              <button
                type="button"
                onClick={() => handleCopySummary(selectedPaper)}
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs text-slate-300 hover:text-cyan-300 transition cursor-pointer"
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

