import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserProfileById } from '@/lib/supabase/helpers'
import { LOCALE_COOKIE, isSupportedLocale, DEFAULT_LOCALE } from '@/lib/i18n'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const response = NextResponse.redirect(`${origin}${next}`)

      // Sync locale cookie from user profile
      if (user) {
        const profile = await getUserProfileById(user.id)
        const locale =
          profile?.locale && isSupportedLocale(profile.locale) ? profile.locale : DEFAULT_LOCALE
        response.cookies.set(LOCALE_COOKIE, locale, {
          path: '/',
          maxAge: 60 * 60 * 24 * 365,
          sameSite: 'lax',
        })
      }

      return response
    }
  }

  return NextResponse.redirect(`${origin}/login`)
}
