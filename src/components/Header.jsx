import React from 'react';
import { useLiveClock } from '../hooks/useLiveClock';
import { HistorySelector } from './HistorySelector';
import { Smartphone } from 'lucide-react';

export function Header({ userName = 'Franco', ciclo, cicloDetalle, currentFecha, onSelectDate, onOpenMobileModal }) {
  const { timeString, formattedDate, greeting } = useLiveClock();

  return (
    <header className="mb-12 border-b border-white/5 pb-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="h-2 w-2 rounded-full bg-blue-400 live-indicator"></span>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Brief diario · rehabilita.me
            </p>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ● Live PubMed & Noticias
            </span>
          </div>
          <h1 className="text-4xl font-black leading-[1.05] tracking-tighter md:text-6xl text-white">
            {greeting},{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 bg-clip-text text-transparent">
              {userName}
            </span>
          </h1>
          <p className="mt-3 font-light text-gray-400">
            {formattedDate}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Botón Abrir en Celular */}
          <button
            type="button"
            onClick={onOpenMobileModal}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full border border-purple-400/30 bg-purple-500/15 text-xs font-medium text-purple-200 hover:bg-purple-500/25 hover:border-purple-400/50 transition backdrop-blur-md shadow-sm"
          >
            <Smartphone className="h-3.5 w-3.5 text-purple-300" />
            <span className="hidden sm:inline">Abrir en Celular</span>
            <span className="sm:hidden">Celular</span>
          </button>

          {/* Selector de Historial */}
          <HistorySelector
            currentFecha={currentFecha}
            onSelectDate={onSelectDate}
          />

          {/* Hora local en vivo */}
          <div className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 backdrop-blur-md transition hover:border-white/20 shadow-inner">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-medium">Hora local</p>
            <p className="text-lg font-bold tabular-nums text-white flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {timeString}
            </p>
          </div>

          {/* Turno */}
          <div className="rounded-full border border-white/10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 px-5 py-2.5 backdrop-blur-md shadow-lg shadow-purple-500/5 transition hover:border-white/25">
            <p className="text-[10px] uppercase tracking-widest text-gray-300 font-medium">Turno</p>
            <p className="text-lg font-bold text-white">{ciclo}</p>
          </div>
        </div>
      </div>

      {cicloDetalle && (
        <p className="mt-4 text-sm font-light text-gray-400">
          {cicloDetalle}
        </p>
      )}
    </header>
  );
}
