## Behavior Rules

### Before Implementing
Before writing any code, Claude must:
1. Re-read the issue acceptance criteria carefully
2. If ANY of the following are unclear, post a comment asking for clarification and STOP:
    - Which files to create or modify
    - What the expected input/output of a function is
    - Whether a DB migration is needed
    - Which components to use
    - Anything not explicitly covered in the acceptance criteria
3. Only proceed with implementation when the issue is unambiguous

### When to Ask vs When to Proceed
**Proceed without asking if:**
- All acceptance criteria are specific and testable
- File locations are mentioned
- DB changes are explicitly described

**Ask before proceeding if:**
- Acceptance criteria use vague language ("make it better", "improve X")
- The issue references files that don't exist yet without describing them
- There are two reasonable ways to implement something and neither is specified

### How to Ask
Post a single comment listing ALL questions at once. Do not implement anything
until you receive answers. Do not ask one question, wait, then ask another.

# saas-starter — Claude Code Instructions

## Project
A reusable Next.js SaaS starter. Generic — no domain-specific logic.
Stack: Next.js 16 App Router, TypeScript strict, Tailwind v4, shadcn/ui,
Supabase (auth + db + RLS), Stripe (subscriptions), Resend (email), next-intl.
Note: In Next.js 15+, cookies(), headers(), params, and searchParams are all async — always await them.

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

## Git Conventions
- Branch naming: `feature/issue-{number}` (e.g. `feature/issue-42`)
- Always create the branch from `main`

## Workflow: Implementing an Issue
1. Run `npm install` if you added or changed dependencies
2. Run `npm run typecheck`, `npm run lint`, and `npm run build` — all must pass
3. Commit ALL changed files including `package-lock.json` if it was modified
4. Push the branch
5. Create a PR with `gh pr create` linking to the issue (use `Closes #N` in the body)

## Test Before Done
- npm run build       (must pass with zero errors)
- npm run typecheck   (must pass with zero errors)
- npm run lint        (must pass with zero warnings)
