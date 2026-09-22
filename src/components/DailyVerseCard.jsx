import React, { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

const VERSICULOS_DEFAULT = [
  { id: 'verse-1', texto: 'Pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas; correrán, y no se cansarán; caminarán, y no se fatigarán.', referencia: 'Isaías 40:31', reflexion: 'Tu labor en rehabilitación exige paciencia y energía; recuerda que la renovación física y espiritual se recibe paso a paso cada mañana.' },
  { id: 'verse-2', texto: 'Todo lo puedo en Cristo que me fortalece.', referencia: 'Filipenses 4:13', reflexion: 'Para enfrentar los casos más desafiantes hoy en la clínica o a domicilio: cuentas con respaldo y serenidad inquebrantable.' },
  { id: 'verse-3', texto: 'Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas.', referencia: 'Josué 1:9', reflexion: 'Firmeza y convicción en tus decisiones terapéuticas y en el acompañamiento a cada paciente.' },
  { id: 'verse-4', texto: 'Alzaré mis ojos a los montes; ¿de dónde vendrá mi socorro? Mi socorro viene de Jehová, que hizo los cielos y la tierra.', referencia: 'Salmos 121:1-2', reflexion: 'En medio de una jornada intensa, eleva la mirada: el propósito de sanar y servir trasciende cada rutina.' }
];

export function DailyVerseCard({ verseData }) {
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const currentVerse = index === 0 ? (verseData || VERSICULOS_DEFAULT[0]) : VERSICULOS_DEFAULT[index];

  const copyVerse = async () => {
    await navigator.clipboard.writeText(`📖 "${currentVerse.texto}"\n— ${currentVerse.referencia}\n\n🕊️ ${currentVerse.reflexion || ''}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className={`brief-verse ${expanded ? 'is-expanded' : ''}`} aria-label="Versículo del día">
      <div className="brief-verse-header">
        <span>Una pausa para hoy</span>
        <div className="brief-verse-actions">
          <button type="button" className="brief-verse-expand" onClick={() => setExpanded((previous) => !previous)} aria-expanded={expanded}>{expanded ? 'Menos' : 'Leer'}</button>
          <button type="button" onClick={() => setIndex((prev) => (prev + 1) % VERSICULOS_DEFAULT.length)} aria-label="Cambiar versículo" title="Cambiar versículo"><RefreshCw size={15} /></button>
          <button type="button" onClick={copyVerse} aria-label={copied ? 'Versículo copiado' : 'Copiar versículo'} title="Copiar versículo">{copied ? <Check size={15} /> : <Copy size={15} />}</button>
        </div>
      </div>
      <blockquote>“{currentVerse.texto}”</blockquote>
      <p className="brief-verse-reference">— {currentVerse.referencia}</p>
      {currentVerse.reflexion && <p className="brief-verse-reflection">{currentVerse.reflexion}</p>}
    </aside>
  );
}
