import { createSafeActionClient } from 'next-safe-action'
import { createClient } from '@/lib/supabase/server'

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error('Action server error:', e.message)
    return e.message
  },
})

export const authActionClient = actionClient.use(async ({ next }) => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  return next({ ctx: { user } })
})
