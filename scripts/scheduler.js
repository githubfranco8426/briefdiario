/**
 * Programador Autónomo del Brief Diario (Scheduler a las 06:30 AM)
 * 
 * Se ejecuta en segundo plano o como servicio:
 * 1. Calcula el tiempo exacto hasta las 06:30 AM del día siguiente.
 * 2. Al llegar la hora, dispara generateBrief.js.
 * 3. Se vuelve a programar para el día siguiente de forma perpetua.
 */

import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const TARGET_HOUR = 6;
const TARGET_MINUTE = 30;

function runBriefPipeline() {
  console.log(`\n🔔 [${new Date().toLocaleTimeString('es-CL')}] Ejecutando generación automática del Brief Diario...`);
  const scriptPath = path.join(projectRoot, 'scripts', 'generateBrief.js');

  exec(`node "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Error al ejecutar generateBrief:', error.message);
      return;
    }
    if (stderr) console.error(stderr);
    console.log(stdout);
    console.log('✅ Brief generado exitosamente por el scheduler.');

    // Programar la siguiente ejecución
    scheduleNextRun();
  });
}

function scheduleNextRun() {
  const now = new Date();
  const nextRun = new Date(now);

  nextRun.setHours(TARGET_HOUR, TARGET_MINUTE, 0, 0);

  // Si ya pasaron las 06:30 AM de hoy, programar para mañana a las 06:30 AM
  if (now.getTime() >= nextRun.getTime()) {
    nextRun.setDate(nextRun.getDate() + 1);
  }

  const msUntilNextRun = nextRun.getTime() - now.getTime();
  const hours = Math.floor(msUntilNextRun / (1000 * 60 * 60));
  const minutes = Math.floor((msUntilNextRun % (1000 * 60 * 60)) / (1000 * 60));

  console.log(`\n⏰ Próxima ejecución programada para: ${nextRun.toLocaleDateString('es-CL')} a las ${nextRun.toLocaleTimeString('es-CL')}`);
  console.log(`⏳ Tiempo restante: ${hours} horas y ${minutes} minutos.`);

  setTimeout(runBriefPipeline, msUntilNextRun);
}

// Soporte para ejecución inmediata si se pasa el flag --now
if (process.argv.includes('--now')) {
  console.log('⚡ Flag --now detectado: ejecutando pipeline de inmediato antes de iniciar el scheduler...');
  runBriefPipeline();
} else {
  console.log('🌟 Scheduler de Brief Diario iniciado.');
  scheduleNextRun();
}
