import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import type { Subscription } from '@/types'

export async function getSubscriptionByUserId(userId: string): Promise<Subscription | null> {
  const supabase = await createClient()

  // TODO: Remove type assertion once Supabase Database types are generated
  const { data, error } = (await supabase
    .from('subscriptions' as string)
    .select('*')
    .eq('user_id', userId)
    .single()) as { data: Subscription | null; error: { message: string } | null }

  if (error || !data) {
    return null
  }

  return data
}

export async function getSubscriptionCustomerId(userId: string): Promise<string | null> {
  const supabase = await createClient()

  const { data } = (await supabase
    .from('subscriptions' as string)
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single()) as { data: { stripe_customer_id: string } | null }

  return data?.stripe_customer_id ?? null
}

/** Service-level upsert (bypasses RLS) — for Stripe customer creation */
export async function upsertSubscriptionAsService(
  userId: string,
  fields: Record<string, unknown>,
): Promise<void> {
  const supabase = createServiceClient()

  await (supabase.from('subscriptions' as string) as ReturnType<typeof supabase.from>).upsert(
    {
      user_id: userId,
      ...fields,
    } as Record<string, unknown>,
    { onConflict: 'user_id' },
  )
}

/** Service-level upsert by customer ID or user ID (bypasses RLS) — for webhook handlers */
export async function upsertSubscriptionByCustomerAsService(
  customerId: string,
  userId: string | null,
  fields: Record<string, unknown>,
): Promise<void> {
  const supabase = createServiceClient()

  if (!userId) {
    const { error } = await (
      supabase.from('subscriptions' as string) as ReturnType<typeof supabase.from>
    )
      .update(fields)
      .eq('stripe_customer_id', customerId)

    if (error) {
      console.error('Failed to update subscription:', error.message)
    }
    return
  }

  const { error } = await (
    supabase.from('subscriptions' as string) as ReturnType<typeof supabase.from>
  ).upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      ...fields,
    } as Record<string, unknown>,
    { onConflict: 'user_id' },
  )

  if (error) {
    console.error('Failed to upsert subscription:', error.message)
  }
}
