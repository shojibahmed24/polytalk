-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.profiles enable row level security;
create policy "Users can view own profile." on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile." on public.profiles for update using (auth.uid() = id);

-- Function to handle new user signup
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- CONVERSATIONS
create table public.conversations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  target_language text not null, -- e.g., 'es', 'fr', 'ja'
  difficulty text not null default 'A1', -- e.g., 'A1', 'B2'
  status text not null default 'active', -- 'active', 'completed'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.conversations enable row level security;
create policy "Users can manage their own conversations" on public.conversations
  for all using (auth.uid() = user_id);

-- Create index for faster querying
create index idx_conversations_user_id on public.conversations(user_id);

-- MESSAGES
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.conversations on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null, -- denormalized for easier RLS
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  -- Pedagogical feedback for grammar correction
  pedagogical_type text,
  pedagogical_xp integer default 0,
  original_html text,
  better_html text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.messages enable row level security;
create policy "Users can manage their own messages" on public.messages
  for all using (auth.uid() = user_id);

-- Create index for retrieving conversation messages
create index idx_messages_conversation_id on public.messages(conversation_id);
create index idx_messages_created_at on public.messages(created_at);

-- Set up realtime
alter publication supabase_realtime add table public.conversations;
alter publication supabase_realtime add table public.messages;
