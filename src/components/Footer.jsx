import React, { useState } from 'react';
import { Share2, Check, RefreshCw } from 'lucide-react';

export function Footer({ briefData, onResetChecklist }) {
  const [copiedShare, setCopiedShare] = useState(false);

  const copyDailyBriefShare = async () => {
    let text = `📋 *Brief Diario · rehabilita.me*\n📅 ${briefData.fecha} | ${briefData.ciclo}\n\n`;
    if (briefData.versiculo) {
      text += `📖 *Versículo del Día:*\n"${briefData.versiculo.texto}" (${briefData.versiculo.referencia})\n\n`;
    }
    text += `⏰ *Agenda:*\n` + briefData.agenda.map((a) => `• ${a.hora}: ${a.titulo}`).join('\n') + `\n\n`;
    text += `💡 *Idea Destacada:*\n"${briefData.ideas[0]?.hook}" (${briefData.ideas[0]?.formato})\n\n`;
    text += `🔬 *Paper Destacado:*\n${briefData.papers[0]?.titulo}\n\n`;
    text += `🗞️ *Noticia Clave:*\n${briefData.noticias[0]?.titulo}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Brief Diario · rehabilita.me',
          text: text,
        });
        return;
      } catch (err) {
        // Fallback a portapapeles si el usuario cancela o hay error
      }
    }

    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  return (
    <footer className="mt-14 border-t border-white/5 pt-8 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-xs font-light text-gray-500">
        {briefData?.creado_en
          ? `Generado y sincronizado el ${new Date(briefData.creado_en).toLocaleDateString('es-CL')} a las ${new Date(briefData.creado_en).toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}.`
          : 'Generado automáticamente cada mañana a las 06:30.'}
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={copyDailyBriefShare}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-gray-300 hover:text-white hover:border-white/25 transition"
        >
          {copiedShare ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span>¡Copiado para WhatsApp!</span>
            </>
          ) : (
            <>
              <Share2 className="h-3.5 w-3.5" />
              <span>Copiar resumen rápido</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onResetChecklist}
          title="Reiniciar lista de tareas"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-gray-400 hover:text-gray-200 hover:border-white/20 transition"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Reiniciar checklist</span>
        </button>
      </div>
    </footer>
  );
}
