'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import {
  createCheckoutSession,
  createBillingPortalSession,
  getSubscriptionByUserId,
} from '@/lib/stripe/helpers'

const createCheckoutSchema = z.object({
  priceId: z.string().min(1),
  returnUrl: z.url(),
})

export const createCheckout = authActionClient
  .inputSchema(createCheckoutSchema)
  .action(async ({ parsedInput: { priceId, returnUrl }, ctx: { user } }) => {
    const url = await createCheckoutSession(user.id, priceId, returnUrl)
    return { url }
  })

const openBillingPortalSchema = z.object({
  returnUrl: z.url(),
})

export const openBillingPortal = authActionClient
  .inputSchema(openBillingPortalSchema)
  .action(async ({ parsedInput: { returnUrl }, ctx: { user } }) => {
    const subscription = await getSubscriptionByUserId(user.id)

    if (!subscription?.stripe_customer_id) {
      throw new Error('No billing account found')
    }

    const url = await createBillingPortalSession(subscription.stripe_customer_id, returnUrl)
    return { url }
  })
