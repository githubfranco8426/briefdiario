import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchPubMedPapers } from './fetchPubMed.js';
import { fetchChileNews } from './fetchNews.js';
import { synthesizeContent, getDailyVerse } from './synthesizeBrief.js';
import { fetchCalendarEvents } from './fetchCalendar.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function getChileDateString(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Santiago', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date);
  const part = (type) => parts.find((item) => item.type === type)?.value;
  return `${part('year')}-${part('month')}-${part('day')}`;
}

async function main() {
  console.log('🚀 Iniciando pipeline de generación del Brief Diario...');
  const now = new Date();
  const dateIso = getChileDateString(now);

  // 0. Cargar histórico reciente para no repetir los mismos papers día tras día
  const historyDir = path.join(projectRoot, 'src', 'data', 'history');
  const excludeDois = new Set();
  if (fs.existsSync(historyDir)) {
    const recentFiles = fs.readdirSync(historyDir)
      .filter((f) => f.startsWith('brief-') && f.endsWith('.json'))
      .sort()
      .slice(-7);
    for (const file of recentFiles) {
      try {
        const parsed = JSON.parse(fs.readFileSync(path.join(historyDir, file), 'utf-8'));
        (parsed.papers || []).forEach((p) => { if (p.doi) excludeDois.add(p.doi); });
      } catch (e) {
        console.warn(`No se pudo leer histórico ${file}:`, e.message);
      }
    }
  }

  // 1. Obtener papers recientes de PubMed NCBI, evitando repetir los de los últimos 7 días
  console.log('📚 Consultando NCBI PubMed API...');
  const rawPapers = await fetchPubMedPapers(4, excludeDois);
  console.log(`✓ ${rawPapers.length} papers recuperados de PubMed.`);

  // 2. Obtener noticias chilenas en tiempo real
  console.log('🗞️ Consultando noticias de actualidad en Chile...');
  const news = await fetchChileNews(4);
  console.log(`✓ ${news.length} noticias de economía y actualidad recuperadas.`);

  // 3. Sintetizar contenido e ideas de guion
  const { papers, ideas } = await synthesizeContent(rawPapers);

  // 4. Calcular ciclo de turno determinista y agenda de Franco
  // Fecha ancla: Lunes 2026-09-07 fue Día 4 · Segundo libre (índice 3)
  // Martes 2026-09-08 es Día 1 · Turno Largo (índice 0)
  const anchorDate = new Date(2026, 8, 7); // Septiembre es mes 8 (0-indexed)
  const [year, month, day] = dateIso.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.round((targetDate.getTime() - anchorDate.getTime()) / (1000 * 60 * 60 * 24));
  const cycleIndex = ((3 + diffDays) % 4 + 4) % 4;

  const cycleNames = [
    { ciclo: 'Día 1 · Turno Largo', detalle: 'UPC / Hospital 08:00–20:00' },
    { ciclo: 'Día 2 · Turno Noche', detalle: 'Ingreso 20:00 – Guardia nocturna' },
    { ciclo: 'Día 3 · Saliente / Libre', detalle: 'Recuperación y fichas clínicas' },
    { ciclo: 'Día 4 · Segundo libre', detalle: 'Consultas 09:00–19:00' },
  ];
  let currentCycle = cycleNames[cycleIndex];
  console.log(`📅 Ciclo calculado: ${currentCycle.ciclo} (${currentCycle.detalle})`);

  console.log('📅 Consultando Google Calendar / Agenda...');
  const agenda = await fetchCalendarEvents(now, process.env.GOOGLE_CALENDAR_ICS_URL, currentCycle);
  console.log(`✓ ${agenda.length} actividades de agenda preparadas.`);

  // La agenda ya está redactada antes de llegar aquí. No se inspeccionan ni
  // persisten detalles de eventos para decidir el ciclo público.

  const versiculo = getDailyVerse(now, currentCycle);
  console.log(`📖 Versículo asignado: ${versiculo.referencia}`);

  const briefData = {
    fecha: dateIso,
    usuario: 'Franco',
    subtitulo: 'Brief diario · rehabilita.me',
    ciclo: currentCycle.ciclo,
    ciclo_detalle: currentCycle.detalle,
    versiculo,
    agenda,
    ideas: ideas.length > 0 ? ideas : [],
    papers: papers.length > 0 ? papers : [],
    noticias: news.length > 0 ? news : [],
    creado_en: now.toISOString()
  };

  // 5. Guardar en src/data/briefData.js para Vite HMR
  const briefDataJsContent = `export const initialBriefData = ${JSON.stringify(briefData, null, 2)};\n`;
  const briefDataPath = path.join(projectRoot, 'src', 'data', 'briefData.js');
  fs.writeFileSync(briefDataPath, briefDataJsContent, 'utf-8');
  console.log(`✅ Archivo actualizado para frontend: ${briefDataPath}`);

  // 6. Guardar en histórico src/data/history/
  if (!fs.existsSync(historyDir)) {
    fs.mkdirSync(historyDir, { recursive: true });
  }
  const historyFilePath = path.join(historyDir, `brief-${dateIso}.json`);
  fs.writeFileSync(historyFilePath, JSON.stringify(briefData, null, 2), 'utf-8');
  console.log(`📁 Histórico archivado en: ${historyFilePath}`);

  // 7. Actualizar índice de histórico src/data/history/index.js
  const files = fs.readdirSync(historyDir).filter((f) => f.startsWith('brief-') && f.endsWith('.json'));
  const historyMap = {};
  for (const file of files) {
    const fileContent = JSON.parse(fs.readFileSync(path.join(historyDir, file), 'utf-8'));
    historyMap[fileContent.fecha] = fileContent;
  }
  const indexContent = `// Archivo generado automáticamente con el índice histórico de briefs
export const historicalBriefs = ${JSON.stringify(historyMap, null, 2)};
`;
  fs.writeFileSync(path.join(historyDir, 'index.js'), indexContent, 'utf-8');
  console.log(`📑 Índice de histórico actualizado con ${Object.keys(historyMap).length} fechas.`);

  console.log('\n🎉 ¡Brief diario generado con éxito!');
}

main().catch((err) => {
  console.error('❌ Error en la ejecución del pipeline:', err);
  process.exit(1);
});
