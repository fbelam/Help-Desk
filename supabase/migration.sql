-- ═══════════════════════════════════════════════════════════════════════════
-- Sahara Support — Migration SQL
-- Execute este script no SQL Editor do Supabase (projeto > SQL Editor > New Query)
-- ═══════════════════════════════════════════════════════════════════════════

-- ─── Extensões ───────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── ENUMS ───────────────────────────────────────────────────────────────────
create type ticket_status    as enum ('Aberto', 'Em Andamento', 'Pendente', 'Concluído');
create type ticket_priority  as enum ('Alta', 'Média', 'Baixa');
create type inventory_status as enum ('Em Uso', 'Disponível', 'Manutenção', 'Reservado');
create type user_role        as enum ('admin', 'technician_l1', 'technician_l2', 'requester');

-- ─── PROFILES ────────────────────────────────────────────────────────────────
-- Estende auth.users com dados de perfil da aplicação
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text        not null,
  email       text        not null unique,
  role        user_role   not null default 'requester',
  cargo       text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Trigger: criar perfil automaticamente ao registrar usuário
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    'requester'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── TICKETS ─────────────────────────────────────────────────────────────────
create table public.tickets (
  id            uuid primary key default uuid_generate_v4(),
  subject       text           not null,
  category      text           not null,
  description   text           not null,
  priority      ticket_priority not null default 'Média',
  status        ticket_status  not null default 'Aberto',
  sla_deadline  timestamptz,
  requester_id  uuid           not null references public.profiles(id),
  assigned_to   uuid           references public.profiles(id),
  created_at    timestamptz    not null default now(),
  updated_at    timestamptz    not null default now()
);

-- Trigger: atualizar updated_at automaticamente
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger tickets_updated_at
  before update on public.tickets
  for each row execute function public.set_updated_at();

-- ─── TICKET NOTES ────────────────────────────────────────────────────────────
create table public.ticket_notes (
  id         uuid primary key default uuid_generate_v4(),
  ticket_id  uuid        not null references public.tickets(id) on delete cascade,
  content    text        not null,
  author_id  uuid        not null references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ─── INVENTORY ITEMS ─────────────────────────────────────────────────────────
create table public.inventory_items (
  id             uuid primary key default uuid_generate_v4(),
  asset_tag      text             not null unique,  -- Ex: #INV-1024
  name           text             not null,
  category       text             not null,
  location       text             not null,
  status         inventory_status not null default 'Disponível',
  last_revision  date,
  created_at     timestamptz      not null default now(),
  updated_at     timestamptz      not null default now()
);

create trigger inventory_items_updated_at
  before update on public.inventory_items
  for each row execute function public.set_updated_at();

-- ─── ÍNDICES ─────────────────────────────────────────────────────────────────
create index idx_tickets_status       on public.tickets(status);
create index idx_tickets_priority     on public.tickets(priority);
create index idx_tickets_assigned_to  on public.tickets(assigned_to);
create index idx_tickets_requester_id on public.tickets(requester_id);
create index idx_ticket_notes_ticket  on public.ticket_notes(ticket_id);
create index idx_inventory_category   on public.inventory_items(category);
create index idx_inventory_status     on public.inventory_items(status);

-- ═══════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- Protege os dados: cada usuário só acessa o que tem permissão.
-- ═══════════════════════════════════════════════════════════════════════════

alter table public.profiles       enable row level security;
alter table public.tickets        enable row level security;
alter table public.ticket_notes   enable row level security;
alter table public.inventory_items enable row level security;

-- ── Profiles ─────────────────────────────────────────────────────────────────
-- Qualquer usuário autenticado pode ver perfis (para atribuição)
create policy "profiles_select" on public.profiles
  for select to authenticated using (true);

-- Usuário só edita o próprio perfil
create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = auth.uid());

-- ── Tickets ──────────────────────────────────────────────────────────────────
-- Técnicos e admins veem todos; solicitante só vê os seus
create policy "tickets_select" on public.tickets
  for select to authenticated
  using (
    requester_id = auth.uid()
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'technician_l1', 'technician_l2')
    )
  );

-- Qualquer usuário autenticado pode criar chamado
create policy "tickets_insert" on public.tickets
  for insert to authenticated
  with check (requester_id = auth.uid());

-- Técnicos e admins podem atualizar qualquer chamado
create policy "tickets_update" on public.tickets
  for update to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'technician_l1', 'technician_l2')
    )
  );

-- ── Ticket Notes ─────────────────────────────────────────────────────────────
create policy "notes_select" on public.ticket_notes
  for select to authenticated using (true);

create policy "notes_insert" on public.ticket_notes
  for insert to authenticated
  with check (author_id = auth.uid());

-- ── Inventory Items ───────────────────────────────────────────────────────────
-- Todos os autenticados podem ver o inventário
create policy "inventory_select" on public.inventory_items
  for select to authenticated using (true);

-- Somente admins podem criar/editar inventário
create policy "inventory_insert" on public.inventory_items
  for insert to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "inventory_update" on public.inventory_items
  for update to authenticated
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('admin', 'technician_l1', 'technician_l2')
    )
  );

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED DATA — Dados de exemplo para desenvolvimento
-- ═══════════════════════════════════════════════════════════════════════════

-- Inventário de exemplo (não depende de auth.users)
insert into public.inventory_items (asset_tag, name, category, location, status, last_revision) values
  ('#INV-1024', 'MacBook Pro M2',              'Hardware',    'Setor Financeiro',       'Em Uso',      '2023-10-12'),
  ('#INV-1088', 'Roteador Industrial Cisco',   'Rede',        'Sala de Servidores 01',  'Disponível',  '2023-11-05'),
  ('#INV-2041', 'Monitor Dell UltraSharp 27"', 'Periféricos', 'Design Hub',             'Manutenção',  '2023-09-22'),
  ('#INV-0955', 'Licença Adobe Creative Cloud','Software',    'Equipe de Marketing',    'Reservado',   '2023-12-15'),
  ('#INV-1102', 'Nobreak APC 1500VA',          'Elétrica',    'Sala 402',               'Em Uso',      '2024-01-01');
