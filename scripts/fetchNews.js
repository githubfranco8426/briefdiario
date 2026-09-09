/**
 * Extractor de noticias chilenas por categoría
 * Consulta feeds en tiempo real de Google News para varias categorías de interés
 * (economía, salud, IA/mercados, y la Región de Tarapacá/Norte Grande), y arma
 * un mix diversificado en vez de traer siempre lo mismo de una sola búsqueda.
 */

const CATEGORIES = [
  { categoria: 'Economía · Chile', query: 'economia chile', gradient: 'from-emerald-400 to-teal-500' },
  { categoria: 'Salud', query: 'salud chile kinesiologia OR fisioterapia OR rehabilitacion', gradient: 'from-rose-400 to-orange-500' },
  { categoria: 'IA · Mercados', query: 'inteligencia artificial mercados OR tecnologia chile', gradient: 'from-cyan-400 to-blue-500' },
  { categoria: 'Norte Grande', query: 'Iquique OR Tarapaca OR "Alto Hospicio"', gradient: 'from-purple-500 to-pink-500' },
];

async function fetchCategoryNews({ categoria, query, gradient }, limit) {
  const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=es-419&gl=CL&ceid=CL:es-419`;
  const res = await fetch(rssUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} al obtener noticias de "${categoria}"`);
  const xml = await res.text();

  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null && items.length < limit) {
    const itemContent = match[1];

    const rawTitle = itemContent.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '';
    const link = itemContent.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '';
    const sourceMatch = itemContent.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] || 'Prensa chilena';

    let cleanTitle = rawTitle.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim();
    let sourceName = sourceMatch.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim();

    if (cleanTitle.includes(' - ')) {
      const parts = cleanTitle.split(' - ');
      sourceName = parts.pop().trim();
      cleanTitle = parts.join(' - ').trim();
    }

    items.push({
      url: link.trim(),
      fuente: sourceName || 'Prensa chilena',
      titulo: cleanTitle,
      detalle: `Información de actualidad en ${categoria.toLowerCase()} según ${sourceName || 'medios nacionales'}.`,
      categoria,
      borderGradient: gradient
    });
  }

  return items;
}

export async function fetchChileNews(limit = 4) {
  try {
    // 1 noticia por categoría como base, para asegurar variedad temática
    const results = await Promise.allSettled(
      CATEGORIES.map((cat) => fetchCategoryNews(cat, 1))
    );

    let items = results
      .filter((r) => r.status === 'fulfilled')
      .flatMap((r) => r.value);

    // Si alguna categoría falló o quedó corta, completar con más noticias de economía
    if (items.length < limit) {
      const extra = await fetchCategoryNews(CATEGORIES[0], limit);
      const existingUrls = new Set(items.map((i) => i.url));
      for (const extraItem of extra) {
        if (items.length >= limit) break;
        if (!existingUrls.has(extraItem.url)) {
          items.push(extraItem);
          existingUrls.add(extraItem.url);
        }
      }
    }

    return items.slice(0, limit).map((item, idx) => ({ id: `news-${idx + 1}`, ...item }));
  } catch (err) {
    console.error('Error al extraer noticias chilenas:', err.message);
    return [];
  }
}
