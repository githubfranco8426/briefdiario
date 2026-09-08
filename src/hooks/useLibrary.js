import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'rehabilita_library_v1';

const DEFAULT_NOTEBOOKS = [
  {
    id: 'upc-critico',
    emoji: '📓',
    name: 'UPC & Crítico',
    color: 'cyan',
    priority: 'Alta prioridad',
    autoAudio: false,
    keywords: ['ventilación mecánica', 'destete', 'movilización precoz', 'sepsis', 'diafragma', 'apache', 'upc', 'uci', 'crítico', 'polineuropatía', 'polineuromiopatía'],
  },
  {
    id: 'respiratorio-vm',
    emoji: '🫁',
    name: 'Respiratorio & VM',
    color: 'teal',
    priority: 'Diario',
    autoAudio: false,
    keywords: ['pimax', 'pmus', 'epoc', 'vni', 'cánula', 'alto flujo', 'ventilación no invasiva', 'respiratorio', 'inspiratorio', 'disnea'],
  },
  {
    id: 'neuro-atm',
    emoji: '🧠',
    name: 'Neuro & Rehabilitación',
    color: 'violet',
    priority: 'Ambulatorio',
    autoAudio: false,
    keywords: ['bruxismo', 'atm', 'algometría', 'dolor miofascial', 'cervicalgia', 'temporomandibular', 'dolor crónico', 'orofacial'],
  },
];

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { notebooks: DEFAULT_NOTEBOOKS, savedPapers: [] };
    const parsed = JSON.parse(raw);
    return {
      notebooks: Array.isArray(parsed.notebooks) && parsed.notebooks.length > 0 ? parsed.notebooks : DEFAULT_NOTEBOOKS,
      savedPapers: Array.isArray(parsed.savedPapers) ? parsed.savedPapers : [],
    };
  } catch {
    return { notebooks: DEFAULT_NOTEBOOKS, savedPapers: [] };
  }
}

/**
 * Clasificador local de auto-tagging: cuenta coincidencias de palabras clave
 * de cada libreta contra el texto del paper y elige la de mayor puntaje.
 */
export function classifyPaper(paper, notebooks) {
  const haystack = `${paper.titulo || ''} ${paper.titulo_original || ''} ${paper.resumen || ''} ${paper.aplicacion || ''}`.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const nb of notebooks) {
    const score = nb.keywords.reduce((acc, kw) => (haystack.includes(kw.toLowerCase()) ? acc + 1 : acc), 0);
    if (score > bestScore) {
      bestScore = score;
      best = nb;
    }
  }
  return best;
}

export function useLibrary() {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error(e);
    }
  }, [state]);

  const saveToLibrary = useCallback((paper, notebookIdOverride) => {
    setState((prev) => {
      if (prev.savedPapers.some((p) => p.paperId === paper.id)) return prev;
      const notebook = notebookIdOverride
        ? prev.notebooks.find((n) => n.id === notebookIdOverride)
        : classifyPaper(paper, prev.notebooks);
      const entry = {
        ...paper,
        paperId: paper.id,
        notebookId: notebook?.id || null,
        savedAt: new Date().toISOString(),
        favorite: false,
        read: false,
      };
      return { ...prev, savedPapers: [entry, ...prev.savedPapers] };
    });
  }, []);

  const removeFromLibrary = useCallback((paperId) => {
    setState((prev) => ({ ...prev, savedPapers: prev.savedPapers.filter((p) => p.paperId !== paperId) }));
  }, []);

  const toggleFavorite = useCallback((paperId) => {
    setState((prev) => ({
      ...prev,
      savedPapers: prev.savedPapers.map((p) => (p.paperId === paperId ? { ...p, favorite: !p.favorite } : p)),
    }));
  }, []);

  const toggleRead = useCallback((paperId) => {
    setState((prev) => ({
      ...prev,
      savedPapers: prev.savedPapers.map((p) => (p.paperId === paperId ? { ...p, read: !p.read } : p)),
    }));
  }, []);

  const updateNotebook = useCallback((id, patch) => {
    setState((prev) => ({
      ...prev,
      notebooks: prev.notebooks.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    }));
  }, []);

  const addNotebook = useCallback((notebook) => {
    setState((prev) => ({ ...prev, notebooks: [...prev.notebooks, notebook] }));
  }, []);

  const deleteNotebook = useCallback((id) => {
    setState((prev) => ({
      notebooks: prev.notebooks.filter((n) => n.id !== id),
      savedPapers: prev.savedPapers.map((p) => (p.notebookId === id ? { ...p, notebookId: null } : p)),
    }));
  }, []);

  const isSaved = useCallback((paperId) => state.savedPapers.some((p) => p.paperId === paperId), [state.savedPapers]);

  return {
    notebooks: state.notebooks,
    savedPapers: state.savedPapers,
    saveToLibrary,
    removeFromLibrary,
    toggleFavorite,
    toggleRead,
    updateNotebook,
    addNotebook,
    deleteNotebook,
    isSaved,
  };
}
