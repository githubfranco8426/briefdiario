# Brief Diario · rehabilita.me 🩺✨

Dashboard de productividad clínica e investigación diaria para Franco (kinesiólogo/fisioterapeuta en Iquique y Alto Hospicio, Chile). Agrupa agenda de Google Calendar, ideas de guiones para redes sociales, evidencia científica de PubMed y noticias de actualidad nacional en una interfaz moderna *dark glassmorphic*.

---

## 🌟 Características Principales

- 🎨 **Diseño Glassmorphism de Alta Fidelidad:** Paleta oscura profunda (`#090d16`), bordes translúcidos, efectos `backdrop-blur-md` y orbs de iluminación difusa.
- 🕒 **Reloj Local Reactivo:** Sincronizado por segundo con saludo contextual y badge de turno.
- 📅 **Google Calendar & Checklist:** Soporte para feed `.ics` privado de Google Calendar y checklist interactivo de tareas con persistencia en `localStorage`.
- 📚 **PubMed en Vivo:** Conexión oficial con la API NCBI Entrez para extraer papers recientes en kinesiología, ATM, EPOC y UCI con su respectivo DOI y aplicación clínica ("Para tu práctica").
- 💡 **Ideas de Guiones con 1 Clic:** Hooks probados para Instagram/TikTok (Reels de 30s y Carruseles de 6 slides) con botón de copiado rápido.
- 🗞️ **Actualidad Chilena:** Titulares económicos y nacionales en tiempo real (BioBioChile, Emol, DF).
- 📜 **Historial de Briefs:** Selector de fecha en la cabecera para revisar o consultar resúmenes de días anteriores.
- ⏰ **Scheduler Automático a las 06:30 AM:** Programador diario perpetuo en Node.js o como tarea nativa en Windows.

---

## 🚀 Inicio Rápido

### 1. Instalación de dependencias
```bash
npm install
```

### 2. Iniciar servidor de desarrollo
```bash
npm run dev
```
Abre tu navegador en: [http://localhost:3000](http://localhost:3000)

### 3. Generar un nuevo brief diario
```bash
npm run generate-brief
```
*El frontend se actualizará en vivo automáticamente mediante Vite HMR.*

---

## ⚙️ Configuración (Opcional)

Crea un archivo `.env` en la raíz (puedes basarte en `.env.example`):

```env
# Clave de API de Gemini para síntesis de guiones con IA (opcional)
GEMINI_API_KEY=tu_api_key_aqui

# Dirección secreta en formato iCal (.ics) de Google Calendar (opcional)
GOOGLE_CALENDAR_ICS_URL=https://calendar.google.com/calendar/ical/.../basic.ics
```

> **Nota:** Si no defines ninguna variable, el sistema funciona al 100% utilizando el motor clínico local y el cálculo automático de rotativa de turnos.

---

## ⏰ Programación Automática a las 06:30 AM

Tienes dos alternativas para que el brief se genere automáticamente cada mañana:

### Opción A: Proceso Node.js en segundo plano
```bash
npm run scheduler
```
*Calcula el tiempo restante hasta las 06:30 AM y ejecuta `generateBrief.js` todos los días.*

### Opción B: Tarea nativa en Windows Task Scheduler
Haz clic derecho en `scripts/setup_windows_task.bat` y selecciona **"Ejecutar como administrador"**. Esto registrará una tarea en Windows que se ejecutará a las 06:30 AM sin necesidad de dejar terminales abiertas.

---

## 🌐 Despliegue en la Nube

El proyecto incluye las configuraciones optimizadas para despliegue en:

### Vercel
1. Conecta este repositorio en [vercel.com](https://vercel.com).
2. Framework Preset: **Vite**.
3. (Opcional) Agrega tus variables de entorno en el panel de Vercel.
4. Presiona **Deploy**. El archivo `vercel.json` se encargará de las rutas y el almacenamiento en caché.

### Netlify
1. Conecta este repositorio en [netlify.com](https://netlify.com).
2. El archivo `netlify.toml` preconfigura el comando `npm run build` y la carpeta `dist`.
3. Presiona **Deploy**.

---

## 🛠️ Stack Tecnológico

- **Frontend:** React 18, Vite 6, Tailwind CSS, Lucide React
- **Pipeline de Datos:** Node.js (fetch nativo, NCBI Entrez API, Google News RSS, iCal parser)
- **Fuentes:** Google Fonts (*Inter*)
