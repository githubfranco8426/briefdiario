import { initialBriefData } from '../data/briefData';
import { historicalBriefs } from '../data/history/index';

/**
 * Servicio de sincronización del Brief Diario
 * 
 * Estrategia de actualización en 3 capas:
 * 1. Supabase Live REST (si VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY están configuradas).
 * 2. Datos locales precompilados (initialBriefData / history).
 * 3. Cálculo dinámico reactivo en cliente si la fecha actual es posterior al último build.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fecha ancla calibrada: Lunes 2026-09-07 fue Día 4 · Segundo libre (índice 3)
const ANCHOR_DATE = new Date(2026, 8, 7);
const CYCLE_NAMES = [
  { ciclo: 'Día 1 · Turno Largo', detalle: 'UPC / Hospital 08:00–20:00' },
  { ciclo: 'Día 2 · Turno Noche', detalle: 'Ingreso 20:00 – Guardia nocturna' },
  { ciclo: 'Día 3 · Saliente / Libre', detalle: 'Recuperación y fichas clínicas' },
  { ciclo: 'Día 4 · Segundo libre', detalle: 'Consultas 09:00–19:00' },
];

export function getShiftCycleForDate(targetDate = new Date()) {
  const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  const diffDays = Math.round((target.getTime() - ANCHOR_DATE.getTime()) / (1000 * 60 * 60 * 24));
  const cycleIndex = ((3 + diffDays) % 4 + 4) % 4;
  return CYCLE_NAMES[cycleIndex];
}

export function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Obtiene el brief del día actual priorizando Supabase en vivo y cayendo en fallback local
 */
export async function fetchLiveBrief(dateString = getTodayDateString()) {
  // 1. Intentar consultar Supabase REST si hay credenciales
  if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    try {
      const endpoint = `${SUPABASE_URL}/rest/v1/brief_diario?fecha=eq.${dateString}&select=*`;
      const res = await fetch(endpoint, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Accept: 'application/json',
        },
      });

      if (res.ok) {
        const rows = await res.json();
        if (rows && rows.length > 0) {
          console.log(`[briefService] Brief de ${dateString} obtenido en vivo desde Supabase.`);
          return { ...rows[0], _source: 'supabase' };
        }
      }
    } catch (err) {
      console.warn('[briefService] Error al conectar con Supabase en vivo:', err.message);
    }
  }

  // 2. Si la fecha solicitada coincide con el brief inicial local
  if (initialBriefData.fecha === dateString) {
    return { ...initialBriefData, _source: 'local_current' };
  }

  // 3. Si la fecha existe en el archivo histórico
  if (historicalBriefs && historicalBriefs[dateString]) {
    return { ...historicalBriefs[dateString], _source: 'history' };
  }

  // 4. Fallback reactivo si es una nueva fecha aún no generada por el pipeline
  const currentCycle = getShiftCycleForDate(new Date());
  return {
    ...initialBriefData,
    fecha: dateString,
    ciclo: currentCycle.ciclo,
    ciclo_detalle: currentCycle.detalle,
    _source: 'dynamic_fallback'
  };
}
