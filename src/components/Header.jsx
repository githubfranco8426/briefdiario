import React from 'react';
import { useLiveClock } from '../hooks/useLiveClock';
import { HistorySelector } from './HistorySelector';
import { Smartphone, Sparkles } from 'lucide-react';

export function Header({ userName = 'Franco', ciclo, cicloDetalle, currentFecha, onSelectDate, onOpenMobileModal }) {
  const { timeString, formattedDate, greeting } = useLiveClock();

  return (
    <header className="mb-5 sm:mb-8 border-b border-white/10 pb-4 sm:pb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 sm:gap-6">
        {/* Lado izquierdo: Avatar + Saludo + Turno */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="relative shrink-0">
            <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-sky-400 via-teal-500 to-emerald-400 p-[2px] shadow-[0_0_20px_rgba(56,189,248,0.25)]">
              <div className="w-full h-full rounded-2xl bg-[#0b1322] flex items-center justify-center font-black text-lg sm:text-2xl text-transparent bg-clip-text bg-gradient-to-br from-sky-200 via-teal-200 to-emerald-200">
                F
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 sm:ring-4 ring-[#090e18]">
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white animate-pulse"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1 flex-wrap">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest text-sky-300 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                Brief · rehabilita.me
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                {ciclo}
              </span>
            </div>

            <h1 className="text-xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {greeting},{' '}
              <span className="bg-gradient-to-r from-sky-200 via-teal-200 to-emerald-300 bg-clip-text text-transparent">
                {userName}
              </span>
            </h1>

            <p className="text-[11px] sm:text-sm text-slate-400 mt-0.5">
              {formattedDate} {cicloDetalle ? `· ${cicloDetalle}` : ''}
            </p>
          </div>
        </div>

        {/* Lado derecho: Acciones y Reloj */}
        <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
          {/* Botón Abrir en Celular con QR (visible solo en pantallas grandes) */}
          <button
            type="button"
            onClick={onOpenMobileModal}
            className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition shadow-[0_0_15px_rgba(0,240,255,0.15)] active:scale-95 cursor-pointer"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Celular PWA</span>
          </button>

          {/* Selector de Historial */}
          <HistorySelector
            currentFecha={currentFecha}
            onSelectDate={onSelectDate}
          />

          {/* Hora local en vivo */}
          <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md transition shadow-inner flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs sm:text-sm font-mono font-bold tabular-nums text-white">
              {timeString}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
