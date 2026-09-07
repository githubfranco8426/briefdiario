import React, { useState, useEffect } from 'react';
import { Calendar, Check, Clock, MapPin, CheckCircle2 } from 'lucide-react';

export function AgendaSection({ agendaItems = [] }) {
  const [completedIds, setCompletedIds] = useState(() => {
    try {
      const saved = localStorage.getItem('rehabilita_agenda_completed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('rehabilita_agenda_completed', JSON.stringify(completedIds));
    } catch (e) {
      console.error(e);
    }
  }, [completedIds]);

  const toggleItem = (id) => {
    setCompletedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const completedCount = completedIds.filter((id) =>
    agendaItems.some((item) => item.id === id)
  ).length;

  return (
    <section className="glass-card rounded-2xl border border-white/10 bg-[#0e1320]/70 p-5 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/20 shadow-xl shadow-black/40 relative overflow-hidden flex flex-col h-full">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl"></div>

      <header className="flex justify-between items-center border-b border-white/10 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-400/20">
            <Calendar className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-gray-400 block">
              Google Calendar
            </span>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Agenda & Pendientes
            </h2>
          </div>
        </div>

        <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-medium">
          {completedCount}/{agendaItems.length} listos
        </span>
      </header>

      <div className="flex-1 flex flex-col justify-between">
        <ul className="space-y-3">
          {agendaItems.map((item) => {
            const isCompleted = completedIds.includes(item.id);
            const isDomicilio = item.tipo === 'domicilio';

            return (
              <li key={item.id}>
                <div
                  onClick={() => toggleItem(item.id)}
                  className={`group flex items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isCompleted
                      ? 'border-emerald-500/30 bg-emerald-500/5 opacity-65'
                      : 'border-white/10 bg-white/[0.03] hover:border-cyan-400/30 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-mono text-xs font-bold text-cyan-300 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-cyan-400" />
                        {item.hora}
                      </span>
                      <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${
                          isDomicilio
                            ? 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                            : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                        }`}
                      >
                        {isDomicilio ? 'Domicilio' : 'Clínica'}
                      </span>
                    </div>

                    <h3
                      className={`font-semibold text-sm sm:text-base text-white transition-colors ${
                        isCompleted ? 'line-through text-gray-400' : 'group-hover:text-cyan-200'
                      }`}
                    >
                      {item.titulo}
                    </h3>

                    {item.lugar && (
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 font-light">
                        <MapPin className="h-3 w-3 text-gray-500" />
                        {item.lugar}
                      </p>
                    )}
                  </div>

                  {/* Circular Check Button */}
                  <button
                    type="button"
                    aria-label="Marcar tarea"
                    className={`h-9 w-9 rounded-full shrink-0 flex items-center justify-center border transition-all duration-200 ${
                      isCompleted
                        ? 'border-emerald-400 bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                        : 'border-white/20 text-gray-400 group-hover:border-cyan-400 group-hover:text-cyan-300'
                    }`}
                  >
                    <Check className={`h-4 w-4 ${isCompleted ? 'stroke-[3]' : 'stroke-2'}`} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
          <span className="flex items-center gap-1 text-[11px]">
            <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
            Toca una tarea para marcarla como realizada
          </span>
        </div>
      </div>
    </section>
  );
}
