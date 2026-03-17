import type Stripe from 'stripe'
import { PLANS } from './config'
import { createServiceClient } from '@/lib/supabase/service'

function resolveCustomerId(customer: string | Stripe.Customer | Stripe.DeletedCustomer): string {
  return typeof customer === 'string' ? customer : customer.id
}

function resolvePlanId(priceId: string): string | null {
  const plan = PLANS.find((p) => p.stripePriceId === priceId)
  return plan?.id ?? null
}

async function upsertSubscription(
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

export function handleSubscriptionChange(subscription: Stripe.Subscription): Promise<void> {
  const customerId = resolveCustomerId(subscription.customer)
  const userId = (subscription.metadata?.supabase_user_id as string) ?? null
  const item = subscription.items.data[0]
  const priceId = item?.price.id
  const planId = priceId ? resolvePlanId(priceId) : null
  const periodEnd = item?.current_period_end

  return upsertSubscription(customerId, userId, {
    stripe_subscription_id: subscription.id,
    status: subscription.status,
    plan_id: planId,
    current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
  })
}

export function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  const customerId = resolveCustomerId(subscription.customer)

  return upsertSubscription(customerId, null, {
    status: 'canceled',
  })
}

export function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
  if (!invoice.customer) return Promise.resolve()
  const customerId = resolveCustomerId(invoice.customer)

  return upsertSubscription(customerId, null, {
    status: 'active',
  })
}

export function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  if (!invoice.customer) return Promise.resolve()
  const customerId = resolveCustomerId(invoice.customer)

  return upsertSubscription(customerId, null, {
    status: 'past_due',
  })
}

export async function handleNewSubscription(subscription: Stripe.Subscription): Promise<void> {
  const { sendWelcomeEmail } = await import('@/lib/resend/send')

  await handleSubscriptionChange(subscription)

  const userId = (subscription.metadata?.supabase_user_id as string) ?? null
  if (!userId) return

  const supabase = createServiceClient()
  const { data: profile } = await (
    supabase.from('user_profiles' as string) as ReturnType<typeof supabase.from>
  )
    .select('email, locale')
    .eq('id', userId)
    .single()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (profile?.email && siteUrl) {
    await sendWelcomeEmail(
      profile.email as string,
      (profile.locale as string) ?? 'cs',
      `${siteUrl}/dashboard`,
    )
  }
}
