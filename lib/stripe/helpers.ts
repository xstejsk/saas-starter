import { getStripe } from './client'
import { getAuthUser } from '@/lib/db/auth'
import {
  getSubscriptionByUserId,
  getSubscriptionCustomerId,
  upsertSubscriptionAsService,
} from '@/lib/db/subscriptions'

async function getOrCreateStripeCustomer(userId: string, email: string): Promise<string> {
  const existingCustomerId = await getSubscriptionCustomerId(userId)

  if (existingCustomerId) {
    return existingCustomerId
  }

  // Create a new Stripe customer
  const customer = await getStripe().customers.create({
    email,
    metadata: { supabase_user_id: userId },
  })

  // Store the customer ID — use service client to bypass RLS (only SELECT is allowed for users)
  await upsertSubscriptionAsService(userId, {
    stripe_customer_id: customer.id,
    status: 'incomplete',
  })

  return customer.id
}

export async function createCheckoutSession(
  userId: string,
  priceId: string,
  returnUrl: string,
): Promise<string> {
  const user = await getAuthUser()

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
  const user = await getAuthUser()
  if (!user) return null

  const subscription = await getSubscriptionByUserId(user.id)

  if (subscription?.status === 'active') {
    return subscription.plan_id
  }

  return null
}
