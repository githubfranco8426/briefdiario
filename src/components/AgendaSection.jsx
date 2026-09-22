import React, { useState, useEffect } from 'react';
import { CalendarDays, Check, Clock3, MapPin, Sparkles } from 'lucide-react';

const TYPE_LABELS = {
  disponibilidad: 'Cupos disponibles',
  clinica: 'Atención',
  domicilio: 'Domicilio',
  personal: 'Personal',
};

export function AgendaSection({ agendaItems = [], updatedAt }) {
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
  const commitments = orderedItems.filter((item) => item.tipo !== 'disponibilidad');
  const availability = orderedItems.filter((item) => item.tipo === 'disponibilidad');
  const formattedUpdate = updatedAt ? new Intl.DateTimeFormat('es-CL', {
    hour: '2-digit', minute: '2-digit', timeZone: 'America/Santiago',
  }).format(new Date(updatedAt)) : null;

  const renderItem = (item) => {
    const isCompleted = completedIds.includes(item.id);
    return (
      <li key={item.id}>
        <button
          type="button"
          onClick={() => toggleItem(item.id)}
          aria-pressed={isCompleted}
          aria-label={`${isCompleted ? 'Quitar revisión de' : 'Marcar como revisado:'} ${item.titulo}`}
          className={`brief-agenda-item brief-agenda-item--${item.tipo || 'clinica'} ${isCompleted ? 'is-complete' : ''}`}
        >
          <span className="brief-agenda-time"><Clock3 size={13} aria-hidden="true" /> {item.hora}</span>
          <span className="brief-agenda-details">
            <span className="brief-agenda-type">{TYPE_LABELS[item.tipo] || 'Agenda'}</span>
            <strong>{item.titulo}</strong>
            {item.lugar && <span className="brief-agenda-place"><MapPin size={13} aria-hidden="true" /> {item.lugar}</span>}
          </span>
          <span className="brief-agenda-check" aria-hidden="true">{isCompleted && <Check size={15} strokeWidth={2.5} />}</span>
        </button>
      </li>
    );
  };

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

      {formattedUpdate && <p className="brief-agenda-sync"><Sparkles size={13} aria-hidden="true" /> Agenda sincronizada a las {formattedUpdate} h</p>}

      {orderedItems.length ? (
        <div className="brief-agenda-groups">
          {commitments.length > 0 && <ul className="brief-agenda-list">{commitments.map(renderItem)}</ul>}
          {availability.length > 0 && (
            <div className="brief-agenda-availability">
              <p><Sparkles size={14} aria-hidden="true" /> Espacios que aún puedes usar</p>
              <ul className="brief-agenda-list">{availability.map(renderItem)}</ul>
            </div>
          )}
        </div>
      ) : <p className="brief-empty">No hay eventos en la agenda de hoy.</p>}
    </section>
  );
}
