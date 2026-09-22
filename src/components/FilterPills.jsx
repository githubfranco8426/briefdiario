import React from 'react';

export function FilterPills({ activeFilter, onSelectFilter, counts = {} }) {
  const filters = [
    { id: 'all', label: 'Vista completa' },
    { id: 'agenda', label: 'Agenda', count: counts.agenda },
    { id: 'guiones', label: 'Contenido', count: counts.ideas },
    { id: 'papers', label: 'Evidencia', count: counts.papers },
    { id: 'noticias', label: 'Actualidad', count: counts.noticias },
  ];

  return (
    <nav className="brief-filter-nav" aria-label="Secciones del brief">
      <div className="brief-filter-scroll">
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            aria-current={activeFilter === filter.id ? 'page' : undefined}
            onClick={() => onSelectFilter(filter.id)}
            className={`brief-filter-tab ${activeFilter === filter.id ? 'is-active' : ''}`}
          >
            {filter.label}
            {filter.count !== undefined && <span className="brief-filter-count">{filter.count}</span>}
          </button>
        ))}
      </div>
    </nav>
  );
}
