/**
 * Extractor de noticias chilenas (Economía y Actualidad)
 * Consulta feeds en tiempo real de medios nacionales (Emol, La Tercera, Diario Financiero)
 */

export async function fetchChileNews(limit = 3) {
  try {
    const rssUrl = 'https://news.google.com/rss/search?q=economia+chile&hl=es-419&gl=CL&ceid=CL:es-419';
    const res = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status} al obtener noticias`);
    const xml = await res.text();

    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < limit) {
      const itemContent = match[1];

      const rawTitle = itemContent.match(/<title>([\s\S]*?)<\/title>/)?.[1] || '';
      const link = itemContent.match(/<link>([\s\S]*?)<\/link>/)?.[1] || '';
      const sourceMatch = itemContent.match(/<source[^>]*>([\s\S]*?)<\/source>/)?.[1] || 'Prensa chilena';

      // Limpiar título de fuentes añadidas al final por Google News (e.g. "Título - Emol")
      let cleanTitle = rawTitle.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim();
      let sourceName = sourceMatch.replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1').trim();

      if (cleanTitle.includes(' - ')) {
        const parts = cleanTitle.split(' - ');
        sourceName = parts.pop().trim();
        cleanTitle = parts.join(' - ').trim();
      }

      const gradients = [
        'from-emerald-400 to-teal-500',
        'from-cyan-400 to-blue-500',
        'from-purple-500 to-pink-500'
      ];

      items.push({
        id: `news-${items.length + 1}`,
        url: link.trim(),
        fuente: sourceName || 'Emol',
        titulo: cleanTitle,
        detalle: `Información de actualidad económica y laboral en Chile según ${sourceName || 'medios nacionales'}.`,
        categoria: 'Economía · Chile',
        borderGradient: gradients[items.length % gradients.length]
      });
    }

    return items;
  } catch (err) {
    console.error('Error al extraer noticias chilenas:', err.message);
    return [];
  }
}
