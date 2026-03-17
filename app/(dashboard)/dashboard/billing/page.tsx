import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { createClient } from '@/lib/supabase/server'
import { getSubscriptionByUserId } from '@/lib/stripe/helpers'
import { PLANS } from '@/lib/stripe/config'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ManageBillingButton } from '@/components/shared/manage-billing-button'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function BillingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/dashboard/billing')
  }

  const subscription = await getSubscriptionByUserId(user.id)
  const t = await getTranslations('dashboard')
  const tPricing = await getTranslations('marketing.pricing')

  const hasActiveSubscription =
    subscription && subscription.status !== 'incomplete' && subscription.plan_id

  if (!hasActiveSubscription) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">{t('billingTitle')}</h1>
        <Card>
          <CardHeader>
            <CardTitle>
              {t('plan')}: {tPricing('plans.free.name')}
            </CardTitle>
            <CardDescription>{t('freePlanDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/pricing">{t('upgrade')}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const plan = PLANS.find((p) => p.id === subscription.plan_id)
  const statusKey = subscription.status as 'active' | 'past_due' | 'canceled' | 'incomplete'
  const statusVariant =
    subscription.status === 'active'
      ? 'default'
      : subscription.status === 'past_due'
        ? 'destructive'
        : 'secondary'

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t('billingTitle')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>
            {t('plan')}: {plan ? tPricing(`plans.${plan.id}.name`) : '—'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">{t('status')}:</span>
            <Badge variant={statusVariant}>{t(statusKey)}</Badge>
          </div>

          {subscription.current_period_end && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">{t('renewalDate')}:</span>
              <span className="text-sm">
                {new Date(subscription.current_period_end).toLocaleDateString()}
              </span>
            </div>
          )}

          <ManageBillingButton />
        </CardContent>
      </Card>
    </div>
  )
}
