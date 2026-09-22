import React, { useState, useEffect } from 'react';
import { CalendarDays, Check, MapPin } from 'lucide-react';

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
    } catch (error) {
      console.error(error);
    }
  }, [completedIds]);

  const toggleItem = (id) => setCompletedIds((previous) =>
    previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]
  );
  const completedCount = completedIds.filter((id) => agendaItems.some((item) => item.id === id)).length;
  const orderedItems = [...agendaItems].sort((a, b) => (a.hora || '').localeCompare(b.hora || '', 'es'));

  return (
    <section className="brief-agenda brief-panel" aria-labelledby="agenda-title">
      <header className="brief-panel-header">
        <div className="brief-panel-title-group">
          <span className="brief-section-icon"><CalendarDays size={19} strokeWidth={1.8} /></span>
          <div>
            <p className="brief-section-kicker">Tu día · Google Calendar</p>
            <h2 id="agenda-title">Agenda de hoy</h2>
          </div>
        </div>
        <span className="brief-progress">{completedCount} de {agendaItems.length} revisados</span>
      </header>

      {orderedItems.length ? (
        <ul className="brief-agenda-list">
          {orderedItems.map((item) => {
            const isCompleted = completedIds.includes(item.id);
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-pressed={isCompleted}
                  aria-label={`${isCompleted ? 'Quitar revisión de' : 'Marcar como revisado:'} ${item.titulo}`}
                  className={`brief-agenda-item ${isCompleted ? 'is-complete' : ''}`}
                >
                  <span className="brief-agenda-time">{item.hora}</span>
                  <span className="brief-agenda-details">
                    <strong>{item.titulo}</strong>
                    {item.lugar && <span className="brief-agenda-place"><MapPin size={13} aria-hidden="true" /> {item.lugar}</span>}
                  </span>
                  <span className="brief-agenda-check" aria-hidden="true">{isCompleted && <Check size={15} strokeWidth={2.5} />}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : <p className="brief-empty">No hay eventos en la agenda de hoy.</p>}
    </section>
  );
}
