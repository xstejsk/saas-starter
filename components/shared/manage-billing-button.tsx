'use client'

import { useAction } from 'next-safe-action/hooks'
import { useTranslations } from 'next-intl'
import { openBillingPortal } from '@/actions/billing'
import { Button } from '@/components/ui/button'

export function ManageBillingButton() {
  const t = useTranslations('dashboard')
  const tCommon = useTranslations('common')

  const { execute, isPending } = useAction(openBillingPortal, {
    onSuccess: ({ data }) => {
      if (data?.url) {
        window.location.href = data.url
      }
    },
  })

  return (
    <Button onClick={() => execute({ returnUrl: window.location.href })} disabled={isPending}>
      {isPending ? tCommon('loading') : t('manageBilling')}
    </Button>
  )
}
