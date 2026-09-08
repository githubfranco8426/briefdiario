---
name: Obsidian Clinical Brief
colors:
  surface: '#0f131c'
  surface-dim: '#0f131c'
  surface-bright: '#353943'
  surface-container-lowest: '#0a0e17'
  surface-container-low: '#181b25'
  surface-container: '#1c1f29'
  surface-container-high: '#262a34'
  surface-container-highest: '#31353f'
  on-surface: '#dfe2ef'
  on-surface-variant: '#bcc9cd'
  inverse-surface: '#dfe2ef'
  inverse-on-surface: '#2c303a'
  outline: '#869397'
  outline-variant: '#3d494c'
  surface-tint: '#4cd7f6'
  primary: '#4cd7f6'
  on-primary: '#003640'
  primary-container: '#06b6d4'
  on-primary-container: '#00424f'
  inverse-primary: '#00687a'
  secondary: '#4fdbc8'
  on-secondary: '#003731'
  secondary-container: '#04b4a2'
  on-secondary-container: '#003f38'
  tertiary: '#c0c1ff'
  on-tertiary: '#1000a9'
  tertiary-container: '#9a9dff'
  on-tertiary-container: '#211cb4'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#acedff'
  primary-fixed-dim: '#4cd7f6'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#004e5c'
  secondary-fixed: '#71f8e4'
  secondary-fixed-dim: '#4fdbc8'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005048'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#0f131c'
  on-background: '#dfe2ef'
  surface-variant: '#31353f'
typography:
  display-hero:
    fontFamily: Space Grotesk
    fontSize: 44px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-telemetry:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-micro:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 12px
    letterSpacing: 0.08em
  quote-editorial:
    fontFamily: Space Grotesk
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  space-3xl: 4.5rem
  gutter-mobile: 1rem
  gutter-desktop: 1.5rem
  max-content-width: 72rem
---

## Brand & Style

This design system establishes a high-performance, clinical-grade executive atmosphere tailored for a daily personal health and physical therapy briefing experience. It fuses high-precision telemetry with bespoke restorative care, avoiding the sterile clinical feeling of hospitals while rejecting frivolous consumer wellness trends.

### Personality & Emotional Response
- **Sovereign Clarity:** The UI feels calm, composed, and razor-sharp. Visual signals immediately clarify routine progression, physical recovery markers, and critical clinical milestones.
- **Biometric Precision:** The visual weight evokes advanced diagnostic hardware, laboratory telemetry, and elite athletic performance dashboards.
- **Tactile Reassurance:** Dark obsidian fields, subtle inner borders, and high-frequency luminescent cyan-teal points foster deep psychological focus and disciplined motivation.

### Design Movement
**Futuristic Dark Glassmorphism with Precision HUD Telemetry**: Deep slate-obsidian backdrops paired with translucent frosted planes (`backdrop-filter: blur(16px)` to `24px`), hairline translucent highlights (`rgba(255, 255, 255, 0.08)`), micro-pill tags, and luminous bio-electric signal accents.

## Colors

The color architecture is built strictly for dark mode, using luminance layering over pure black to preserve organic depth and minimize optic fatigue during early-morning routine reviews.

### Palette Architecture
- **Obsidian & Slate Navy Surfaces:**
  - `Base Canvas`: `#090D16` (Deep void obsidian)
  - `Surface Lowest`: `#0B111E` (Recessed track backgrounds, inactive wells)
  - `Surface Container`: `#0F172A` (Standard card and panel surface)
  - `Surface Raised / Elevated`: `#1E293B` (Floating control overlays, popovers)
- **Primary & Bio-Medical Signals:**
  - `Teal Primary`: `#06B6D4` (High-focus action points, live telemetry readouts, recovery tracking)
  - `Cyan Secondary`: `#14B8A6` (Physical therapy set completion, mobility targets, validated metrics)
  - `Electric Indigo Tertiary`: `#6366F1` (Cognitive modules, neuro-muscular protocols, structural milestones)
  - `Amber / Warm Gold`: `#F59E0B` (Clinical cautions, medication reminders, motivational daily quotes)
