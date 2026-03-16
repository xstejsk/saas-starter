-- Add unique constraints for upsert support
alter table public.subscriptions
  add constraint subscriptions_user_id_key unique (user_id);

alter table public.subscriptions
  add constraint subscriptions_stripe_customer_id_key unique (stripe_customer_id);
