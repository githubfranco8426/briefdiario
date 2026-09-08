import React, { useState, useEffect } from 'react';
import { initialBriefData } from './data/briefData';
import { historicalBriefs } from './data/history/index';
import { fetchLiveBrief, getTodayDateString } from './services/briefService';
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
import { DailyVerseCard } from './components/DailyVerseCard';
import { NotebookLMSettingsModal } from './components/NotebookLMSettingsModal';
import { PapersLibrary } from './components/PapersLibrary';
import { useLibrary } from './hooks/useLibrary';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function App() {
  const [briefData, setBriefData] = useState(initialBriefData);
  const [resetKey, setResetKey] = useState(0);
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [showNotebookSettings, setShowNotebookSettings] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const library = useLibrary();

  // Sincronización en vivo al montar el componente (Supabase o cálculo dinámico)
  useEffect(() => {
    let isMounted = true;
    fetchLiveBrief().then((liveData) => {
      if (isMounted && liveData && liveData.fecha) {
        setBriefData(liveData);
      }
    }).catch((err) => {
      console.warn('[App] Error al obtener brief en vivo:', err);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectDate = (date) => {
    if (historicalBriefs && historicalBriefs[date]) {
      setBriefData(historicalBriefs[date]);
      setResetKey((prev) => prev + 1);
    } else if (date === initialBriefData.fecha) {
      setBriefData(initialBriefData);
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

  const handleSelectFilter = (filter) => {
    setActiveFilter(filter);
    // En móviles, si selecciona una pestaña específica, desplazarse suavemente al contenido
    setTimeout(() => {
      if (filter !== 'all') {
        const el = document.getElementById(filter);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <main className="radial-bg min-h-screen text-[#e2e8f0] selection:bg-cyan-500 selection:text-black relative overflow-x-hidden pb-28 sm:pb-16 pt-safe">
      {/* Ambient glows extra (el degradado radial base ya vive en .radial-bg) */}
      <div className="pointer-events-none fixed top-1/2 right-10 h-80 w-80 rounded-full bg-violet-500/[0.05] blur-[130px]"></div>

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

      <div className="relative mx-auto max-w-7xl px-3.5 py-4 sm:py-10 sm:px-6 lg:px-8">
        {/* Cabecera principal rediseñada */}
        <Header
          userName={briefData.usuario}
          ciclo={briefData.ciclo}
          cicloDetalle={briefData.ciclo_detalle}
          currentFecha={briefData.fecha}
          onSelectDate={handleSelectDate}
          onOpenMobileModal={() => setShowMobileModal(true)}
        />

        {/* Versículo Bíblico del Día (Estilo Nórdico) */}
        <DailyVerseCard verseData={briefData.versiculo} />

        {/* Banner de instalación en pantalla de inicio */}
        <InstallGuideBanner onOpenModal={() => setShowMobileModal(true)} />

        {/* Píldoras de Filtro para orden visual perfecto */}
        <FilterPills
          activeFilter={activeFilter}
          onSelectFilter={handleSelectFilter}
          counts={counts}
        />

        {/* Indicador de sección activa en móviles */}
        {activeFilter !== 'all' && (
          <div className="mb-5 sm:hidden flex items-center justify-between bg-cyan-500/10 border border-cyan-500/25 px-4 py-2 rounded-xl text-xs text-cyan-200">
            <span className="font-semibold">
              Mostrando: <strong className="text-white capitalize">{activeFilter}</strong>
            </span>
            <button
              type="button"
              onClick={() => handleSelectFilter('all')}
              className="text-cyan-400 font-bold underline text-[11px] cursor-pointer"
            >
              Ver todo el Brief
            </button>
          </div>
        )}

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
                library={library}
                onOpenSettings={() => setShowNotebookSettings(true)}
                onOpenLibrary={() => setShowLibrary(true)}
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
        onSelectTab={handleSelectFilter}
        onOpenConnect={() => setShowMobileModal(true)}
      />

      {/* Modal de Conexión a Celular con Código QR */}
      <MobileConnectModal
        isOpen={showMobileModal}
        onClose={() => setShowMobileModal(false)}
      />

      {/* Configuración de libretas y auto-tagging (NotebookLM local) */}
      <NotebookLMSettingsModal
        isOpen={showNotebookSettings}
        onClose={() => setShowNotebookSettings(false)}
        notebooks={library.notebooks}
        updateNotebook={library.updateNotebook}
        addNotebook={library.addNotebook}
        deleteNotebook={library.deleteNotebook}
      />

      {/* Biblioteca de papers guardados */}
      <PapersLibrary
        isOpen={showLibrary}
        onClose={() => setShowLibrary(false)}
        notebooks={library.notebooks}
        savedPapers={library.savedPapers}
        removeFromLibrary={library.removeFromLibrary}
        toggleFavorite={library.toggleFavorite}
        toggleRead={library.toggleRead}
      />
    </main>
  );
}
