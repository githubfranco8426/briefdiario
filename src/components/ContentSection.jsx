import React, { useState } from 'react';
import { Instagram, Copy, Check, Sparkles, Video, Layers, GraduationCap, Mic } from 'lucide-react';

function formatStyle(formato = '') {
  const f = formato.toLowerCase();
  if (f.includes('reel')) return { icon: Video, badge: 'bg-violet-950/70 text-violet-300 border-violet-500/30', hover: 'group-hover:text-violet-200' };
  if (f.includes('carrusel')) return { icon: Layers, badge: 'bg-teal-950/70 text-teal-300 border-teal-500/30', hover: 'group-hover:text-teal-200' };
  if (f.includes('docencia') || f.includes('caso clínico')) return { icon: GraduationCap, badge: 'bg-cyan-950/70 text-cyan-300 border-cyan-500/30', hover: 'group-hover:text-cyan-200' };
  if (f.includes('podcast') || f.includes('audio')) return { icon: Mic, badge: 'bg-amber-950/70 text-amber-300 border-amber-500/30', hover: 'group-hover:text-amber-200' };
  return { icon: Layers, badge: 'bg-slate-800/70 text-slate-300 border-slate-600/30', hover: 'group-hover:text-slate-200' };
}

export function ContentSection({ ideas = [] }) {
  const [copiedId, setCopiedId] = useState(null);
  const [formatFilter, setFormatFilter] = useState('all');

  const formats = Array.from(new Set(ideas.map((i) => i.formato).filter(Boolean)));
  const visibleIdeas = formatFilter === 'all' ? ideas : ideas.filter((i) => i.formato === formatFilter);

  const copyToClipboard = (idea) => {
    const textToCopy = `📌 ${idea.hook}\n\n🎬 Formato: ${idea.formato}\n💡 Idea: ${idea.idea}\n📚 Base: ${idea.base}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(idea.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <section className="glass-card shadow-glass rounded-2xl p-5 sm:p-7 transition-all duration-300 hover:border-violet-500/30 relative overflow-hidden flex flex-col h-full">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl"></div>

      <header className="flex justify-between items-center border-b border-white/10 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/30 shadow-inner">
            <Instagram className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 block">
              Contenido & RRSS
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight font-display">
              Ideas de Guion
            </h2>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-violet-950/50 text-violet-400 border border-violet-800/40 font-medium flex items-center gap-1.5">
          <Sparkles className="h-3 w-3" />
          {ideas.length} ideas
        </span>
      </header>

      {/* Filtro de formato */}
      {formats.length > 1 && (
        <div className="mb-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px]">
          <button
            type="button"
            onClick={() => setFormatFilter('all')}
            className={`px-2.5 py-1 rounded-full font-mono whitespace-nowrap transition shrink-0 ${
              formatFilter === 'all' ? 'bg-violet-400 text-slate-950 font-bold' : 'frosted-pill text-slate-300 hover:bg-slate-800/70'
            }`}
          >
            Todos ({ideas.length})
          </button>
          {formats.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFormatFilter(f)}
              className={`px-2.5 py-1 rounded-full font-mono whitespace-nowrap transition shrink-0 ${
                formatFilter === f ? 'bg-violet-400 text-slate-950 font-bold' : 'frosted-pill text-slate-300 hover:bg-slate-800/70'
              }`}
            >
              {f} ({ideas.filter((i) => i.formato === f).length})
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {visibleIdeas.map((item) => {
          const isCopied = copiedId === item.id;
          const { icon: FormatIcon, badge, hover } = formatStyle(item.formato);

          return (
            <article
              key={item.id}
              className="group relative rounded-xl border border-white/5 bg-slate-900/60 p-4.5 flex flex-col justify-between transition-all duration-200 hover:border-violet-500/30"
            >
              <div>
                <div className="flex justify-between items-center mb-2.5">
                  <span className={`inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${badge}`}>
                    <FormatIcon className="h-3 w-3" />
                    {item.formato}
                  </span>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(item)}
                    title="Copiar guion al portapapeles"
                    className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:border-white/25 hover:bg-white/10 transition active:scale-90 cursor-pointer"
                  >
                    {isCopied ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

                <h3 className={`font-bold text-sm text-white leading-snug transition-colors ${hover}`}>
                  "{item.hook}"
                </h3>

                <p className="mt-2 text-xs text-slate-300 leading-relaxed font-light line-clamp-3">
                  {item.idea}
                </p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono truncate max-w-[80%]">
                  {item.base}
                </span>
                {isCopied && (
                  <span className="text-[10px] font-bold text-emerald-400 shrink-0">
                    ¡Copiado!
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
