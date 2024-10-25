-- Drop triggers first
drop trigger if exists on_auth_user_created on auth.users;

-- Drop functions
drop function if exists public.handle_new_user();

-- Drop policies
drop policy if exists "Public profiles are viewable by everyone." on profiles;
drop policy if exists "Users can insert their own profile." on profiles;
drop policy if exists "Users can update own profile." on profiles;
drop policy if exists "Tasks are viewable by owner." on tasks;
drop policy if exists "Tasks are insertable by owner." on tasks;
drop policy if exists "Tasks are updatable by owner." on tasks;
drop policy if exists "Tasks are deletable by owner." on tasks;

-- Drop tables (order matters due to foreign key constraints)
drop table if exists tasks;
drop table if exists profiles;