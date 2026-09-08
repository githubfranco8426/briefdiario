import React, { useState } from 'react';
import { X, Sparkles, Plus, Trash2, Tag } from 'lucide-react';

const COLOR_OPTIONS = ['cyan', 'teal', 'violet'];
const COLOR_DOT = { cyan: 'bg-cyan-400', teal: 'bg-teal-400', violet: 'bg-violet-400' };
const COLOR_RING = { cyan: 'ring-cyan-400', teal: 'ring-teal-400', violet: 'ring-violet-400' };

function NotebookRuleCard({ notebook, onUpdate, onDelete }) {
  const [keywordDraft, setKeywordDraft] = useState('');

  const addKeyword = () => {
    const kw = keywordDraft.trim().toLowerCase();
    if (!kw || notebook.keywords.includes(kw)) return;
    onUpdate({ keywords: [...notebook.keywords, kw] });
    setKeywordDraft('');
  };

  const removeKeyword = (kw) => {
    onUpdate({ keywords: notebook.keywords.filter((k) => k !== kw) });
  };

  return (
    <div className="bg-slate-900/60 border border-white/5 rounded-xl p-3.5 space-y-2.5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${COLOR_DOT[notebook.color] || COLOR_DOT.cyan}`}></span>
          <input
            type="text"
            value={notebook.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="bg-transparent text-sm font-semibold text-white outline-none border-b border-transparent focus:border-white/20 min-w-0 flex-1"
          />
        </div>
        <button
          type="button"
          onClick={onDelete}
          title="Eliminar libreta"
          className="p-1.5 rounded-lg text-slate-500 hover:text-red-300 hover:bg-red-500/10 transition shrink-0"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        {COLOR_OPTIONS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onUpdate({ color: c })}
            className={`w-5 h-5 rounded-full ${COLOR_DOT[c]} ${notebook.color === c ? `ring-2 ring-offset-2 ring-offset-slate-900 ${COLOR_RING[c]}` : 'opacity-50'}`}
            aria-label={`Color ${c}`}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {notebook.keywords.map((kw) => (
          <button
            key={kw}
            type="button"
            onClick={() => removeKeyword(kw)}
            title="Quitar palabra clave"
            className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300 hover:text-red-300 hover:border-red-400/30 transition"
          >
            {kw} ✕
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        <input
          type="text"
          value={keywordDraft}
          onChange={(e) => setKeywordDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
          placeholder="Añadir palabra clave..."
          className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-black/30 border border-white/10 text-[11px] text-slate-200 placeholder:text-slate-500 outline-none focus:border-cyan-500/40"
        />
        <button
          type="button"
          onClick={addKeyword}
          className="px-2.5 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono hover:bg-cyan-900/60 transition shrink-0"
        >
          <Tag className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

export function NotebookLMSettingsModal({ isOpen, onClose, notebooks, updateNotebook, addNotebook, deleteNotebook }) {
  if (!isOpen) return null;

  const handleAddNotebook = () => {
    addNotebook({
      id: `custom-${Date.now()}`,
      emoji: '📁',
      name: 'Nueva libreta',
      color: 'cyan',
      priority: 'Personalizada',
      autoAudio: false,
      keywords: [],
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md animate-fade-in overscroll-contain">
      <div className="relative w-full sm:max-w-lg max-h-[90vh] sm:rounded-2xl rounded-t-[2rem] frosted-glass shadow-glass flex flex-col overflow-hidden">
        {/* Drag handle móvil */}
        <div className="sm:hidden w-full flex items-center justify-center pt-2.5 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20"></div>
        </div>

        {/* Header */}
        <div className="px-5 pt-3 pb-3.5 flex items-start justify-between gap-3 border-b border-white/10">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-white font-display">NotebookLM & Auto-Tagging</h2>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Función local del brief: clasifica papers por libreta según palabras clave. No requiere ni modifica tu cuenta real de Google.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition shrink-0"
            aria-label="Cerrar configuración"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenido scrollable */}
        <div className="overflow-y-auto px-5 py-4 space-y-3 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">Reglas de Clasificación</h3>
            <button
              type="button"
              onClick={handleAddNotebook}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-300 bg-cyan-950/50 hover:bg-cyan-900/50 border border-cyan-500/30 px-2.5 py-1 rounded-full transition"
            >
              <Plus className="h-3.5 w-3.5" /> Nueva libreta
            </button>
          </div>

          {notebooks.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-6">No hay libretas configuradas. Crea una para empezar a auto-clasificar papers.</p>
          )}

          {notebooks.map((nb) => (
            <NotebookRuleCard
              key={nb.id}
              notebook={nb}
              onUpdate={(patch) => updateNotebook(nb.id, patch)}
              onDelete={() => deleteNotebook(nb.id)}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-bold text-sm shadow-glow-cyan active:scale-[0.99] transition"
          >
            Guardar y cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
