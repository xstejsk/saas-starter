import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardSidebar } from '@/components/shared/dashboard-sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/dashboard')
  }

  return (
    <div className="flex min-h-svh">
      <DashboardSidebar userEmail={user.email ?? ''} />
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  )
}
