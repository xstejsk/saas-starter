import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { getCurrentPlanId } from '@/lib/stripe/helpers'
import { PLANS } from '@/lib/stripe/config'
import { PricingCard } from '@/components/shared/pricing-card'
import { CheckoutToast } from '@/components/shared/checkout-toast'

export default async function PricingPage() {
  const t = await getTranslations('marketing.pricing')
  const currentPlanId = await getCurrentPlanId()

  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <Suspense>
        <CheckoutToast />
      </Suspense>
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold">{t('title')}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{t('description')}</p>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {PLANS.map((plan) => (
          <PricingCard key={plan.id} plan={plan} currentPlanId={currentPlanId} />
        ))}
      </div>
    </section>
  )
}
