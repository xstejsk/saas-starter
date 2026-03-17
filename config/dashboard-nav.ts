import { Home01Icon, Settings01Icon, CreditCardIcon, Tag01Icon } from '@hugeicons/core-free-icons'
import type { IconSvgElement } from '@hugeicons/react'

export interface NavItem {
  href: string
  labelKey: string
  icon: IconSvgElement
}

export const dashboardNavItems: NavItem[] = [
  { href: '/dashboard', labelKey: 'dashboard', icon: Home01Icon },
  { href: '/dashboard/settings', labelKey: 'settings', icon: Settings01Icon },
  { href: '/dashboard/billing', labelKey: 'billing', icon: CreditCardIcon },
  { href: '/pricing', labelKey: 'pricing', icon: Tag01Icon },
]
