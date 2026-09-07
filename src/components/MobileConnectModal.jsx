import React, { useState } from 'react';
import { Smartphone, X, Copy, Check, QrCode, ExternalLink } from 'lucide-react';

export function MobileConnectModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  // URL accesible en la red local (Wi-Fi)
  const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  const port = typeof window !== 'undefined' ? window.location.port : '3000';
  
  // Si estamos en localhost, sugerimos la IP local de la máquina (192.168.1.148)
  const mobileUrl = currentHost === 'localhost' || currentHost === '127.0.0.1'
    ? `http://192.168.1.148:${port || '3000'}`
    : window.location.origin;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(mobileUrl)}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-[#0e1424] p-6 shadow-2xl">
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-purple-500 shadow-lg shadow-purple-500/20">
            <Smartphone className="h-5 w-5 text-white" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-white">Abrir en tu Celular</h3>
            <p className="text-xs text-gray-400">Verifica tu agenda y papers desde el móvil</p>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="my-5 flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="p-2 rounded-xl bg-white shadow-inner mb-3">
            <img
              src={qrImageUrl}
              alt="Código QR para abrir en celular"
              className="w-44 h-44 object-contain rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <p className="text-xs text-gray-300 font-medium text-center">
            Apunta la cámara de tu celular al código QR
          </p>
          <p className="text-[11px] text-gray-500 text-center mt-0.5">
            (Asegúrate de que tu celular esté conectado al mismo Wi-Fi)
          </p>
        </div>

        {/* Link directo con botón de copiar */}
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 mb-5">
          <span className="text-xs font-mono text-blue-300 truncate pl-2">
            {mobileUrl}
          </span>
          <button
            type="button"
            onClick={copyUrl}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-300 text-xs hover:bg-blue-500/30 transition shrink-0"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
          </button>
        </div>

        {/* Instrucciones de instalación PWA */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-xs space-y-2.5 text-gray-300">
          <p className="font-semibold text-white flex items-center gap-1.5">
            <span>📲</span> Cómo guardarlo como App en la pantalla de inicio:
          </p>
          <div className="space-y-1.5 pl-1 text-[11px] text-gray-400">
            <p>
              <strong className="text-gray-200">En iPhone (Safari):</strong> Toca el botón <strong>Compartir</strong> ⎋ abajo y elige <strong>"Agregar a pantalla de inicio"</strong> ➕.
            </p>
            <p>
              <strong className="text-gray-200">En Android (Chrome):</strong> Toca los <strong>tres puntos</strong> ⋮ arriba y selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a pantalla principal"</strong>.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-xs hover:opacity-95 transition shadow-lg shadow-purple-500/20"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
