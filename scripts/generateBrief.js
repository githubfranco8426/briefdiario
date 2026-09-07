import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { fetchPubMedPapers } from './fetchPubMed.js';
import { fetchChileNews } from './fetchNews.js';
import { synthesizeContent } from './synthesizeBrief.js';
import { fetchCalendarEvents } from './fetchCalendar.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function main() {
  console.log('🚀 Iniciando pipeline de generación del Brief Diario...');
  const now = new Date();
  const dateIso = now.toISOString().split('T')[0];

  // 1. Obtener papers recientes de PubMed NCBI
  console.log('📚 Consultando NCBI PubMed API...');
  const rawPapers = await fetchPubMedPapers(4);
  console.log(`✓ ${rawPapers.length} papers recuperados de PubMed.`);

  // 2. Obtener noticias chilenas en tiempo real
  console.log('🗞️ Consultando noticias de actualidad en Chile...');
  const news = await fetchChileNews(3);
  console.log(`✓ ${news.length} noticias de economía y actualidad recuperadas.`);

  // 3. Sintetizar contenido e ideas de guion
  const { papers, ideas } = await synthesizeContent(rawPapers);

  // 4. Calcular ciclo de turno y agenda de Franco
  // Ejemplo: ciclo rotativo de 4 días (Largo, Noche, Libre 1, Libre 2)
  const dayIndex = Math.floor(now.getTime() / (1000 * 60 * 60 * 24)) % 4;
  const cycleNames = [
    { ciclo: 'Día 1 · Turno Largo', detalle: 'UPC / Hospital 08:00–20:00' },
    { ciclo: 'Día 2 · Turno Noche', detalle: 'Ingreso 20:00 – Guardia nocturna' },
    { ciclo: 'Día 3 · Saliente / Libre', detalle: 'Recuperación y fichas clínicas' },
    { ciclo: 'Día 4 · Segundo libre', detalle: 'Consultas 09:00–19:00' },
  ];
  const currentCycle = cycleNames[dayIndex] || cycleNames[3];

  console.log('📅 Consultando Google Calendar / Agenda...');
  const agenda = await fetchCalendarEvents(now);
  console.log(`✓ ${agenda.length} actividades de agenda preparadas.`);

  const briefData = {
    fecha: dateIso,
    usuario: 'Franco',
    subtitulo: 'Brief diario · rehabilita.me',
    ciclo: currentCycle.ciclo,
    ciclo_detalle: currentCycle.detalle,
    agenda: agenda,
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
  const historyDir = path.join(projectRoot, 'src', 'data', 'history');
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
