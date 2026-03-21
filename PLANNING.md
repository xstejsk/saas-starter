# Project Planning

Use this file to plan your SaaS application before writing code.

## Product

**Name:** _Your product name (replace ACME everywhere)_
**One-liner:** _What does this product do?_
**Target user:** _Who is this for?_

## Subscription Tiers

Define your pricing in `lib/stripe/config.ts`. Create matching Price objects in Stripe dashboard.

| Plan | Monthly Price | What's Included |
|------|--------------|-----------------|
| Free | $0 | _..._ |
| Pro | $X/mo | _..._ |
| Enterprise | $X/mo | _..._ |

## Routes

### Public (marketing)
- `/` — Landing page
- `/pricing` — Pricing page

### Protected (requires login)
- `/dashboard` — Main dashboard
- `/dashboard/settings` — Account settings
- `/dashboard/billing` — Subscription management

### Protected (requires active subscription)
Configure in `lib/stripe/config.ts` → `PROTECTED_ROUTES`.
- `/dashboard/app` — _Your core app feature_
- `/dashboard/app/...` — _Additional app routes_

## Database Tables

The starter includes `user_profiles` and `subscriptions`. Add your domain tables below.

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| _your_table_ | _..._ | _..._ |

Remember: every table needs `id (uuid)`, `user_id (uuid FK)`, `created_at`, RLS policies, and a migration file.

## i18n Keys

All user-facing strings go in `/messages/cs.json` and `/messages/en.json`.
Primary language is Czech, English mirrors all keys.

## Open Questions

- _List anything you need to decide before building_
