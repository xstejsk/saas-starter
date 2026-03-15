-- Create subscriptions table
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text,
  status text not null,
  plan_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.subscriptions enable row level security;

-- RLS policy: users can only read their own subscription
create policy "Users can select own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policies for users — only service role writes to this table

-- Auto-update updated_at on row change
create trigger set_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.set_updated_at();
