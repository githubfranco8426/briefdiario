import React, { useState } from 'react';
import { Calendar, ChevronDown, History, ArrowLeft } from 'lucide-react';
import { historicalBriefs } from '../data/history/index';

export function HistorySelector({ currentFecha, onSelectDate }) {
  const [isOpen, setIsOpen] = useState(false);
  const availableDates = Object.keys(historicalBriefs || {}).sort().reverse();
  const todayIso = new Date().toISOString().split('T')[0];
  const isViewingPast = currentFecha !== todayIso && availableDates[0] !== currentFecha;

  const formatDateLabel = (isoDate) => {
    if (isoDate === todayIso || isoDate === availableDates[0]) {
      return `Hoy (${isoDate})`;
    }
    const [y, m, d] = isoDate.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        {/* Botón selector de historial */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium backdrop-blur-md transition-all ${
            isViewingPast
              ? 'border-amber-400/40 bg-amber-500/15 text-amber-200 hover:bg-amber-500/25'
              : 'border-white/10 bg-white/5 text-gray-300 hover:text-white hover:border-white/25 hover:bg-white/[0.08]'
          }`}
        >
          <History className="h-3.5 w-3.5" />
          <span>{isViewingPast ? `Archivo: ${formatDateLabel(currentFecha)}` : 'Historial de briefs'}</span>
          <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Botón rápido para volver al brief actual */}
        {isViewingPast && (
          <button
            type="button"
            onClick={() => {
              onSelectDate(availableDates[0]);
              setIsOpen(false);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-blue-400/30 bg-blue-500/10 text-xs font-medium text-blue-300 hover:bg-blue-500/20 transition"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Volver a Hoy</span>
          </button>
        )}
      </div>

      {/* Menú desplegable flotante */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 z-50 rounded-2xl border border-white/15 bg-[#0e1422]/95 p-2 shadow-2xl backdrop-blur-xl animate-fade-in">
            <div className="px-3 py-2 border-b border-white/10 mb-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                Briefs Anteriores
              </p>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-1">
              {availableDates.map((date) => {
                const isSelected = date === currentFecha;
                const brief = historicalBriefs[date];
                return (
                  <button
                    key={date}
                    type="button"
                    onClick={() => {
                      onSelectDate(date);
                      setIsOpen(false);
                    }}
                    className={`flex flex-col w-full text-left px-3 py-2 rounded-xl text-xs transition-colors ${
                      isSelected
                        ? 'bg-blue-600/30 text-blue-200 border border-blue-500/40'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="font-semibold">{formatDateLabel(date)}</span>
                    <span className="text-[10px] text-gray-400 truncate mt-0.5">
                      {brief?.ciclo || 'Brief diario'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
