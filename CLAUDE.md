# saas-starter — Claude Code Instructions

## Project
A reusable Next.js SaaS starter. Generic — no domain-specific logic.
Stack: Next.js 14 App Router, TypeScript strict, Tailwind, shadcn/ui,
Supabase (auth + db + RLS), Stripe (subscriptions), Resend (email), next-intl.

## Environments
- Local / Preview: Supabase saas-starter-dev + Stripe test mode
- Production: Supabase saas-starter-prod + Stripe live mode
- Vercel handles env var switching automatically per branch

## Route Groups
- (auth)/        → login, signup, callback, reset-password
- (dashboard)/   → protected routes requiring active session
- (marketing)/   → public pages: landing, pricing

## Folder Structure
- /app           Next.js App Router pages and layouts
- /components/ui shadcn components (never manually edit these)
- /components/shared  custom reusable components
- /lib/supabase  server.ts, client.ts, middleware.ts
- /lib/stripe    client.ts, helpers.ts
- /lib/resend    client.ts, templates/
- /actions       Server Actions using next-safe-action + Zod
- /types         Shared TypeScript types (index.ts)
- /messages      cs.json, en.json (next-intl translations)
- /supabase/migrations  All DB migrations (NEVER skip this)

## Critical Rules
1. ALWAYS create a migration file for any DB change
2. ALWAYS add RLS policies when creating a new table
3. Every table: id (uuid), created_at (timestamptz), user_id (uuid FK auth.users)
4. Use Server Actions for all mutations — NOT API routes unless it's a webhook
5. Use next-safe-action for all Server Actions (typed + Zod validated)
6. Supabase server client in Server Components, browser client in Client Components
7. All user-facing strings go in /messages/cs.json and /messages/en.json
8. Never use 'any' in TypeScript
9. Never hardcode URLs, keys, or environment-specific values
10. Run `npm run build` and `npm run typecheck` before marking any task done

## Database Conventions
- Table names: snake_case plural (e.g. user_profiles, subscriptions)
- Always enable RLS on every table
- RLS pattern: auth.uid() = user_id for SELECT/INSERT/UPDATE/DELETE
- Use Supabase migration files: supabase/migrations/YYYYMMDDHHMMSS_description.sql

## Stripe Conventions
- Webhook handler lives at: app/api/webhooks/stripe/route.ts
- Always verify webhook signature before processing
- Store Stripe customer_id and subscription status in DB (subscriptions table)
- Never trust client-side subscription status — always check DB

## i18n Conventions
- Use next-intl for all user-facing strings
- Primary language: Czech (cs.json) — always add Czech strings
- Secondary: English (en.json) — mirror all keys
- Never hardcode display strings in components

## Test Before Done
- npm run build       (must pass with zero errors)
- npm run typecheck   (must pass with zero errors)
- npm run lint        (must pass with zero warnings)
