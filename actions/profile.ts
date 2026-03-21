'use server'

import { cookies } from 'next/headers'
import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { updateUserProfile } from '@/lib/db/profiles'
import { getUserProfileById } from '@/lib/db/profiles'
import { getAuthUser } from '@/lib/db/auth'
import { SUPPORTED_LOCALES, LOCALE_COOKIE, isSupportedLocale, DEFAULT_LOCALE } from '@/lib/i18n'

const updateProfileSchema = z.object({
  fullName: z.string().max(200),
  locale: z.enum(SUPPORTED_LOCALES),
})

export const updateProfile = authActionClient
  .inputSchema(updateProfileSchema)
  .action(async ({ parsedInput: { fullName, locale }, ctx: { user } }) => {
    await updateUserProfile(user.id, { full_name: fullName, locale })

    const cookieStore = await cookies()
    cookieStore.set(LOCALE_COOKIE, locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })

    return { success: true }
  })

export async function syncLocaleCookie(): Promise<void> {
  const user = await getAuthUser()
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
