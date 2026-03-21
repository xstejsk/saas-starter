# SaaS Starter

A production-ready Next.js SaaS template with authentication, subscriptions, email, and i18n built in. Clone it, configure your services, and start building your product.

## What's Included

- **Authentication** — Email/password and OAuth (Google) via Supabase Auth
- **Subscriptions** — Three-tier billing (Free / Pro / Enterprise) via Stripe Checkout + Customer Portal
- **Database** — Supabase Postgres with Row-Level Security on every table
- **Email** — Transactional emails (welcome, etc.) via Resend + React Email templates
- **Internationalization** — Czech (primary) and English via next-intl
- **Route Protection** — Middleware gates dashboard behind login, app routes behind active subscription
- **CI** — GitHub Actions runs typecheck, lint, and build on every PR
- **AI Workflow** — `CLAUDE.md` with architecture rules and implementation guidelines for Claude Code

### Tech Stack

Next.js 16 (App Router) | TypeScript (strict) | Tailwind CSS v4 | shadcn/ui | Supabase | Stripe | Resend | next-intl | next-safe-action + Zod

## Getting Started

### 1. Clone and install

```bash
npx degit your-username/saas-starter my-app
cd my-app
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy the project URL and keys from **Settings > API**
3. Run the migrations:

```bash
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

### 3. Set up Stripe

1. Create products and prices in the [Stripe Dashboard](https://dashboard.stripe.com) matching the three tiers
2. Update the `stripePriceId` values in `lib/stripe/config.ts`
3. Set up a webhook endpoint pointing to `https://your-domain.com/api/webhooks/stripe` with these events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

For local development, use the Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### 4. Set up Resend

1. Create an API key at [resend.com](https://resend.com)
2. In development, the default sender is `onboarding@resend.dev` (only sends to the account owner's email)
3. For production, verify your domain in Resend and update `RESEND_FROM_EMAIL`

### 5. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local`. See `.env.example` for descriptions of each variable.

### 6. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Customizing Plans

Edit `lib/stripe/config.ts`:

```ts
export const PLANS: Plan[] = [
  { id: 'free',       price: 0,    stripePriceId: 'price_...' },
  { id: 'pro',        price: 499,  stripePriceId: 'price_...' },  // price in cents
  { id: 'enterprise', price: 1999, stripePriceId: 'price_...' },
]
```

The `stripePriceId` values must match the Price IDs from your Stripe dashboard. Plan names and descriptions are defined in the i18n files under `marketing.pricing.plans`.

### Subscription-Gated Routes

Routes that require an active paid subscription are configured in the same file:

```ts
export const PROTECTED_ROUTES = ['/dashboard/app']
```

Any route matching these prefixes redirects users without an active subscription to `/dashboard/billing`.

## Adding i18n Keys

All user-facing strings live in `/messages/cs.json` (Czech, primary) and `/messages/en.json` (English). Both files must have identical keys.

To add a new string:

1. Add the key to both `cs.json` and `en.json`
2. Use it in a Server Component: `const t = await getTranslations('namespace')`
3. Use it in a Client Component: `const t = useTranslations('namespace')`

## Replacing the Brand

<!-- ACME is used as a placeholder brand name throughout the starter. -->

Search for **`ACME`** and replace with your product name in these locations:

- `messages/cs.json` — keys `marketing.brand` and `marketing.footer.copyright`
- `messages/en.json` — keys `marketing.brand` and `marketing.footer.copyright`
- `lib/resend/send.ts` — welcome email subject and title (both `cs` and `en` translations)

## Claude Code Workflow

This starter includes `CLAUDE.md` — a set of instructions for [Claude Code](https://claude.com/claude-code) that encode the project's architecture, conventions, and quality gates. When Claude Code works on this repo, it:

1. Reads the issue acceptance criteria and asks for clarification if anything is ambiguous
2. Follows the layered architecture (`lib/db` -> `actions` -> pages -> components)
3. Adds i18n strings to both language files
4. Creates migrations for any database change
5. Runs `npm run typecheck`, `npm run lint`, and `npm run build` before submitting

Use `PLANNING.md` to document your product decisions before starting implementation.

## Project Structure

```
app/
  (auth)/           Login, signup, password reset
  (dashboard)/      Protected routes (settings, billing, app)
  (marketing)/      Public pages (landing, pricing)
  api/              Webhooks (Stripe), auth (signout)
actions/            Server Actions (next-safe-action + Zod)
components/
  ui/               shadcn/ui (do not edit)
  shared/           Custom reusable components
lib/
  db/               Database queries (one file per domain)
  supabase/         Supabase clients (server, client, service)
  stripe/           Stripe integration + plan config
  resend/           Email client + templates
messages/           i18n translation files (cs.json, en.json)
supabase/
  migrations/       SQL migration files
types/              Shared TypeScript types
```

## Commands

```bash
npm run dev         # Start dev server
npm run build       # Production build
npm run typecheck   # TypeScript check (tsc --noEmit)
npm run lint        # ESLint
npm run format      # Prettier
```

## Deploy

Deploy to [Vercel](https://vercel.com):

1. Import the repo
2. Add all environment variables from `.env.example`
3. Set `NEXT_PUBLIC_SITE_URL` to your production domain
4. Deploy

Vercel auto-switches environment variables per branch (preview vs production).

## License

MIT