- **Neutrals & Alpha Glass Highlights:**
  - `Text Primary`: `#F8FAFC`
  - `Text Secondary`: `#94A3B8`
  - `Text Muted`: `#64748B`
  - `Glass Border Highlight`: `rgba(255, 255, 255, 0.08)`
  - `Glass Hover Highlight`: `rgba(255, 255, 255, 0.16)`
  - `Glow Primary Soft`: `rgba(6, 182, 212, 0.15)`

## Typography

The typographic hierarchy uses three specialized typefaces to convey distinct layers of information:

1. **Space Grotesk (Display & Section Headers):** High-character, sharp geometric grotesque imparting executive poise, forward-looking intent, and clinical precision.
2. **Manrope (Body & Clinical Instructions):** Ultra-legible contemporary sans-serif engineered for effortless scanning of therapy steps, rehabilitation guidance, and clinical summaries.
3. **JetBrains Mono (Telemetry, Micro-Pills, & Timestamps):** Monospaced diagnostic precision for heart-rate metrics, set/rep counters, range-of-motion angles, and status badges.

All headlines utilize tight negative tracking (`-0.01em` to `-0.03em`) to anchor the page, while technical badges use expanded tracking (`+0.04em` to `+0.08em`) for immediate peripheral identification.

## Layout & Spacing

The layout operates on an 8px modular baseline system optimized for vertical daily progression feeds, multi-metric split grids, and mobile thumb ergonomics.

### Screen Adaptations
- **Mobile (Up to 640px):** Single-column stack. Content margins standard at `16px` (`1rem`). Sticky telemetry micro-header at top, fixed rapid-action therapy bar pinned to bottom.
- **Tablet (641px - 1024px):** 2-column asymmetric grid. Column 1 (60%): Day sequence, prescribed mobility blocks. Column 2 (40%): Biometrics, amber focus quotes, hydration and recovery counters.
- **Desktop (1025px and up):** 12-column layout capped at `1152px` (`72rem`), centered with `24px` gutters. Enables a 3-tier presentation:
  1. *Left Wing (3 cols):* Daily index, compliance streaks, Franco's core vitals.
  2. *Center Core (6 cols):* Daily protocol feed, dynamic PT exercise cards, interactive timers.
  3. *Right Wing (3 cols):* Clinical notes, doctor/therapist directives, reflection input.

## Elevation & Depth

Visual depth is achieved through optical filtration, selective translucent borders, and bio-luminescent diffusion rather than muddy opaque drop shadows.

### Glassmorphism & Surface Stacking
- **Level 0 (Basebed):** Solid `#090D16`. Background noise texture set to 2% opacity provides subtle tactile ground.
- **Level 1 (Card Canvas):** Semi-translucent `#0F172A` at 70% opacity with `backdrop-filter: blur(20px)`. Border is a crisp 1px stroke of `rgba(255, 255, 255, 0.08)`.
- **Level 2 (Interactive Modules & Stat Cells):** Background `#1E293B` at 60% opacity with 1px border `rgba(255, 255, 255, 0.12)`. Casts an ambient cyan/indigo shadow: `0 8px 32px rgba(6, 182, 212, 0.06)`.
- **Level 3 (Modals, Overlays, Active Timers):** High-density glass `#0F172A` at 92% opacity, `backdrop-filter: blur(32px)`, perimeter highlight `rgba(6, 182, 212, 0.3)`, with deep ambient lift: `0 20px 48px rgba(0, 0, 0, 0.6)`.

### Optical Edge Lighting
Cards feature a faux-specular top highlight using a linear gradient: `linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 100%)` along the outer border, giving each container the physical feel of precision-milled obsidian glass.

## Shapes

