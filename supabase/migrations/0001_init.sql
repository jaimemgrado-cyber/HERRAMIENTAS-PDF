-- ============================================================================
-- PDF Tools — migración inicial: perfiles, uso diario, RLS y funciones RPC.
--
-- CÓMO EJECUTAR: copia y pega el contenido completo de este archivo en
-- Supabase Dashboard → SQL Editor → New query → Run. También puedes usar
-- `supabase db push` con la CLI de Supabase si gestionas migraciones así.
--
-- Es seguro volver a ejecutar este script (usa IF NOT EXISTS / OR REPLACE /
-- DROP POLICY IF EXISTS donde corresponde), pero está pensado para
-- ejecutarse UNA VEZ sobre una base de datos nueva.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. TABLAS
-- ----------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  subscription_status text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is
  'Un perfil por usuario de auth.users. plan/stripe_* solo se escriben desde '
  'el servidor (webhook de Stripe o funciones RPC con SECURITY DEFINER), '
  'nunca directamente por el cliente.';

create table if not exists public.usage_daily (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  usage_date date not null,
  operations integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, usage_date)
);

comment on table public.usage_daily is
  'Contador de operaciones PDF completadas por usuario y día (UTC). Se '
  'reinicia automáticamente cada día porque cada fecha es una fila nueva; '
  'no hace falta ningún job de limpieza.';

create index if not exists usage_daily_user_id_idx on public.usage_daily (user_id);
create index if not exists usage_daily_usage_date_idx on public.usage_daily (usage_date);
create index if not exists profiles_stripe_customer_id_idx on public.profiles (stripe_customer_id);
create index if not exists profiles_stripe_subscription_id_idx on public.profiles (stripe_subscription_id);

-- ----------------------------------------------------------------------------
-- 2. updated_at automático
-- ----------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists usage_daily_set_updated_at on public.usage_daily;
create trigger usage_daily_set_updated_at
  before update on public.usage_daily
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- 3. Crear perfil automáticamente al registrarse (trigger sobre auth.users)
-- ----------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, plan)
  values (new.id, new.email, 'free')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 4. Row Level Security
--
-- Solo se define política de SELECT ("ver mis propios datos"). NO se define
-- ninguna política de INSERT/UPDATE/DELETE para los roles anon/authenticated:
-- con RLS activado, la ausencia de política para una operación deniega esa
-- operación por defecto. Esto significa que ningún usuario puede escribir en
-- estas tablas directamente desde el cliente; toda escritura pasa por:
--   - las funciones RPC de abajo (SECURITY DEFINER, con sus propias
--     comprobaciones de auth.uid()), o
--   - el cliente con la service_role key (solo el webhook de Stripe, que
--     además omite RLS por completo).
-- ----------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.usage_daily enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can view own usage" on public.usage_daily;
create policy "Users can view own usage"
  on public.usage_daily for select
  using (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 5. RPC: consume_operation
--
-- Comprueba el límite diario del usuario autenticado (según su plan real en
-- profiles.plan, NUNCA según lo que diga el cliente) e incrementa el
-- contador de forma atómica en la MISMA transacción mediante un bloqueo de
-- fila (`for update`), evitando condiciones de carrera si el usuario hace
-- doble clic o hay varias pestañas abiertas.
--
-- Los límites numéricos (p_free_limit, p_pro_limit) los pasa el servidor de
-- Next.js desde PLAN_LIMITS (src/lib/plan-limits.ts), que sigue siendo la
-- única fuente de verdad de los NÚMEROS. Esta función es la única fuente de
-- verdad de A QUÉ PLAN pertenece el usuario (lee profiles.plan, columna que
-- solo actualiza el webhook de Stripe).
-- ----------------------------------------------------------------------------

create or replace function public.consume_operation(
  p_free_limit integer,
  p_pro_limit integer
)
returns table (
  allowed boolean,
  plan text,
  used integer,
  remaining integer,
  daily_limit integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_plan text;
  v_limit integer;
  v_today date := (now() at time zone 'utc')::date;
  v_used integer;
begin
  if v_user_id is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  select p.plan into v_plan from public.profiles p where p.id = v_user_id;
  if v_plan is null then
    v_plan := 'free';
  end if;

  v_limit := case when v_plan = 'pro' then p_pro_limit else p_free_limit end;

  -- Asegura que existe la fila de hoy antes de bloquearla.
  insert into public.usage_daily (user_id, usage_date, operations)
  values (v_user_id, v_today, 0)
  on conflict (user_id, usage_date) do nothing;

  -- Bloquea la fila del día para que dos peticiones simultáneas del mismo
  -- usuario no puedan leer el mismo "used" y colarse ambas por debajo del
  -- límite.
  select u.operations into v_used
  from public.usage_daily u
  where u.user_id = v_user_id and u.usage_date = v_today
  for update;

  if v_used >= v_limit then
    return query select false, v_plan, v_used, 0, v_limit;
    return;
  end if;

  update public.usage_daily u
  set operations = u.operations + 1
  where u.user_id = v_user_id and u.usage_date = v_today
  returning u.operations into v_used;

  return query select true, v_plan, v_used, greatest(v_limit - v_used, 0), v_limit;
end;
$$;

revoke execute on function public.consume_operation(integer, integer) from public;
grant execute on function public.consume_operation(integer, integer) to authenticated;

-- ----------------------------------------------------------------------------
-- 6. RPC: set_stripe_customer_id
--
-- Permite que la ruta /api/stripe/checkout (con la sesión del usuario, sin
-- necesitar la service_role key) asocie un Stripe Customer recién creado a
-- su propio perfil.
-- ----------------------------------------------------------------------------

create or replace function public.set_stripe_customer_id(p_customer_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  update public.profiles
  set stripe_customer_id = p_customer_id
  where id = auth.uid();
end;
$$;

revoke execute on function public.set_stripe_customer_id(text) from public;
grant execute on function public.set_stripe_customer_id(text) to authenticated;

-- ============================================================================
-- Fin de la migración.
-- ============================================================================
