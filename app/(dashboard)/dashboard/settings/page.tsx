import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserProfileById } from '@/lib/supabase/helpers'
import { SettingsForm } from '@/components/shared/settings-form'

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/dashboard/settings')
  }

  const profile = await getUserProfileById(user.id)

  return <SettingsForm email={user.email ?? ''} fullName={profile?.full_name ?? ''} />
}
