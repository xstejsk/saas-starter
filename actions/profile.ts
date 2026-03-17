'use server'

import { z } from 'zod'
import { authActionClient } from '@/lib/safe-action'
import { createClient } from '@/lib/supabase/server'

const updateProfileSchema = z.object({
  fullName: z.string().max(200),
})

export const updateProfile = authActionClient
  .inputSchema(updateProfileSchema)
  .action(async ({ parsedInput: { fullName }, ctx: { user } }) => {
    const supabase = await createClient()

    const { error } = (await (
      supabase.from('user_profiles' as string) as ReturnType<typeof supabase.from>
    )
      .update({ full_name: fullName } as Record<string, unknown>)
      .eq('id', user.id)) as { error: { message: string } | null }

    if (error) {
      throw new Error(error.message)
    }

    return { success: true }
  })
