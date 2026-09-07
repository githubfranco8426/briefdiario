import React, { useState } from 'react';
import { Smartphone, X, Copy, Check, QrCode, PlusSquare, ArrowDown } from 'lucide-react';

export function MobileConnectModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  // Preferir la URL de producción o el origen actual
  const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  const mobileUrl = isLocal ? 'http://192.168.1.148:3000' : (typeof window !== 'undefined' ? window.location.origin : 'https://brief-diario-six.vercel.app');

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(mobileUrl)}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(mobileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-[#0e1424] p-6 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Encabezado con Icono de App */}
        <div className="flex items-center gap-3.5 mb-5">
          <img
            src="/apple-touch-icon.png"
            alt="Icono oficial Brief Diario"
            className="w-13 h-13 rounded-2xl border border-cyan-400/50 shadow-[0_0_20px_rgba(0,240,255,0.4)] object-cover"
          />
          <div>
            <h3 className="text-lg font-bold text-white leading-snug">
              Brief Diario en tu Celular
            </h3>
            <p className="text-xs text-cyan-300 font-medium">
              Guárdala como App en tu pantalla de inicio
            </p>
          </div>
        </div>

        {/* QR Code Container */}
        <div className="my-4 flex flex-col items-center justify-center p-4 rounded-2xl bg-white/[0.04] border border-white/10">
          <div className="p-2 rounded-2xl bg-white shadow-inner mb-3">
            <img
              src={qrImageUrl}
              alt="Código QR para celular"
              className="w-40 h-40 object-contain rounded-lg"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <p className="text-xs text-gray-200 font-semibold text-center">
            Escanea con la cámara de tu celular
          </p>
          <p className="text-[11px] text-gray-400 text-center mt-0.5">
            O escribe directamente el enlace abajo
          </p>
        </div>

        {/* Link directo con botón de copiar */}
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 mb-5">
          <span className="text-xs font-mono text-cyan-300 truncate pl-2 font-medium">
            {mobileUrl}
          </span>
          <button
            type="button"
            onClick={copyUrl}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-400 text-slate-950 font-bold text-xs hover:bg-cyan-300 transition shrink-0 cursor-pointer shadow-sm"
          >
            {copied ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
          </button>
        </div>

        {/* Instrucciones con icono de entrada */}
        <div className="rounded-2xl border border-cyan-500/25 bg-cyan-500/5 p-4 text-xs space-y-3">
          <p className="font-bold text-white flex items-center gap-2">
            <PlusSquare className="h-4 w-4 text-cyan-400" />
            Cómo crear el Icono de Entrada en tu celular:
          </p>

          <div className="space-y-2 text-[11px] text-gray-300 pl-1">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <strong className="text-white block mb-0.5">📱 En iPhone (Safari):</strong>
              1. Toca el botón <strong>Compartir</strong> ⎋ (el cuadrado con la flecha).<br />
              2. Elige <strong>"Agregar a pantalla de inicio"</strong> ➕.<br />
              3. Toca <strong>Agregar</strong> en la esquina superior derecha.
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
              <strong className="text-white block mb-0.5">🤖 En Android (Chrome):</strong>
              1. Toca los <strong>tres puntos</strong> ⋮ arriba a la derecha.<br />
              2. Selecciona <strong>"Instalar aplicación"</strong> o <strong>"Agregar a pantalla principal"</strong>.
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-black text-xs hover:opacity-95 transition shadow-lg shadow-cyan-500/25 cursor-pointer"
        >
          ¡Listo, entendido!
        </button>
      </div>
    </div>
  );
}
