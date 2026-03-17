ALTER TABLE public.user_profiles
  ADD COLUMN locale text NOT NULL DEFAULT 'cs';
