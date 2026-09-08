import React, { useState } from 'react';
import { BookOpen, Sparkles, Copy, Check, RefreshCw, Heart, Quote } from 'lucide-react';

const VERSICULOS_DEFAULT = [
  {
    id: 'verse-1',
    texto: 'Pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas; correrán, y no se cansarán; caminarán, y no se fatigarán.',
    referencia: 'Isaías 40:31',
    reflexion: 'Tu labor en rehabilitación exige paciencia y energía; recuerda que la renovación física y espiritual se recibe paso a paso cada mañana.'
  },
  {
    id: 'verse-2',
    texto: 'Todo lo puedo en Cristo que me fortalece.',
    referencia: 'Filipenses 4:13',
    reflexion: 'Para enfrentar los casos más desafiantes hoy en la clínica o a domicilio: cuentas con respaldo y serenidad inquebrantable.'
  },
  {
    id: 'verse-3',
    texto: 'Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas.',
    referencia: 'Josué 1:9',
    reflexion: 'Firmeza y convicción en tus decisiones terapéuticas y en el acompañamiento a cada paciente.'
  },
  {
    id: 'verse-4',
    texto: 'Alzaré mis ojos a los montes; ¿de dónde vendrá mi socorro? Mi socorro viene de Jehová, que hizo los cielos y la tierra.',
    referencia: 'Salmos 121:1-2',
    reflexion: 'En medio de una jornada intensa, eleva la mirada: el propósito de sanar y servir trasciende cada rutina.'
  }
];

export function DailyVerseCard({ verseData }) {
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentVerse = verseData || VERSICULOS_DEFAULT[index];

  const nextVerse = () => {
    setIndex((prev) => (prev + 1) % VERSICULOS_DEFAULT.length);
  };

  const copyVerse = () => {
    const textToCopy = `📖 "${currentVerse.texto}"\n— ${currentVerse.referencia}\n\n🕊️ ${currentVerse.reflexion}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className="relative mb-8 overflow-hidden rounded-2xl border border-slate-700/40 bg-gradient-to-br from-[#0f172a]/90 via-[#131d2e]/85 to-[#0b121e]/90 p-5 sm:p-6 backdrop-blur-2xl shadow-[0_15px_35px_rgba(0,0,0,0.5)] transition-all duration-300 hover:border-sky-500/30">
      {/* Resplandor nórdico sutil (Aurora Boreal ártica / Sage pine) */}
      <div className="pointer-events-none absolute -top-12 -left-12 h-36 w-36 rounded-full bg-emerald-500/10 blur-3xl"></div>
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-sky-500/10 blur-3xl"></div>

      <div className="relative z-10 flex flex-col justify-between gap-4">
        {/* Cabecera del Versículo */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-300 border border-sky-400/20 shadow-sm">
              <BookOpen className="h-4 w-4" />
            </span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-300">
                Versículo del Día
              </span>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[10px] font-semibold text-emerald-300 flex items-center gap-1">
                <Heart className="h-2.5 w-2.5 fill-emerald-400/30" /> Fortaleza & Propósito
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={nextVerse}
              title="Cambiar versículo"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 text-[11px] font-mono text-gray-300 hover:text-sky-300 hover:bg-white/10 transition cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Rotar</span>
            </button>

            <button
              type="button"
              onClick={copyVerse}
              title="Copiar versículo"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 text-[11px] font-mono text-gray-300 hover:text-emerald-300 hover:bg-white/10 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-300">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Cita Bíblica */}
        <div className="flex items-start gap-3 my-1">
          <Quote className="h-6 w-6 text-sky-400/40 shrink-0 rotate-180 mt-1 hidden sm:block" />
          <div>
            <blockquote className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed italic tracking-wide">
              "{currentVerse.texto}"
            </blockquote>
            <p className="mt-2 text-xs font-mono font-bold text-sky-300 tracking-wider">
              — {currentVerse.referencia}
            </p>
          </div>
        </div>

        {/* Reflexión para la Jornada Clínica */}
        {currentVerse.reflexion && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-2.5 flex items-center gap-2.5 text-xs text-emerald-200/90 font-light">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <p className="leading-snug">
              <strong className="font-semibold text-emerald-300">Para tu día:</strong> {currentVerse.reflexion}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}
