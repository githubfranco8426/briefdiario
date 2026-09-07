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

export async function fetchPubMedPapers(limit = 4) {
  try {
    const papers = [];
    const term = encodeURIComponent(
      '(temporomandibular joint OR COPD rehabilitation OR early mobilization ICU OR facial pain threshold) AND "last 1 year"[dp]'
    );
    
    // 1. ESearch: Obtener lista de IDs recientes
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${term}&retmode=json&retmax=${limit * 2}&sort=pub_date`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) throw new Error(`PubMed Search Error: ${searchRes.status}`);
    const searchData = await searchRes.json();
    const idList = searchData.esearchresult?.idlist || [];

    if (idList.length === 0) {
      console.warn('No se encontraron IDs en PubMed, usando fallback.');
      return [];
    }

    // 2. ESummary: Obtener metadata detallada de cada ID
    const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${idList.slice(0, limit).join(',')}&retmode=json`;
    const summaryRes = await fetch(summaryUrl);
    if (!summaryRes.ok) throw new Error(`PubMed Summary Error: ${summaryRes.status}`);
    const summaryData = await summaryRes.json();
    const resultObj = summaryData.result || {};

    for (const pmid of idList.slice(0, limit)) {
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

      papers.push({
        pmid,
        titulo: item.title?.replace(/\.$/, '') || 'Estudio clínico en rehabilitación',
        revista: item.source || 'PubMed Central',
        fechaPub: item.pubdate || '2026',
        doi,
        autores: item.authors?.map((a) => a.name).slice(0, 3).join(', ') || 'Varios autores'
      });
    }

    return papers;
  } catch (err) {
    console.error('Error al consultar PubMed NCBI:', err.message);
    return [];
  }
}
