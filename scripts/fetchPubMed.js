/**
 * Conector oficial con NCBI Entrez API (PubMed E-Utilities)
 * Busca papers recientes en áreas clínicas de interés para kinesiología / rehabilitación:
 * - Disfunción temporomandibular (ATM) / Dolor orofacial
 * - Rehabilitación pulmonar y EPOC
 * - Movilización precoz en UPC / Soporte circulatorio mecánico
 * - Fisioterapia y ejercicio terapéutico
 */

const SEARCH_TERMS = [
  'temporomandibular joint osteoarthritis physical therapy[tiab]',
  'COPD right ventricular function exercise[tiab]',
  'ICU early mobilization mechanical circulatory support[tiab]',
  'facial pressure pain threshold orofacial[tiab]',
  'respiratory muscle training physical therapy[tiab]'
];

export async function fetchPubMedPapers(limit = 4, excludeDois = new Set()) {
  try {
    // Combina los 5 focos clínicos de la especialidad (en vez de solo 4 términos genéricos)
    // y amplía la ventana a 2 años para tener un pool real del cual rotar día a día.
    const term = encodeURIComponent(`(${SEARCH_TERMS.join(' OR ')}) AND "last 2 years"[dp]`);
    const retmax = Math.max(limit * 6, 24);

    // 1. ESearch: Obtener un pool amplio de IDs recientes
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${term}&retmode=json&retmax=${retmax}&sort=pub_date`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) throw new Error(`PubMed Search Error: ${searchRes.status}`);
    const searchData = await searchRes.json();
    const idList = searchData.esearchresult?.idlist || [];

    if (idList.length === 0) {
      console.warn('No se encontraron IDs en PubMed, usando fallback.');
      return [];
    }

    // 2. ESummary: Obtener metadata detallada de todo el pool
    const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${idList.join(',')}&retmode=json`;
    const summaryRes = await fetch(summaryUrl);
    if (!summaryRes.ok) throw new Error(`PubMed Summary Error: ${summaryRes.status}`);
    const summaryData = await summaryRes.json();
    const resultObj = summaryData.result || {};

    const allPapers = [];
    for (const pmid of idList) {
      const item = resultObj[pmid];
      if (!item) continue;

      // Extraer DOI si existe
      let doi = `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
      if (item.articleids) {
        const doiObj = item.articleids.find((a) => a.idtype === 'doi');
        if (doiObj) {
          doi = `https://doi.org/${doiObj.value}`;
        }
      }

      allPapers.push({
        pmid,
        titulo: item.title?.replace(/\.$/, '') || 'Estudio clínico en rehabilitación',
        revista: item.source || 'PubMed Central',
        fechaPub: item.pubdate || '2026',
        doi,
        autores: item.authors?.map((a) => a.name).slice(0, 3).join(', ') || 'Varios autores'
      });
    }

    // 3. Preferir papers que no hayan salido en briefs recientes; si no alcanzan, completar con repetidos
    const fresh = allPapers.filter((p) => !excludeDois.has(p.doi));
    const chosen = fresh.length >= limit
      ? fresh.slice(0, limit)
      : [...fresh, ...allPapers.filter((p) => excludeDois.has(p.doi))].slice(0, limit);

    if (fresh.length < limit) {
      console.warn(`Solo ${fresh.length} papers nuevos disponibles en el pool; se completó con repetidos recientes.`);
    }

    return chosen;
  } catch (err) {
    console.error('Error al consultar PubMed NCBI:', err.message);
    return [];
  }
}
