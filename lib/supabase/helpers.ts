import { createClient } from '@/lib/supabase/server'
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
