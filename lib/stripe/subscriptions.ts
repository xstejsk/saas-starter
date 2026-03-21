import type Stripe from 'stripe'
import { PLANS } from './config'
import { upsertSubscriptionByCustomerAsService } from '@/lib/db/subscriptions'
import { getProfileEmailAndLocaleAsService } from '@/lib/db/profiles'

function resolveCustomerId(customer: string | Stripe.Customer | Stripe.DeletedCustomer): string {
  return typeof customer === 'string' ? customer : customer.id
}

function resolvePlanId(priceId: string): string | null {
  const plan = PLANS.find((p) => p.stripePriceId === priceId)
  return plan?.id ?? null
}

export function handleSubscriptionChange(subscription: Stripe.Subscription): Promise<void> {
  const customerId = resolveCustomerId(subscription.customer)
  const userId = (subscription.metadata?.supabase_user_id as string) ?? null
  const item = subscription.items.data[0]
  const priceId = item?.price.id
  const planId = priceId ? resolvePlanId(priceId) : null
  const periodEnd = item?.current_period_end

  return upsertSubscriptionByCustomerAsService(customerId, userId, {
    stripe_subscription_id: subscription.id,
    status: subscription.status,
    plan_id: planId,
    current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
  })
}

export function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  const customerId = resolveCustomerId(subscription.customer)

  return upsertSubscriptionByCustomerAsService(customerId, null, {
    status: 'canceled',
  })
}

export function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
  if (!invoice.customer) return Promise.resolve()
  const customerId = resolveCustomerId(invoice.customer)

  return upsertSubscriptionByCustomerAsService(customerId, null, {
    status: 'active',
  })
}

export function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  if (!invoice.customer) return Promise.resolve()
  const customerId = resolveCustomerId(invoice.customer)

  return upsertSubscriptionByCustomerAsService(customerId, null, {
    status: 'past_due',
  })
}

export async function handleNewSubscription(subscription: Stripe.Subscription): Promise<void> {
  const { sendWelcomeEmail } = await import('@/lib/resend/send')

  await handleSubscriptionChange(subscription)

  const userId = (subscription.metadata?.supabase_user_id as string) ?? null
  if (!userId) return

  const profile = await getProfileEmailAndLocaleAsService(userId)

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (profile?.email && siteUrl) {
    await sendWelcomeEmail(profile.email, profile.locale, `${siteUrl}/dashboard`)
  }
}
