import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe/client'
import { PLANS } from '@/lib/stripe/config'
import { createServiceClient } from '@/lib/supabase/service'

export const runtime = 'nodejs'

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
    // No user_id — can only update an existing row
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

function handleSubscriptionChange(subscription: Stripe.Subscription): Promise<void> {
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

function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  const customerId = resolveCustomerId(subscription.customer)

  return upsertSubscription(customerId, null, {
    status: 'canceled',
  })
}

function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
  if (!invoice.customer) return Promise.resolve()
  const customerId = resolveCustomerId(invoice.customer)

  return upsertSubscription(customerId, null, {
    status: 'active',
  })
}

function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  if (!invoice.customer) return Promise.resolve()
  const customerId = resolveCustomerId(invoice.customer)

  return upsertSubscription(customerId, null, {
    status: 'past_due',
  })
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Webhook signature verification failed:', message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
      await handleSubscriptionChange(event.data.object as Stripe.Subscription)
      break
    case 'customer.subscription.deleted':
      await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
      break
    case 'invoice.payment_succeeded':
      await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice)
      break
    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice)
      break
    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
