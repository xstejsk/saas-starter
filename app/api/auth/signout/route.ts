import { type CookieOptions, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/types'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const redirectResponse = NextResponse.redirect(new URL('/login', request.url))

  // Create Supabase client that writes cookies directly onto the redirect response.
  // Using the shared createClient() helper won't work here because it writes to
  // cookieStore (implicit response), which may not be merged into NextResponse.redirect().
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            redirectResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  await supabase.auth.signOut()

  return redirectResponse
}
