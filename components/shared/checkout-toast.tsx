'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

export function CheckoutToast() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const t = useTranslations('marketing.pricing')

  useEffect(() => {
    const success = searchParams.get('success')
    const canceled = searchParams.get('canceled')

    if (success === 'true') {
      toast.success(t('checkoutSuccess'))
      router.replace('/pricing', { scroll: false })
    } else if (canceled === 'true') {
      toast.info(t('checkoutCanceled'))
      router.replace('/pricing', { scroll: false })
    }
  }, [searchParams, router, t])

  return null
}
