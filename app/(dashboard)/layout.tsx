import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardSidebar } from '@/components/shared/dashboard-sidebar'
import { getSubscriptionByUserId } from '@/lib/stripe/helpers'
import { getUserProfileById } from '@/lib/supabase/helpers'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

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
