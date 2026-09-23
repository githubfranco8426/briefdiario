/**
 * Conector de Google Calendar mediante feed iCal (.ics)
 * 
 * Permite sincronizar la agenda real de Google Calendar sin necesidad de OAuth2 complejo:
 * Solo se requiere la "Dirección secreta en formato iCal" disponible en:
 * Configuración de Google Calendar -> Integrar el calendario -> Dirección secreta en formato iCal (.ics)
 */

const PUBLIC_AGENDA_MODE = 'public';

function getPublicAgendaMode() {
  const configuredMode = (process.env.BRIEF_PUBLIC_AGENDA_MODE || PUBLIC_AGENDA_MODE).toLowerCase();
  if (configuredMode !== PUBLIC_AGENDA_MODE) {
    console.warn(`BRIEF_PUBLIC_AGENDA_MODE=${configuredMode} no es válido; se usará agenda pública redactada.`);
  }
  return PUBLIC_AGENDA_MODE;
}

const NEUTRAL_TITLES = {
  clinica: 'Atención clínica',
  domicilio: 'Atención a domicilio',
  personal: 'Compromiso personal',
  disponibilidad: 'Cupo disponible',
  seguimiento: 'Seguimiento profesional',
};

function neutralTitle(tipo) {
  return NEUTRAL_TITLES[tipo] || 'Actividad programada';
}

/**
 * Convierte datos internos ya clasificados a la única forma que puede salir del
 * servidor. Nunca copie UID, SUMMARY, LOCATION ni otros campos de iCal.
 */
function toPublicAgenda(events, dateKey) {
  return [...events]
    .sort((a, b) => a.hora.localeCompare(b.hora, 'es'))
    .map((event, index) => ({
      id: `agenda-${dateKey}-${index + 1}-${event.tipo || 'actividad'}`,
      hora: event.hora,
      tipo: event.tipo || 'clinica',
      lugar: '',
      titulo: neutralTitle(event.tipo),
    }));
}

