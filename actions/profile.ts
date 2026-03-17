'use server'

import { cookies } from 'next/headers'
import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { createClient } from '@/lib/supabase/server'
import { getUserProfileById } from '@/lib/supabase/helpers'
import { SUPPORTED_LOCALES, LOCALE_COOKIE, isSupportedLocale, DEFAULT_LOCALE } from '@/lib/i18n'

const updateProfileSchema = z.object({
  fullName: z.string().max(200),
  locale: z.enum(SUPPORTED_LOCALES),
})

export const updateProfile = authActionClient
  .inputSchema(updateProfileSchema)
  .action(async ({ parsedInput: { fullName, locale }, ctx: { user } }) => {
    const supabase = await createClient()

    const { error } = (await (
      supabase.from('user_profiles' as string) as ReturnType<typeof supabase.from>
    )
      .update({ full_name: fullName, locale } as Record<string, unknown>)
      .eq('id', user.id)) as { error: { message: string } | null }

    if (error) {
      throw new Error(error.message)
    }

    const cookieStore = await cookies()
    cookieStore.set(LOCALE_COOKIE, locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })

    return { success: true }
  })

export async function syncLocaleCookie(): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return

  const profile = await getUserProfileById(user.id)
  const locale =
    profile?.locale && isSupportedLocale(profile.locale) ? profile.locale : DEFAULT_LOCALE

  const cookieStore = await cookies()
  cookieStore.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  })
}
