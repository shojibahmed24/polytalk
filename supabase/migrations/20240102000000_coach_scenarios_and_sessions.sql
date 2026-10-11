-- 20240102000000_coach_scenarios_and_sessions.sql
-- Complete AI Language Coach schema migration

-- 1. SCENARIOS TABLE
create table if not exists public.coach_scenarios (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  category text not null default 'General',
  target_language text not null default 'all',
  ai_role text not null default 'AI Language Coach',
  user_role text not null default 'Learner',
  proficiency_levels text[] not null default '{"A1","A2","B1","B2","C1","C2"}'::text[],
  system_prompt text,
  suggested_responses text[] not null default '{}'::text[],
  is_active boolean not null default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.coach_scenarios enable row level security;
drop policy if exists "Active coach scenarios are readable by all" on public.coach_scenarios;
create policy "Active coach scenarios are readable by all" on public.coach_scenarios
  for select using (is_active = true);

-- 2. SESSIONS TABLE
create table if not exists public.coach_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  scenario_id uuid references public.coach_scenarios(id) on delete set null,
  target_language text not null default 'English',
  proficiency_level text not null default 'A2-B1',
  status text not null default 'active' check (status in ('active', 'completed', 'paused')),
  settings jsonb not null default '{}'::jsonb,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.coach_sessions enable row level security;
drop policy if exists "Users can manage own coach sessions" on public.coach_sessions;
create policy "Users can manage own coach sessions" on public.coach_sessions
  for all using (auth.uid() = user_id);

create index if not exists idx_coach_sessions_user_id on public.coach_sessions(user_id);
create index if not exists idx_coach_sessions_scenario_id on public.coach_sessions(scenario_id);

-- 3. MESSAGES TABLE
create table if not exists public.coach_messages (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.coach_sessions(id) on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  input_type text not null default 'text' check (input_type in ('text', 'voice')),
  audio_path text,
  translation text,
  correction text,
  explanation text,
  pronunciation_score numeric,
  provider_metadata jsonb not null default '{}'::jsonb,
  idempotency_key text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.coach_messages enable row level security;
drop policy if exists "Users can manage own coach messages" on public.coach_messages;
create policy "Users can manage own coach messages" on public.coach_messages
  for all using (auth.uid() = user_id);

create index if not exists idx_coach_messages_session_id on public.coach_messages(session_id);
create index if not exists idx_coach_messages_user_id on public.coach_messages(user_id);
create index if not exists idx_coach_messages_idempotency_key on public.coach_messages(idempotency_key);
create index if not exists idx_coach_messages_created_at on public.coach_messages(created_at);

-- 4. SESSION STATS TABLE
create table if not exists public.coach_session_stats (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.coach_sessions(id) on delete cascade not null unique,
  user_id uuid references auth.users on delete cascade not null,
  total_messages integer not null default 0,
  practice_duration_seconds integer not null default 0,
  vocabulary_count integer not null default 0,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.coach_session_stats enable row level security;
drop policy if exists "Users can manage own coach stats" on public.coach_session_stats;
create policy "Users can manage own coach stats" on public.coach_session_stats
  for all using (auth.uid() = user_id);

create index if not exists idx_coach_session_stats_user_id on public.coach_session_stats(user_id);

-- 5. VOCABULARY TABLE
create table if not exists public.coach_vocabulary (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  word text not null,
  translation text not null,
  context_sentence text,
  language text not null default 'en',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.coach_vocabulary enable row level security;
drop policy if exists "Users can manage own coach vocabulary" on public.coach_vocabulary;
create policy "Users can manage own coach vocabulary" on public.coach_vocabulary
  for all using (auth.uid() = user_id);

create index if not exists idx_coach_vocabulary_user_id on public.coach_vocabulary(user_id);

-- Realtime publications
alter publication supabase_realtime add table public.coach_sessions;
alter publication supabase_realtime add table public.coach_messages;

-- SEED DEFAULT SCENARIOS
insert into public.coach_scenarios (
  id,
  title,
  description,
  category,
  target_language,
  ai_role,
  user_role,
  proficiency_levels,
  system_prompt,
  suggested_responses,
  is_active
) values 
(
  'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d',
  'Ordering at a Diner & Bistro',
  'Practice ordering food and drinks, asking about the menu specials, and handling the check in a bustling bistro.',
  'Dining',
  'all',
  'Waiter / Server',
  'Customer',
  '{"A2","B1"}',
  'You are a polite, attentive waiter at a friendly bistro. Welcome the guest warmly, take their drink or food order, answer questions about dishes, and ask natural follow-up questions. Keep responses concise (2-3 sentences max) to encourage the learner to speak. If the user makes grammatical or phrasing mistakes, gently weave the correction into your feedback note.',
  '{"Can I have the menu?", "I''ll have a coffee.", "No, thank you, that is all."}',
  true
),
(
  'b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e',
  'Checking into a Boutique Hotel',
  'Communicate with the front desk concierge, confirm room amenities, ask for local tips, and check in smoothly.',
  'Travel',
  'all',
  'Front Desk Concierge',
  'Hotel Guest',
  '{"A2","B1","B2"}',
  'You are the concierge at a boutique city hotel. Help the guest with check-in, verify reservation details, explain breakfast hours and amenities, and offer local recommendations.',
  '{"I have a reservation under my name.", "What time is breakfast served?", "Can I request a late checkout?"}',
  true
),
(
  'c3d4e5f6-a1b2-4c3d-ae4f-5a6b7c8d9e0f',
  'Asking for Street Directions',
  'Navigate an unfamiliar neighborhood by asking a friendly local for directions to nearby landmarks.',
  'City Life',
  'all',
  'Friendly Local Passerby',
  'Lost Traveler',
  '{"A1","A2"}',
  'You are a friendly local on a downtown street. Help the traveler find their destination with clear, simple landmarks, directions (left, right, straight ahead), and approximate walking times.',
  '{"Excuse me, where is the nearest station?", "How far is the museum from here?", "Is there a pharmacy nearby?"}',
  true
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description,
  suggested_responses = excluded.suggested_responses,
  system_prompt = excluded.system_prompt;
