# Stripe Setup Guide

This guide walks you through configuring Stripe to work with the SaaS starter.

## 1. Create a Stripe Account

If you don't have one already, sign up at [dashboard.stripe.com](https://dashboard.stripe.com).

## 2. Get Your API Keys

1. Go to **Developers → API keys** in the Stripe Dashboard
2. Copy the **Publishable key** (starts with `pk_test_`) → set as `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in `.env.local`
3. Copy the **Secret key** (starts with `sk_test_`) → set as `STRIPE_SECRET_KEY` in `.env.local`

> Make sure you're in **Test mode** (toggle in the top-right corner) during development.

## 3. Create Products and Prices

You need to create products matching the plans defined in `lib/stripe/config.ts`.

### In the Stripe Dashboard:

1. Go to **Product catalog → + Add product**

2. **Free plan** (optional — skip if free tier doesn't need Stripe tracking):
   - Name: `Free`
   - Pricing: Recurring, CZK 0 / month
   - Copy the Price ID (starts with `price_`) and update `stripePriceId` for the `free` plan in `lib/stripe/config.ts`

3. **Pro plan**:
   - Name: `Pro`
   - Description: `For professionals and growing teams`
   - Pricing: Recurring, **499 CZK / month**
   - Currency: CZK
   - Billing period: Monthly
   - Click **Save product**
   - Copy the Price ID → update `stripePriceId` for the `pro` plan in `lib/stripe/config.ts`

4. **Enterprise plan**:
   - Name: `Enterprise`
   - Description: `For large organizations`
   - Pricing: Recurring, **1 999 CZK / month**
   - Currency: CZK
   - Billing period: Monthly
   - Click **Save product**
   - Copy the Price ID → update `stripePriceId` for the `enterprise` plan in `lib/stripe/config.ts`

## 4. Set Up the Customer Portal

The billing portal lets users manage their subscription (cancel, upgrade, view invoices).

1. Go to **Settings → Billing → Customer portal** (or search "Customer portal" in the dashboard)
2. Under **Functionality**, enable:
   - **Invoices** — allow customers to view invoice history
   - **Cancel subscriptions** — choose whether to cancel immediately or at end of billing period (recommended: at end of period)
   - **Switch plans** — enable if you want users to upgrade/downgrade between Pro and Enterprise
3. Under **Products**, add the Pro and Enterprise products so they appear as switchable options
4. Under **Business information**, fill in:
   - Your business name
   - Terms of service URL
   - Privacy policy URL
5. Click **Save changes**

## 5. Set Up Webhooks (for Issue #9)

> This is out of scope for the current issue, but here's the preview:

1. Go to **Developers → Webhooks → Add endpoint**
2. Endpoint URL: `https://your-domain.com/api/webhooks/stripe`
3. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy the **Webhook signing secret** (starts with `whsec_`) → set as `STRIPE_WEBHOOK_SECRET` in `.env.local`

### For local development:

Use the Stripe CLI to forward webhooks to your local server:

```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

The CLI will output a webhook signing secret for local use.

## 6. Environment Variables Summary

Add these to your `.env.local`:

```env
# Already set (from Stripe Dashboard → Developers → API keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Set after creating webhook endpoint (Issue #9)
STRIPE_WEBHOOK_SECRET=whsec_...
```

## 7. Testing the Integration

1. Start the dev server: `npm run dev`
2. Sign up / log in as a test user
3. Trigger a checkout (once the pricing page is built in Issue #10)
4. Use [Stripe test cards](https://stripe.com/docs/testing#cards):
   - **Success**: `4242 4242 4242 4242`
   - **Requires authentication**: `4000 0025 0000 3155`
   - **Declined**: `4000 0000 0000 9995`
5. Check the Stripe Dashboard → **Payments** to verify the test payment appeared
6. Check your Supabase `subscriptions` table to verify the record was created/updated

## 8. Going to Production

Before going live:

1. Switch Stripe to **Live mode** in the dashboard
2. Create the same products/prices in live mode (they have different IDs!)
3. Update environment variables in Vercel with live keys
4. Set up a live webhook endpoint pointing to your production URL
5. Update `stripePriceId` values in `lib/stripe/config.ts` for production (or use environment variables)
