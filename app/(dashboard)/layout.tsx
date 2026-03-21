import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/db/auth'
import { getUserProfileById } from '@/lib/db/profiles'
import { getSubscriptionByUserId } from '@/lib/db/subscriptions'
import { DashboardSidebar } from '@/components/shared/dashboard-sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser()

  if (!user) {
    redirect('/login?next=/dashboard')
  }

  const [profile, subscription] = await Promise.all([
    getUserProfileById(user.id),
    getSubscriptionByUserId(user.id),
  ])

  const userName = profile?.full_name ?? null
  const planId = subscription?.status === 'active' ? (subscription.plan_id ?? null) : null

  return (
    <div className="flex min-h-svh">
      <DashboardSidebar userEmail={user.email ?? ''} userName={userName} planId={planId} />
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  )
}
