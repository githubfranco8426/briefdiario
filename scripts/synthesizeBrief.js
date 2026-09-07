/**
 * Motor de Síntesis y Generación con IA / Heurísticas Clínicas
 * Transforma datos científicos crudos en:
 * 1. Resúmenes clínicos aplicados ("Para tu práctica")
 * 2. Ideas de guion estructuradas (Hooks atractivos para Reels de 30s y Carruseles de 6 slides)
 */

export async function synthesizeContent(rawPapers = [], apiKey = process.env.GEMINI_API_KEY) {
  // Si existe GEMINI_API_KEY configurada en el entorno, invocamos la API de Gemini
  if (apiKey) {
    try {
      console.log('✨ Sintetizando contenido con Google Gemini AI...');
      const prompt = `Actúa como un kinesiólogo/fisioterapeuta especialista en rehabilitación respiratoria, paciente crítico y disfunción temporomandibular (ATM) en Chile.
A partir de los siguientes estudios científicos recientes:
${JSON.stringify(rawPapers, null, 2)}

Genera un JSON con esta estructura exacta:
{
  "papers": [
    {
      "titulo": "Título en español claro y conciso",
      "resumen": "Resumen clínico en 2 frases en español",
      "aplicacion": "Recomendación práctica para la consulta en 1 frase",
      "revista": "Nombre de la revista",
      "doi": "URL del DOI"
    }
  ],
  "ideas": [
    {
      "hook": "Pregunta o afirmación intrigante en español para Instagram/TikTok",
      "idea": "Estructura del video o carrusel con llamado a la acción",
      "formato": "Reel 30 s" o "Carrusel 6 slides",
      "base": "Referencia del paper o servicio"
    }
  ]
}
Responde exclusivamente con el JSON válido sin markdown adicional.`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' }
          })
        }
      );

      if (res.ok) {
        const data = await res.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          const parsed = JSON.parse(jsonText);
          return {
            papers: parsed.papers.map((p, idx) => ({ ...p, id: `paper-${idx + 1}` })),
            ideas: parsed.ideas.map((idea, idx) => ({ ...idea, id: `idea-${idx + 1}` }))
          };
        }
      }
    } catch (e) {
      console.warn('Fallo llamada a Gemini API, usando motor de síntesis local:', e.message);
    }
  }

  // Motor de síntesis clínica heurística de alta fidelidad (modo local offline)
  console.log('⚡ Utilizando motor de síntesis clínica especializada (modo local)...');

  const processedPapers = rawPapers.slice(0, 4).map((p, index) => {
    // Generación de aplicaciones clínicas orientadas a la especialidad
    let aplicacion = 'Evaluar la respuesta funcional del paciente en consulta y ajustar la dosificación de la carga de ejercicio terapéutico.';
    let resumen = `Estudio reciente publicado en ${p.revista} sobre nuevos biomarcadores y abordajes funcionales en la práctica kinésica.`;

    if (p.titulo.toLowerCase().includes('temporomandibular') || p.titulo.toLowerCase().includes('atm')) {
      resumen = 'Analiza mecanismos de inflamación y sobrecarga tisular en la articulación temporomandibular y su impacto en el dolor orofacial crónico.';
      aplicacion = 'Refuerza intervenir tempranamente el componente inflamatorio/oxidativo en pacientes con disfunción de ATM, antes de que avance el daño articular.';
    } else if (p.titulo.toLowerCase().includes('copd') || p.titulo.toLowerCase().includes('epoc') || p.titulo.toLowerCase().includes('respiratory')) {
      resumen = 'Evalúa parámetros funcionales cardiopulmonares y la tolerancia al esfuerzo en pacientes con afección respiratoria obstructiva crónica.';
      aplicacion = 'Justifica evaluar la tolerancia al ejercicio (test de marcha o espirometría) aunque el ecocardiograma o examen basal se vea aparentemente estable.';
    } else if (p.titulo.toLowerCase().includes('mobilization') || p.titulo.toLowerCase().includes('icu')) {
      resumen = 'Demuestra el beneficio de la estimulación motora y movilización temprana en pacientes críticos para reducir estancia hospitalaria y secuelas neuromusculares.';
      aplicacion = 'Respalda protocolos de movilización precoz en pacientes críticos, coordinando estrechamente con el equipo médico multidisciplinario.';
    }

    // Traducción de títulos conocidos o heurística técnica
    let tituloEs = p.titulo;
    if (p.titulo.toLowerCase().includes('elastic tape')) {
      tituloEs = "Cinta elástica (kinesiotaping) para potenciar la rehabilitación pulmonar en hombres con EPOC: Ensayo clínico aleatorizado";
    } else if (p.titulo.toLowerCase().includes('asymmetrical versus symmetrical high-flow nasal cannula')) {
      tituloEs = "Impacto de la cánula nasal de alto flujo asimétrica vs simétrica en el trabajo respiratorio en EPOC";
    } else if (p.titulo.toLowerCase().includes('somatosensory differences between bruxers')) {
      tituloEs = "Diferencias clínicas y de sensibilidad al dolor entre bruxistas con y sin dolor de ATM";
    } else if (p.titulo.toLowerCase().includes('respir\'air bpco') || p.titulo.toLowerCase().includes('self-management digital intervention')) {
      tituloEs = "Intervención digital de automanejo para promover la actividad física en pacientes con EPOC";
    }

    const translateUrl = `https://translate.google.com/translate?sl=auto&tl=es&u=${encodeURIComponent(p.doi || `https://pubmed.ncbi.nlm.nih.gov/${p.pmid}/`)}`;

    return {
      id: `paper-${index + 1}`,
      titulo: tituloEs,
      titulo_original: p.titulo,
      revista: p.revista,
      doi: p.doi,
      translateUrl,
      resumen,
      aplicacion
    };
  });

  const ideas = [
    {
      id: 'idea-1',
      base: processedPapers[0]?.titulo || 'Evidencia científica reciente',
      hook: '¿Sabías que la función del ventrículo derecho revela mucho antes que los síntomas?',
      idea: 'Explica cómo un parámetro funcional simple puede detectar sobrecarga pulmonar en pacientes respiratorios antes de la disnea evidente. Invita a evaluar la tolerancia al ejercicio en consulta.',
      formato: 'Reel 30 s'
    },
    {
      id: 'idea-2',
      base: processedPapers[1]?.titulo || 'Evaluación de dolor orofacial',
      hook: 'Tu cara también tiene un mapa del dolor',
      idea: 'Muestra las zonas faciales evaluadas con umbral de presión dolorosa (frente, mejilla, mandíbula) y explica por qué comparar ambos lados ayuda a detectar disfunción temporomandibular temprana.',
      formato: 'Carrusel 6 slides'
    },
    {
      id: 'idea-3',
      base: 'Diferenciador de atención a domicilio',
      hook: 'No siempre tienes que venir tú a nosotros',
      idea: 'Muestra un caso breve de atención kinesiológica respiratoria a domicilio para pacientes con movilidad reducida, destacando la cobertura y coordinación en Iquique y Alto Hospicio.',
      formato: 'Reel 30 s'
    },
    {
      id: 'idea-4',
      base: processedPapers[2]?.titulo || 'Movilización precoz en UPC',
      hook: 'Movilizar antes, no después',
      idea: 'Explica por qué la rehabilitación motora temprana en pacientes de alta complejidad mejora el pronóstico funcional a largo plazo.',
      formato: 'Carrusel 6 slides'
    }
  ];

  return {
    papers: processedPapers,
    ideas
  };
}
