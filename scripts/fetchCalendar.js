/**
 * Conector de Google Calendar mediante feed iCal (.ics)
 * 
 * Permite sincronizar la agenda real de Google Calendar sin necesidad de OAuth2 complejo:
 * Solo se requiere la "Dirección secreta en formato iCal" disponible en:
 * Configuración de Google Calendar -> Integrar el calendario -> Dirección secreta en formato iCal (.ics)
 */

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

  // Agenda adaptada al ciclo de turno de Franco si no hay feed .ics activo
  if (cycle?.ciclo?.includes('Turno Largo') || cycle?.ciclo?.includes('UPC')) {
    return [
      {
        id: 'agenda-1',
        hora: '08:00 – 14:00',
        tipo: 'clinica',
        lugar: 'UPC / Unidad de Paciente Crítico',
        titulo: 'Ronda médica matutina y evaluaciones de ingreso kinésico'
      },
      {
        id: 'agenda-2',
        hora: '14:30 – 18:30',
        tipo: 'clinica',
        lugar: 'UCI / Hospital',
        titulo: 'Protocolos de destete ventilatorio y movilización precoz'
      },
      {
        id: 'agenda-3',
        hora: '18:30 – 20:00',
        tipo: 'seguimiento',
        lugar: 'UPC',
        titulo: 'Entrega de turno médico-kinésico y cierre de evoluciones'
      }
    ];
  } else if (cycle?.ciclo?.includes('Turno Noche')) {
    return [
      {
        id: 'agenda-1',
        hora: '15:00 – 17:00',
        tipo: 'seguimiento',
        lugar: 'Domicilio / Fichas',
        titulo: 'Revisión de casos clínicos y preparación de turno'
      },
      {
        id: 'agenda-2',
        hora: '20:00 – 08:00',
        tipo: 'clinica',
        lugar: 'Hospital / UPC',
        titulo: 'Ingreso a guardia nocturna y monitoreo intensivo'
      }
    ];
  } else if (cycle?.ciclo?.includes('Saliente')) {
    return [
      {
        id: 'agenda-1',
        hora: '08:00 – 09:30',
        tipo: 'seguimiento',
        lugar: 'Hospital',
        titulo: 'Entrega de guardia matutina y pase de sala'
      },
      {
        id: 'agenda-2',
        hora: '16:00 – 18:00',
        tipo: 'domicilio',
        lugar: 'Iquique',
        titulo: 'Atención kinesiológica respiratoria a domicilio (post-descanso)'
      }
    ];
  }

  // Predeterminado para segundo libre / consultas y domicilios
  return [
    {
      id: 'agenda-1',
      hora: '09:00 – 19:00',
      tipo: 'clinica',
      lugar: 'Centro de rehabilitación',
      titulo: 'Cupos de consulta (atención presencial)'
    },
    {
      id: 'agenda-2',
      hora: '11:30 – 12:30',
      tipo: 'domicilio',
      lugar: 'Alto Hospicio',
      titulo: 'Atención kinesiológica respiratoria a domicilio'
    },
    {
      id: 'agenda-3',
      hora: '17:00 – 18:00',
      tipo: 'seguimiento',
      lugar: 'Iquique',
      titulo: 'Evaluación y control disfunción ATM / Dolor orofacial'
    }
  ];
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
function parseIcs(icsData, targetYMD) {
  const events = [];
  const rawEvents = icsData.split('BEGIN:VEVENT');

  for (let i = 1; i < rawEvents.length; i++) {
    const block = rawEvents[i].split('END:VEVENT')[0];

    const getField = (field) => {
      const regex = new RegExp(`^${field}(?:;[^:]*)?:(.*)$`, 'm');
      const m = block.match(regex);
      return m ? m[1].replace(/\\n/g, '\n').replace(/\\,/g, ',').trim() : '';
    };

    const summary = getField('SUMMARY') || 'Compromiso sin título';
    const dtstart = getField('DTSTART');
    const dtend = getField('DTEND');
    const location = getField('LOCATION');
    const rrule = getField('RRULE');

    const dtstartYMD = dtstart.slice(0, 8);
    if (!dtstart || !occursOnDate(dtstartYMD, rrule, targetYMD)) continue;

    let hora = 'Todo el día';
    if (dtstart.includes('T')) {
      const startH = dtstart.split('T')[1].slice(0, 2);
      const startM = dtstart.split('T')[1].slice(2, 4);
      let endStr = '';
      if (dtend && dtend.includes('T')) {
        const endH = dtend.split('T')[1].slice(0, 2);
        const endM = dtend.split('T')[1].slice(2, 4);
        endStr = ` – ${endH}:${endM}`;
      }
      hora = `${startH}:${startM}${endStr}`;
    }

    events.push({
      id: `cal-${events.length + 1}`,
      hora,
      tipo: location?.toLowerCase().includes('domicilio') ? 'domicilio' : 'clinica',
      lugar: location || '',
      titulo: summary
    });
  }

  return events;
}
