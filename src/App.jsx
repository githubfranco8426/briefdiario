import React, { useState } from 'react';
import { initialBriefData } from './data/briefData';
import { historicalBriefs } from './data/history/index';
import { Header } from './components/Header';
import { FilterPills } from './components/FilterPills';
import { AgendaSection } from './components/AgendaSection';
import { ContentSection } from './components/ContentSection';
import { PapersSection } from './components/PapersSection';
import { NewsSection } from './components/NewsSection';
import { Footer } from './components/Footer';
import { MobileConnectModal } from './components/MobileConnectModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { InstallGuideBanner } from './components/InstallGuideBanner';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function App() {
  const [briefData, setBriefData] = useState(initialBriefData);
  const [resetKey, setResetKey] = useState(0);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

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

  const counts = {
    agenda: briefData.agenda?.length || 0,
    ideas: briefData.ideas?.length || 0,
    papers: briefData.papers?.length || 0,
    noticias: briefData.noticias?.length || 0,
  };

  return (
    <main className="min-h-screen bg-[#090d16] text-[#dfe2ef] selection:bg-cyan-500 selection:text-black relative overflow-hidden pb-24 sm:pb-12">
      {/* Ambient Gradient Glows */}
      <div className="pointer-events-none fixed left-1/4 top-0 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[140px]"></div>
      <div className="pointer-events-none fixed bottom-0 right-1/4 h-[450px] w-[450px] rounded-full bg-purple-500/10 blur-[140px]"></div>
      <div className="pointer-events-none fixed top-1/2 right-10 h-80 w-80 rounded-full bg-emerald-500/5 blur-[120px]"></div>

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

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:py-10 sm:px-6 lg:px-8">
        {/* Cabecera principal rediseñada */}
        <Header
          userName={briefData.usuario}
          ciclo={briefData.ciclo}
          cicloDetalle={briefData.ciclo_detalle}
          currentFecha={briefData.fecha}
          onSelectDate={handleSelectDate}
          onOpenMobileModal={() => setShowMobileModal(true)}
        />

        {/* Banner de instalación en pantalla de inicio */}
        <InstallGuideBanner onOpenModal={() => setShowMobileModal(true)} />

        {/* Píldoras de Filtro para orden visual perfecto */}
        <FilterPills
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          counts={counts}
        />

        {/* Bento Grid Adaptativo y Organizado */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Agenda */}
          {(activeFilter === 'all' || activeFilter === 'agenda') && (
            <div
              id="agenda"
              className={activeFilter === 'all' ? 'lg:col-span-5' : 'lg:col-span-12'}
            >
              <AgendaSection
                key={resetKey}
                agendaItems={briefData.agenda}
              />
            </div>
          )}

          {/* Guiones RRSS */}
          {(activeFilter === 'all' || activeFilter === 'guiones') && (
            <div
              id="guiones"
              className={activeFilter === 'all' ? 'lg:col-span-7' : 'lg:col-span-12'}
            >
              <ContentSection
                ideas={briefData.ideas}
              />
            </div>
          )}

          {/* Papers PubMed */}
          {(activeFilter === 'all' || activeFilter === 'papers') && (
            <div
              id="papers"
              className={activeFilter === 'all' ? 'lg:col-span-6' : 'lg:col-span-12'}
            >
              <PapersSection
                papers={briefData.papers}
              />
            </div>
          )}

          {/* Noticias Chile */}
          {(activeFilter === 'all' || activeFilter === 'noticias') && (
            <div
              id="noticias"
              className={activeFilter === 'all' ? 'lg:col-span-6' : 'lg:col-span-12'}
            >
              <NewsSection
                news={briefData.noticias}
              />
            </div>
          )}
        </div>

        {/* Pie de página */}
        <Footer
          briefData={briefData}
          onResetChecklist={handleResetChecklist}
        />
      </div>

      {/* Dock Flotante Móvil (Cápsula de Navegación) */}
      <MobileBottomNav
        activeTab={activeFilter}
        onSelectTab={setActiveFilter}
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
