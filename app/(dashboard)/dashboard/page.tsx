import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-svh items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-medium">Dashboard</h1>
        <p className="text-muted-foreground">You are logged in as {user.email}.</p>
        <form action="/api/auth/signout" method="POST">
          <Button variant="outline" type="submit">
            Log out
          </Button>
        </form>
      </div>
    </div>
  )
}
