'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { HugeiconsIcon } from '@hugeicons/react'
import { Logout01Icon, Menu01Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useState } from 'react'
import { dashboardNavItems } from '@/config/dashboard-nav'

function NavLinks({
  pathname,
  t,
  onNavigate,
}: {
  pathname: string
  t: (key: string) => string
  onNavigate?: () => void
}) {
  return (
    <nav className="flex flex-col gap-1">
      {dashboardNavItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Button
            key={item.href}
            variant={isActive ? 'secondary' : 'ghost'}
            size="default"
            asChild
            className="justify-start"
          >
            <Link href={item.href} onClick={onNavigate}>
              <HugeiconsIcon icon={item.icon} size={18} strokeWidth={2} />
              {t(item.labelKey)}
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}

export function DashboardSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()
  const t = useTranslations('dashboard')
  const [open, setOpen] = useState(false)

  const sidebarContent = (
    <>
      <div className="flex-1 space-y-4">
        <div className="px-2 py-1">
          <h2 className="text-lg font-semibold tracking-tight">{t('navigation')}</h2>
        </div>
        <NavLinks pathname={pathname} t={t} onNavigate={() => setOpen(false)} />
      </div>
      <div className="space-y-3">
        <Separator />
        <p className="truncate px-2 text-sm text-muted-foreground">{userEmail}</p>
        <form action="/api/auth/signout" method="POST">
          <Button variant="ghost" type="submit" className="w-full justify-start">
            <HugeiconsIcon icon={Logout01Icon} size={18} strokeWidth={2} />
            {t('logout')}
          </Button>
        </form>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile header with sheet trigger */}
      <div className="sticky top-0 z-40 flex h-14 items-center border-b bg-background px-4 md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <HugeiconsIcon icon={Menu01Icon} size={20} strokeWidth={2} />
              <span className="sr-only">{t('navigation')}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex w-64 flex-col p-4">
            <SheetTitle className="sr-only">{t('navigation')}</SheetTitle>
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden h-svh w-64 shrink-0 border-r bg-sidebar md:sticky md:top-0 md:flex md:flex-col">
        <div className="flex flex-1 flex-col p-4">{sidebarContent}</div>
      </aside>
    </>
  )
}
