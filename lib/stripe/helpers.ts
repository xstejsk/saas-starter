import { getStripe } from './client'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import type { Subscription } from '@/types'

async function getOrCreateStripeCustomer(userId: string, email: string): Promise<string> {
  const supabase = await createClient()

  // Check if user already has a Stripe customer ID
  // TODO: Remove type assertions once Supabase Database types are generated
  const { data: subscription } = (await supabase
    .from('subscriptions' as string)
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single()) as { data: { stripe_customer_id: string } | null }

  if (subscription?.stripe_customer_id) {
    return subscription.stripe_customer_id
  }

  // Create a new Stripe customer
  const customer = await getStripe().customers.create({
    email,
    metadata: { supabase_user_id: userId },
  })

  // Store the customer ID — use service client to bypass RLS (only SELECT is allowed for users)
  const serviceClient = createServiceClient()
  await (
    serviceClient.from('subscriptions' as string) as ReturnType<typeof serviceClient.from>
  ).upsert(
    {
      user_id: userId,
      stripe_customer_id: customer.id,
      status: 'incomplete',
    } as Record<string, unknown>,
    { onConflict: 'user_id' },
  )

  return customer.id
}

export async function createCheckoutSession(
  userId: string,
  priceId: string,
  returnUrl: string,
): Promise<string> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.id !== userId) {
    throw new Error('Unauthorized')
  }

  const customerId = await getOrCreateStripeCustomer(userId, user.email!)

  const session = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${returnUrl}?success=true`,
    cancel_url: `${returnUrl}?canceled=true`,
    subscription_data: {
      metadata: { supabase_user_id: userId },
    },
  })

  if (!session.url) {
    throw new Error('Failed to create checkout session')
  }

  return session.url
}

export async function createBillingPortalSession(
  customerId: string,
  returnUrl: string,
): Promise<string> {
  const session = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  })

  return session.url
}

export async function getCurrentPlanId(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Query directly to reuse the same supabase client instead of creating another via getSubscriptionByUserId
  const { data } = (await supabase
    .from('subscriptions' as string)
    .select('*')
    .eq('user_id', user.id)
    .single()) as { data: Subscription | null }

  if (data?.status === 'active') {
    return data.plan_id
  }

  return null
}

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
