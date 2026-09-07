import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Check, Plus, MapPin } from 'lucide-react';

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
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md lg:p-8 transition-all hover:border-white/15">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-15 blur-2xl"></div>

      <div className="relative mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-md shadow-purple-500/20">
            <Calendar className="h-5 w-5 text-white" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Google Calendar
            </p>
            <h2 className="text-xl font-black tracking-tighter text-white">
              Pendientes de hoy
            </h2>
          </div>
        </div>

        {agendaItems.length > 0 && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-gray-400">
            {completedCount}/{agendaItems.length} completados
          </span>
        )}
      </div>

      <div className="relative">
        <ul className="space-y-3">
          {agendaItems.map((item) => {
            const isCompleted = completedIds.includes(item.id);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  aria-pressed={isCompleted}
                  onClick={() => toggleItem(item.id)}
                  className={`group flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-200 ${
                    isCompleted
                      ? 'border-emerald-500/30 bg-emerald-500/5 opacity-70'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.08]'
                  }`}
                >
                  {/* Checkbox indicator */}
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                      isCompleted
                        ? 'border-emerald-400 bg-emerald-500 text-white'
                        : 'border-white/30 group-hover:border-white/60'
                    }`}
                  >
                    {isCompleted && <Check className="h-3 w-3 stroke-[3]" />}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2 text-xs font-semibold text-blue-300">
                      <Clock className="h-3.5 w-3.5" />
                      {item.hora}
                      {item.lugar && (
                        <span className="flex items-center gap-1 text-gray-400 font-normal">
                          · <MapPin className="h-3 w-3" /> {item.lugar}
                        </span>
                      )}
                    </span>
                    <span
                      className={`mt-1 block font-semibold text-white transition-all ${
                        isCompleted ? 'line-through text-gray-400' : ''
                      }`}
                    >
                      {item.titulo}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-5 text-xs font-light text-gray-400 flex items-center gap-1.5">
          <span>💡</span> Toca una tarjeta para marcarla como hecha.
        </p>
      </div>
    </section>
  );
}
