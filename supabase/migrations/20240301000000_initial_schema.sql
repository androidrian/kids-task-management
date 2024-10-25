-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  username text unique,
  full_name text,
  avatar_url text,
  child_name text,
  
  constraint username_length check (char_length(username) >= 3)
);

-- Create tasks table
create table tasks (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  points integer not null,
  completed boolean default false,
  user_id uuid references profiles(id) on delete cascade not null
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;
alter table tasks enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Tasks policies
create policy "Tasks are viewable by owner."
  on tasks for select
  using ( auth.uid() = user_id );

create policy "Tasks are insertable by owner."
  on tasks for insert
  with check ( auth.uid() = user_id );

create policy "Tasks are updatable by owner."
  on tasks for update
  using ( auth.uid() = user_id );

create policy "Tasks are deletable by owner."
  on tasks for delete
  using ( auth.uid() = user_id );

-- Create functions
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, username)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email
  );
  return new;
end;
$$;

-- Create trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();