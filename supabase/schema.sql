-- ============================================================
-- Tabla del brief diario
-- Ejecutar en Supabase → SQL Editor → New query → Run
-- ============================================================

create table if not exists public.brief_diario (
  fecha           date primary key,
  ciclo           text,                       -- "Día 4 · Segundo libre"
  ciclo_detalle   text,                       -- "Consultas 09:00–19:00"
  agenda          jsonb not null default '[]'::jsonb,
  ideas           jsonb not null default '[]'::jsonb,
  papers          jsonb not null default '[]'::jsonb,
  noticias        jsonb not null default '[]'::jsonb,
  creado_en       timestamptz not null default now()
);

-- Índice para traer siempre el más reciente rápido
create index if not exists brief_diario_fecha_desc
  on public.brief_diario (fecha desc);

-- ============================================================
-- Seguridad: la página web es pública y solo lee.
-- n8n escribe con la service role key, que ignora RLS.
-- ============================================================

alter table public.brief_diario enable row level security;

drop policy if exists "lectura publica del brief" on public.brief_diario;
create policy "lectura publica del brief"
  on public.brief_diario
  for select
  to anon
  using (true);

-- Nota: no se crea ninguna policy de insert/update para anon.
-- Con la anon key la tabla es de solo lectura.

-- ============================================================
-- Limpieza automática opcional: conservar 90 días de historial.
-- Ejecútalo a mano de vez en cuando, o agrégalo al flujo n8n.
-- ============================================================

-- delete from public.brief_diario where fecha < current_date - 90;
