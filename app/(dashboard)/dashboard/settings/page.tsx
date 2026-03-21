import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/db/auth'
import { getUserProfileById } from '@/lib/db/profiles'
import { SettingsForm } from '@/components/shared/settings-form'

export default async function SettingsPage() {
  const user = await getAuthUser()

  if (!user) {
    redirect('/login?next=/dashboard/settings')
  }

  const profile = await getUserProfileById(user.id)

  return (
    <SettingsForm
      email={user.email ?? ''}
      fullName={profile?.full_name ?? ''}
      locale={profile?.locale ?? 'cs'}
    />
  )
}