export async function fetchCalendarEvents(targetDate = new Date(), icsUrl = process.env.GOOGLE_CALENDAR_ICS_URL, cycle = null) {
  const dateStr = targetDate.toISOString().split('T')[0]; // YYYY-MM-DD
  const targetYear = targetDate.getFullYear();
  const targetMonth = String(targetDate.getMonth() + 1).padStart(2, '0');
  const targetDay = String(targetDate.getDate()).padStart(2, '0');
  const compactDateTarget = `${targetYear}${targetMonth}${targetDay}`;

  if (icsUrl) {
    try {
      console.log('📅 Descargando eventos desde Google Calendar (.ics)...');
      const res = await fetch(icsUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status} al descargar el archivo .ics`);
      const icsText = await res.text();

      const events = parseIcs(icsText, compactDateTarget);
      if (events.length > 0) {
        console.log(`✓ ${events.length} eventos recuperados para hoy desde Google Calendar.`);
        return events;
      } else {
        console.log('ℹ️ No hay eventos programados en Google Calendar para hoy.');
      }
    } catch (e) {
      console.warn('Advertencia al sincronizar Google Calendar:', e.message);
    }
  }

  // Agenda adaptada al ciclo de turno si no hay feed .ics activo. El adaptador
  // público se aplica también a estos bloques para conservar un solo contrato.
  getPublicAgendaMode();
  if (cycle?.ciclo?.includes('Turno Largo') || cycle?.ciclo?.includes('UPC')) {
    return toPublicAgenda([
      {
        hora: '08:00 – 14:00',
        tipo: 'clinica',
      },
      {
        hora: '14:30 – 18:30',
        tipo: 'clinica',
      },
      {
        hora: '18:30 – 20:00',
        tipo: 'seguimiento',
      }
    ], dateStr);
  } else if (cycle?.ciclo?.includes('Turno Noche')) {
    return toPublicAgenda([
      {
        hora: '15:00 – 17:00',
        tipo: 'seguimiento',
      },
      {
        hora: '20:00 – 08:00',
        tipo: 'clinica',
      }
    ], dateStr);
  } else if (cycle?.ciclo?.includes('Saliente')) {
    return toPublicAgenda([
      {
        hora: '08:00 – 09:30',
        tipo: 'seguimiento',
      },
      {
        hora: '16:00 – 18:00',
        tipo: 'domicilio',
      }
    ], dateStr);
  }

  // Predeterminado para segundo libre / consultas y domicilios
  return toPublicAgenda([
    {
      hora: '09:00 – 19:00',
      tipo: 'clinica',
    },
    {
      hora: '11:30 – 12:30',
      tipo: 'domicilio',
    },
    {
      hora: '17:00 – 18:00',
      tipo: 'seguimiento',
    }
  ], dateStr);
}

/**
 * Convierte "YYYYMMDD" en un objeto Date (UTC, solo para aritmética de días).
 */
function parseYMD(ymd) {
  return new Date(Date.UTC(Number(ymd.slice(0, 4)), Number(ymd.slice(4, 6)) - 1, Number(ymd.slice(6, 8))));
}

/**
 * Determina si un evento (posiblemente recurrente vía RRULE) ocurre en targetYMD.
 * Soporta FREQ=DAILY y FREQ=WEEKLY con INTERVAL y UNTIL, que es lo que genera
 * Google Calendar para turnos rotativos. No cubre COUNT/BYSETPOS/MONTHLY/YEARLY.
 */
function occursOnDate(dtstartYMD, rrule, targetYMD) {
  if (dtstartYMD === targetYMD) return true;
  if (!rrule) return false;

  const target = parseYMD(targetYMD);
  const start = parseYMD(dtstartYMD);
  if (target < start) return false;

  const parts = Object.fromEntries(rrule.split(';').map((p) => p.split('=')));
  const interval = Number(parts.INTERVAL || 1);

  if (parts.UNTIL) {
    const untilYMD = parts.UNTIL.slice(0, 8);
    if (targetYMD > untilYMD) return false;
  }

  const diffDays = Math.round((target - start) / 86400000);

  if (parts.FREQ === 'DAILY') {
    return diffDays % interval === 0;
  }
  if (parts.FREQ === 'WEEKLY') {
    return diffDays % 7 === 0 && (diffDays / 7) % interval === 0;
  }
  return false;
}

/**
 * Parser ligero de eventos iCal (.ics) para la fecha objetivo (incluye recurrencias simples)
 */
function readProperty(block, field) {
  const match = block.match(new RegExp(`^${field}((?:;[^:]*)?)\\s*:(.*)$`, 'm'));
  if (!match) return { value: '', params: '' };
  return {
    params: match[1] || '',
    value: match[2].replace(/\\n/g, '\n').replace(/\\,/g, ',').trim(),
  };
}

function formatUtcTime(value) {
  const match = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(?:\d{2})?Z$/);
  if (!match) return '';
  const date = new Date(Date.UTC(match[1], Number(match[2]) - 1, match[3], match[4], match[5]));
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago', hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(date);
  const part = (type) => parts.find((item) => item.type === type)?.value || '';
  return `${part('hour')}:${part('minute')}`;
}

function getTime(value) {
  if (!value.includes('T')) return '';
  if (value.endsWith('Z')) return formatUtcTime(value);
  return `${value.slice(9, 11)}:${value.slice(11, 13)}`;
}

function classifyEvent(summary, location) {
  const description = `${summary} ${location}`.toLocaleLowerCase('es-CL');
  if (/\bcupos?\b|disponibili(?:dad|ble)|agenda abierta/.test(description)) return 'disponibilidad';
  if (/domicilio/.test(description)) return 'domicilio';
  if (/piano|peluquer|barber|cumplea|familia|personal/.test(description)) return 'personal';
  return 'clinica';
}

/**
 * Parser ligero de iCal. Respeta actualizaciones de una misma cita, eventos
 * cancelados y horas expresadas en UTC, que Google Calendar convierte a Chile.
 */
export function parseIcs(icsData, targetYMD) {
  getPublicAgendaMode();
  const unfoldedIcs = icsData.replace(/\r?\n[ \t]/g, '');
  const rawEvents = unfoldedIcs.split('BEGIN:VEVENT').slice(1)
    .map((entry) => entry.split('END:VEVENT')[0]);
  const candidates = [];

  for (const block of rawEvents) {
    const start = readProperty(block, 'DTSTART');
    const end = readProperty(block, 'DTEND');
    const recurrenceId = readProperty(block, 'RECURRENCE-ID').value;
    const rrule = readProperty(block, 'RRULE').value;
    const uid = readProperty(block, 'UID').value || `event-${candidates.length + 1}`;
    const dateForOccurrence = (recurrenceId || start.value).slice(0, 8);
    if (!start.value || !occursOnDate(dateForOccurrence, rrule, targetYMD)) continue;

    candidates.push({
      uid,
      recurrenceId,
      sequence: Number(readProperty(block, 'SEQUENCE').value || 0),
      status: readProperty(block, 'STATUS').value.toUpperCase(),
      start: start.value,
      end: end.value,
      summary: readProperty(block, 'SUMMARY').value || 'Compromiso sin título',
      location: readProperty(block, 'LOCATION').value,
    });
  }

  const latestByOccurrence = new Map();
  for (const event of candidates) {
    const key = `${event.uid}:${event.recurrenceId || event.start.slice(0, 8)}`;
    const previous = latestByOccurrence.get(key);
    if (!previous || event.sequence >= previous.sequence) latestByOccurrence.set(key, event);
  }

  const internalEvents = [...latestByOccurrence.values()]
    .filter((event) => event.status !== 'CANCELLED')
    .map((event) => {
      const startTime = getTime(event.start);
      const endTime = getTime(event.end);
      return {
        hora: startTime ? `${startTime}${endTime ? ` – ${endTime}` : ''}` : 'Todo el día',
        tipo: classifyEvent(event.summary, event.location),
      };
    });

  return toPublicAgenda(internalEvents, targetYMD);
}
