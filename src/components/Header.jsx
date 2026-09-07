import React from 'react';
import { useLiveClock } from '../hooks/useLiveClock';
import { HistorySelector } from './HistorySelector';
import { Smartphone, Sparkles } from 'lucide-react';

export function Header({ userName = 'Franco', ciclo, cicloDetalle, currentFecha, onSelectDate, onOpenMobileModal }) {
  const { timeString, formattedDate, greeting } = useLiveClock();

  return (
    <header className="mb-8 border-b border-white/10 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-6">
        {/* Lado izquierdo: Avatar + Saludo + Turno */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-600 to-purple-600 p-[2px] shadow-[0_0_20px_rgba(0,240,255,0.25)]">
              <div className="w-full h-full rounded-2xl bg-[#0d121f] flex items-center justify-center font-black text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-purple-300">
                F
              </div>
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-[#090d16]">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" />
                Brief diario · rehabilita.me
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {ciclo}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              {greeting},{' '}
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {userName}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
              {formattedDate} {cicloDetalle ? `· ${cicloDetalle}` : ''}
            </p>
          </div>
        </div>

        {/* Lado derecho: Acciones y Reloj */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Botón Abrir en Celular con QR */}
          <button
            type="button"
            onClick={onOpenMobileModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400/50 transition shadow-[0_0_15px_rgba(0,240,255,0.15)] active:scale-95 cursor-pointer"
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
