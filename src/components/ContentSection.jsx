import React, { useState } from 'react';
import { Instagram, Copy, Check, Sparkles, Video, Layers } from 'lucide-react';

export function ContentSection({ ideas = [] }) {
  const [copiedId, setCopiedId] = useState(null);

  const copyToClipboard = (idea) => {
    const textToCopy = `📌 ${idea.hook}\n\n🎬 Formato: ${idea.formato}\n💡 Idea: ${idea.idea}\n📚 Base: ${idea.base}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(idea.id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  return (
    <section className="glass-card rounded-2xl border border-white/10 bg-[#0e1422]/70 p-5 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:border-sky-500/20 shadow-xl shadow-black/40 relative overflow-hidden flex flex-col h-full">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-teal-500/10 blur-3xl"></div>

      <header className="flex justify-between items-center border-b border-white/10 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 border border-teal-400/20 shadow-[0_0_12px_rgba(20,184,166,0.2)]">
            <Instagram className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-400 block">
              Contenido & RRSS
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Ideas de Guion
            </h2>
          </div>
        </div>

        <span className="text-xs font-mono px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20 font-medium flex items-center gap-1.5">
          <Sparkles className="h-3 w-3" />
          {ideas.length} ideas
        </span>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {ideas.map((item) => {
          const isCopied = copiedId === item.id;
          const isReel = item.formato?.toLowerCase().includes('reel');

          return (
            <article
              key={item.id}
              className="group relative rounded-xl border border-white/10 bg-white/[0.03] p-4.5 flex flex-col justify-between transition-all duration-200 hover:border-sky-400/30 hover:bg-white/[0.06] hover:shadow-lg hover:shadow-sky-500/5"
            >
              <div>
                <div className="flex justify-between items-center mb-2.5">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded border ${
                      isReel
                        ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                        : 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                    }`}
                  >
                    {isReel ? <Video className="h-3 w-3" /> : <Layers className="h-3 w-3" />}
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

                <h3 className="font-bold text-sm text-white leading-snug group-hover:text-sky-200 transition-colors">
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
