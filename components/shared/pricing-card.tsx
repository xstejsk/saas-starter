'use client'

import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useAction } from 'next-safe-action/hooks'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createCheckout } from '@/actions/billing'
import type { Plan } from '@/lib/stripe/config'
import { cn } from '@/lib/utils'

export function PricingCard({ plan, currentPlanId }: { plan: Plan; currentPlanId: string | null }) {
  const t = useTranslations('marketing.pricing')
  const router = useRouter()
  const { execute, isPending } = useAction(createCheckout, {
    onSuccess: ({ data }) => {
      if (data?.url) {
        window.location.href = data.url
      }
    },
    onError: () => {
      router.push('/signup?next=/pricing')
    },
  })

  const isPopular = plan.id === 'pro'
  const isCurrent = plan.id === currentPlanId

  const formattedPrice = plan.price === 0 ? t('free') : `$${plan.price}${t('perMonth')}`

  const features = t.raw(`plans.${plan.id}.features`) as string[]

  return (
    <Card
      className={cn(
        'flex flex-col',
        isCurrent && 'border-primary shadow-md',
        isPopular && !isCurrent && 'border-primary/50 shadow-sm',
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t(`plans.${plan.id}.name`)}</CardTitle>
          {isCurrent ? (
            <Badge variant="default">{t('currentPlan')}</Badge>
          ) : (
            isPopular && <Badge variant="secondary">{t('popular')}</Badge>
          )}
        </div>
        <CardDescription>{t(`plans.${plan.id}.description`)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="mb-6 text-3xl font-bold">{formattedPrice}</p>
        <ul className="space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={isCurrent ? 'secondary' : isPopular ? 'default' : 'outline'}
          onClick={() =>
            execute({ priceId: plan.stripePriceId, returnUrl: window.location.origin + '/pricing' })
          }
          disabled={isPending || isCurrent}
        >
          {isCurrent ? t('currentPlan') : isPending ? t('getStarted') + '...' : t('getStarted')}
        </Button>
      </CardFooter>
    </Card>
  )
}
