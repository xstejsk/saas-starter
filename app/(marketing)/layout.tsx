import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { getAuthUser } from '@/lib/db/auth'
import { Button } from '@/components/ui/button'

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser()

  return (
    <div className="flex min-h-svh flex-col">
      <MarketingHeader user={user} />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  )
}

function MarketingHeader({ user }: { user: { email?: string } | null }) {
  const t = useTranslations('marketing')

  return (
    <header className="border-b">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            {t('brand')}
          </Link>
          <nav>
            <Button variant="ghost" asChild>
              <Link href="/pricing">{t('nav.pricing')}</Link>
            </Button>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/dashboard">{t('nav.dashboard')}</Link>
              </Button>
              <form action="/api/auth/signout" method="POST">
                <Button variant="outline" type="submit">
                  {t('nav.logout')}
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/login">{t('nav.login')}</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">{t('nav.signup')}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

function MarketingFooter() {
  const t = useTranslations('marketing')

  return (
    <footer className="border-t py-8 text-center text-sm text-muted-foreground">
      {t('footer.copyright')}
    </footer>
  )
}
