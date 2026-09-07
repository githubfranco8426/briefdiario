import React, { useState, useEffect } from 'react';
import { Download, X, PlusSquare, Share, Sparkles } from 'lucide-react';

export function InstallGuideBanner({ onOpenModal }) {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Verificar si ya está corriendo como app instalada (standalone)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    setIsStandalone(!!isInStandaloneMode);

    // Detectar iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Escuchar evento de instalación nativa en Android/Chrome
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      onOpenModal();
    }
  };

  // Si ya está instalada o el usuario la cerró, no mostrar el banner
  if (isStandalone || isDismissed) return null;

  return (
    <div className="mb-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-[#0e1628] to-purple-950/30 p-3.5 sm:p-4 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center justify-between gap-3 animate-fade-in relative overflow-hidden">
      <div className="flex items-center gap-3 min-w-0">
        <img
          src="/apple-touch-icon.png"
          alt="Icono Brief Diario"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl border border-cyan-400/40 shadow-[0_0_15px_rgba(0,240,255,0.3)] shrink-0 object-cover"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-xs sm:text-sm font-bold text-white truncate">
              Instalar Brief Diario en tu Inicio
            </h4>
            <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20 hidden sm:inline-block">
              App Móvil
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-gray-300 truncate mt-0.5">
            {isIOS
              ? 'Toca Compartir ⎋ y "Agregar a pantalla de inicio" ➕'
              : 'Accede en 1 toque como una app nativa desde tu celular'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs hover:bg-cyan-300 transition shadow-[0_0_15px_rgba(0,240,255,0.4)] active:scale-95 cursor-pointer"
        >
          {isIOS ? <PlusSquare className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
          <span>{deferredPrompt ? 'Instalar' : 'Guardar en Inicio'}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          aria-label="Cerrar aviso"
          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
