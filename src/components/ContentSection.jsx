import React, { useState } from 'react';
import { Instagram, Copy, Check, Sparkles } from 'lucide-react';

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
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md lg:p-8 transition-all hover:border-white/15">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-15 blur-2xl"></div>

      <div className="relative mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-md shadow-pink-500/20">
            <Instagram className="h-5 w-5 text-white" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Contenido
            </p>
            <h2 className="text-xl font-black tracking-tighter text-white">
              Ideas de guion
            </h2>
          </div>
        </div>

        <span className="flex items-center gap-1 text-xs font-medium text-purple-300 bg-purple-500/10 border border-purple-400/20 px-3 py-1 rounded-full">
          <Sparkles className="h-3 w-3" />
          {ideas.length} ideas listas
        </span>
      </div>

      <div className="relative">
        <div className="space-y-4">
          {ideas.map((item) => {
            const isCopied = copiedId === item.id;
            return (
              <article
                key={item.id}
                className="group relative rounded-2xl border border-white/10 bg-white/5 p-4 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.07]"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="font-semibold leading-snug text-white pr-2">
                    {item.hook}
                  </h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-[10px] font-bold text-purple-300">
                      {item.formato}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(item)}
                      title="Copiar guion al portapapeles"
                      className="p-1.5 rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:border-white/20 transition"
                    >
                      {isCopied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-sm font-light leading-relaxed text-gray-300">
                  {item.idea}
                </p>

                <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2">
                  <p className="text-xs font-light text-gray-400 truncate max-w-full">
                    {item.base}
                  </p>
                  {isCopied && (
                    <span className="text-[11px] font-medium text-emerald-400 shrink-0 ml-2 animate-fade-in">
                      ¡Copiado!
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
