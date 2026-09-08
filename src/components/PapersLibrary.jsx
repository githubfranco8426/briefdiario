import React, { useState } from 'react';
import { X, Library, Search, Star, ExternalLink, Trash2, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';

const NOTEBOOK_COLOR_TEXT = { cyan: 'text-cyan-300', teal: 'text-teal-300', violet: 'text-violet-300' };

export function PapersLibrary({ isOpen, onClose, notebooks, savedPapers, removeFromLibrary, toggleFavorite, toggleRead }) {
  const [notebookFilter, setNotebookFilter] = useState('all');
  const [quickFilter, setQuickFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  if (!isOpen) return null;

  const getNotebook = (id) => notebooks.find((n) => n.id === id);

  const filtered = savedPapers.filter((p) => {
    if (notebookFilter !== 'all' && p.notebookId !== notebookFilter) return false;
    if (quickFilter === 'favoritos' && !p.favorite) return false;
    if (quickFilter === 'porLeer' && p.read) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!(p.titulo?.toLowerCase().includes(q) || p.revista?.toLowerCase().includes(q))) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overscroll-contain">
      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-2xl frosted-glass shadow-glass flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-3 border-b border-white/10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
              <Library className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-white font-display">Biblioteca de Papers</h2>
              <p className="text-[11px] text-slate-400">{savedPapers.length} papers guardados localmente</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition shrink-0"
            aria-label="Cerrar biblioteca"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filtros */}
        <div className="px-5 pt-3 pb-2 space-y-2.5 border-b border-white/10">
          <div className="relative">
            <Search className="h-4 w-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título o revista..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/30 border border-white/10 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-500/40"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setNotebookFilter('all')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono whitespace-nowrap transition shrink-0 ${
                notebookFilter === 'all' ? 'bg-cyan-400 text-slate-950 font-bold' : 'frosted-pill text-slate-300'
              }`}
            >
              Todas ({savedPapers.length})
            </button>
            {notebooks.map((nb) => {
              const count = savedPapers.filter((p) => p.notebookId === nb.id).length;
              return (
                <button
                  key={nb.id}
                  type="button"
                  onClick={() => setNotebookFilter(nb.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono whitespace-nowrap transition shrink-0 ${
                    notebookFilter === nb.id ? 'bg-cyan-400 text-slate-950 font-bold' : 'frosted-pill text-slate-300'
                  }`}
                >
                  {nb.emoji} {nb.name} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 text-[10px]">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'favoritos', label: '⭐ Favoritos' },
              { id: 'porLeer', label: 'Por leer' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setQuickFilter(f.id)}
                className={`px-2.5 py-1 rounded-full font-mono transition ${
                  quickFilter === f.id ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista */}
        <div className="overflow-y-auto px-5 py-4 space-y-3 flex-1">
          {filtered.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-10">
              {savedPapers.length === 0
                ? 'Aún no has guardado papers. Usa el botón "Guardar" en PubMed Diario.'
                : 'Ningún paper coincide con este filtro.'}
            </p>
          )}
          {filtered.map((p) => {
            const nb = getNotebook(p.notebookId);
            const isExpanded = expandedId === p.paperId;
            return (
              <article key={p.paperId} className="rounded-xl border border-white/5 bg-slate-900/60 p-3.5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wide truncate">{p.revista}</span>
                      {nb && (
                        <span className={`text-[9px] font-mono ${NOTEBOOK_COLOR_TEXT[nb.color] || 'text-cyan-300'}`}>
                          {nb.emoji} {nb.name}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-white leading-snug mt-1">{p.titulo}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleFavorite(p.paperId)}
                    className={`shrink-0 p-1.5 rounded-lg transition ${p.favorite ? 'text-amber-400' : 'text-slate-500 hover:text-amber-300'}`}
                    aria-label="Favorito"
                  >
                    <Star className="h-4 w-4" fill={p.favorite ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {isExpanded && (
                  <div className="space-y-2 pt-1">
                    {p.resumen && <p className="text-xs text-slate-300 leading-relaxed">{p.resumen}</p>}
                    {p.aplicacion && (
                      <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-lg p-2.5 flex items-start gap-2">
                        <Lightbulb className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-slate-200 leading-relaxed">{p.aplicacion}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setExpandedId((prev) => (prev === p.paperId ? null : p.paperId))}
                      className="text-[10px] font-mono text-slate-300 hover:text-cyan-300 inline-flex items-center gap-1"
                    >
                      {isExpanded ? 'Menos' : 'Ver ficha'}
                      {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleRead(p.paperId)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition ${
                        p.read
                          ? 'border-emerald-500/30 text-emerald-300 bg-emerald-950/40'
                          : 'border-white/10 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {p.read ? 'Leído' : 'Por leer'}
                    </button>
                    {p.doi && (
                      <a
                        href={p.doi}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-mono text-slate-400 hover:text-cyan-300 inline-flex items-center gap-1"
                      >
                        DOI <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromLibrary(p.paperId)}
                    title="Quitar de la biblioteca"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-300 hover:bg-red-500/10 transition shrink-0"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