The design language balances architectural discipline with biometric fluidness through consistent medium-radius geometry (`roundedness: 2`).

- **Stat & Protocol Containers:** Standard radius of `16px` (`rounded-2xl` in standard utility scales; `rounded-lg` in token space) creates clean modularity.
- **Micro-Pills & Badges:** Full continuous pill curvature (`9999px`) to emphasize their role as high-status status indicators and clickable filters.
- **Input Fields & Form Elements:** `12px` border radius with inset depth.
- **Progress Trackers & Gauges:** Smooth rounded terminal caps (`stroke-linecap: round`) paired with nested pill indicators for active repetition nodes.

## Components

### Buttons
- **Primary Clinical Action:** Background is a vibrant linear gradient from `#06B6D4` to `#14B8A6`. Label in bold `#090D16` or `#0F172A` Space Grotesk. Hover triggers a subtle radial glow `box-shadow: 0 0 24px rgba(6, 182, 212, 0.45)`. Active state drops scale to `0.98`.
- **Secondary Protocol Button:** Obsidian glass background `#0F172A` (60% alpha), 1px border `rgba(255, 255, 255, 0.12)`, text `#F8FAFC`. On hover, border turns into `#06B6D4` with `rgba(6, 182, 212, 0.1)` background tint.
- **Tertiary Utility Button:** Transparent background, text `#94A3B8`, icon-driven with micro-interaction hover shift.

### Micro-Pills & Metric Tags
- Height: `24px` to `28px`. Padding: `0 10px`.
- Typography: `JetBrains Mono`, 10px or 11px uppercase with `0.06em` letter-spacing.
- Structure: Translucent backings keyed to status:
  - *Active / Ready:* Teal tint (`rgba(6, 182, 212, 0.12)`), text `#06B6D4`, border `rgba(6, 182, 212, 0.25)`.
  - *Therapy Focus:* Indigo tint (`rgba(99, 102, 241, 0.12)`), text `#818CF8`, border `rgba(99, 102, 241, 0.25)`.
  - *Medical / Quote / Warning:* Amber tint (`rgba(245, 158, 11, 0.12)`), text `#F59E0B`, border `rgba(245, 158, 11, 0.25)`.

### Polished Stat Cards
- Enclosed frosted glass container (`#0F172A` at 65% opacity, `backdrop-blur: 20px`).
- Top-right corner displays a micro-pill with a telemetry icon (e.g., heart rate, ROM angle, sets left).
- Center displays prominent numerical value in `Space Grotesk` (32px-40px, `#F8FAFC`) with trailing unit metric in `#64748B`.
- Bottom features a continuous micro-sparkline or segmented completion bar with luminous teal fill.

### Daily Physical Therapy Routine Cards
- Multi-state interactive row:
  - Unchecked: `#0F172A` with muted slate typography.
  - Active: Outlined in `#06B6D4` with inner glow, prominent exercise demonstration preview, rep/set stepper, and real-time rest timer.
  - Completed: Opacity drops to 75%, accent changes to `#14B8A6`, and exercise title gains a subtle strike-through with an active check indicator.

### Input Fields & Sliders (Pain & Mobility Log)
- Inputs feature recessed dark fills (`#0B111E`), inset shadow, and 1px border `rgba(255, 255, 255, 0.08)`.
- Focus state activates an electric cyan hairline border and ambient focus ring (`0 0 0 2px rgba(6, 182, 212, 0.2)`).
- Sliders feature a 6px slate rail with active glow segment in `#06B6D4` and a frosted glass circular thumb handle (`20px`) bounded by a solid cyan core.

### Daily Amber Quote Container
- Border-left accent: `3px solid #F59E0B`.
- Background: `linear-gradient(90deg, rgba(245, 158, 11, 0.08) 0%, rgba(15, 23, 42, 0.4) 100%)`.
- Typography: `Space Grotesk` italic medium (`#F8FAFC`), accompanied by a micro mono label indicating the clinician or philosophical source.