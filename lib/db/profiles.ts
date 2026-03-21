import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import type { UserProfile } from '@/types'

export async function getUserProfileById(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient()

  // TODO: Remove type assertion once Supabase Database types are generated
  const { data, error } = (await supabase
    .from('user_profiles' as string)
    .select('*')
    .eq('id', userId)
    .single()) as { data: UserProfile | null; error: { message: string } | null }

  if (error || !data) {
    return null
  }

  return data
}

export async function updateUserProfile(
  userId: string,
  fields: { full_name: string; locale: string },
): Promise<void> {
  const supabase = await createClient()

  const { error } = (await (
    supabase.from('user_profiles' as string) as ReturnType<typeof supabase.from>
  )
    .update(fields as Record<string, unknown>)
    .eq('id', userId)) as { error: { message: string } | null }

  if (error) {
    throw new Error(error.message)
  }
}

/** Service-level access (bypasses RLS) — for webhook handlers only */
export async function getProfileEmailAndLocaleAsService(
  userId: string,
): Promise<{ email: string; locale: string } | null> {
  const supabase = createServiceClient()

  const { data } = await (
    supabase.from('user_profiles' as string) as ReturnType<typeof supabase.from>
  )
    .select('email, locale')
    .eq('id', userId)
    .single()

  if (!data) return null
  return { email: data.email as string, locale: (data.locale as string) ?? 'cs' }
}
