import React, { useState } from 'react';
import { initialBriefData } from './data/briefData';
import { historicalBriefs } from './data/history/index';
import { Header } from './components/Header';
import { AgendaSection } from './components/AgendaSection';
import { ContentSection } from './components/ContentSection';
import { PapersSection } from './components/PapersSection';
import { NewsSection } from './components/NewsSection';
import { Footer } from './components/Footer';
import { MobileConnectModal } from './components/MobileConnectModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function App() {
  const [briefData, setBriefData] = useState(initialBriefData);
  const [resetKey, setResetKey] = useState(0);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState('agenda');

  const handleSelectDate = (date) => {
    if (historicalBriefs && historicalBriefs[date]) {
      setBriefData(historicalBriefs[date]);
      setResetKey((prev) => prev + 1);
    }
  };

  const handleResetChecklist = () => {
    localStorage.removeItem('rehabilita_agenda_completed');
    setResetKey((prev) => prev + 1);
  };

  const isViewingArchive = briefData.fecha !== initialBriefData.fecha;

  return (
    <main className="min-h-screen bg-[#090d16] text-white selection:bg-purple-500 selection:text-white relative overflow-hidden pb-20 sm:pb-8">
      {/* Glow Blur Orbs */}
      <div className="pointer-events-none fixed left-1/4 top-0 h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]"></div>
      <div className="pointer-events-none fixed bottom-0 right-1/4 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]"></div>
      <div className="pointer-events-none fixed top-1/2 right-10 h-72 w-72 rounded-full bg-cyan-500/5 blur-[100px]"></div>

      {/* Banner de archivo si está viendo una fecha pasada */}
      {isViewingArchive && (
        <div className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2.5 text-center text-xs text-amber-200 flex items-center justify-center gap-2 backdrop-blur-md sticky top-0 z-30">
          <AlertCircle className="h-4 w-4 text-amber-400" />
          <span>
            Estás visualizando el brief histórico archivado del <strong>{briefData.fecha}</strong>.
          </span>
          <button
            type="button"
            onClick={() => handleSelectDate(initialBriefData.fecha)}
            className="ml-3 underline hover:text-white inline-flex items-center gap-1 font-semibold cursor-pointer"
          >
            <ArrowLeft className="h-3 w-3" /> Volver al brief de hoy
          </button>
        </div>
      )}

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8">
        {/* Cabecera principal */}
        <Header
          userName={briefData.usuario}
          ciclo={briefData.ciclo}
          cicloDetalle={briefData.ciclo_detalle}
          currentFecha={briefData.fecha}
          onSelectDate={handleSelectDate}
          onOpenMobileModal={() => setShowMobileModal(true)}
        />

        {/* Bento Grid 2x2 con anclas para navegación móvil fluida */}
        <div className="grid gap-8 lg:grid-cols-2">
          <div id="agenda" className="scroll-mt-20">
            <AgendaSection
              key={resetKey}
              agendaItems={briefData.agenda}
            />
          </div>

          <div id="guiones" className="scroll-mt-20">
            <ContentSection
              ideas={briefData.ideas}
            />
          </div>

          <div id="papers" className="scroll-mt-20">
            <PapersSection
              papers={briefData.papers}
            />
          </div>

          <div id="noticias" className="scroll-mt-20">
            <NewsSection
              news={briefData.noticias}
            />
          </div>
        </div>

        {/* Pie de página */}
        <Footer
          briefData={briefData}
          onResetChecklist={handleResetChecklist}
        />
      </div>

      {/* Navegación inferior flotante para pantallas móviles */}
      <MobileBottomNav
        activeTab={activeMobileTab}
        onSelectTab={setActiveMobileTab}
        onOpenConnect={() => setShowMobileModal(true)}
      />

      {/* Modal de Conexión a Celular con Código QR */}
      <MobileConnectModal
        isOpen={showMobileModal}
        onClose={() => setShowMobileModal(false)}
      />
    </main>
  );
}
