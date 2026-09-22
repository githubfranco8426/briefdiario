import React from 'react';
import { useLiveClock } from '../hooks/useLiveClock';
import { HistorySelector } from './HistorySelector';
import { Smartphone, ArrowUpRight } from 'lucide-react';

export function Header({ userName = 'Franco', ciclo, cicloDetalle, currentFecha, onSelectDate, onOpenMobileModal }) {
  const { timeString, formattedDate, greeting } = useLiveClock();

  return (
    <header className="brief-hero">
      <div className="brief-hero-top">
        <span className="brief-brand-mark" aria-hidden="true">r.</span>
        <span className="brief-brand-name">rehabilita.me <span>/ brief diario</span></span>
        <span className="brief-local-time" aria-label={`Hora local: ${timeString}`}>
          <span className="brief-live-dot" /> {timeString}
        </span>
      </div>

      <div className="brief-hero-copy">
        <p className="brief-eyebrow">{formattedDate}</p>
        <h1>{greeting}, <span>{userName}.</span></h1>
        <p className="brief-hero-description">
          {cicloDetalle || 'Una vista clara de lo que importa hoy.'}
        </p>
      </div>

      <div className="brief-hero-bottom">
        {ciclo && <span className="brief-shift-label">{ciclo}</span>}
        <div className="brief-hero-actions">
          <HistorySelector currentFecha={currentFecha} onSelectDate={onSelectDate} />
          <button type="button" onClick={onOpenMobileModal} className="brief-mobile-link">
            <Smartphone size={15} aria-hidden="true" /> Abrir en celular <ArrowUpRight size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
