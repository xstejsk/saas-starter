import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap, Shield, TrendingUp } from 'lucide-react'

export default function LandingPage() {
  const t = useTranslations('marketing')

  const features = [
    { key: 'setup' as const, icon: Zap },
    { key: 'secure' as const, icon: Shield },
    { key: 'scale' as const, icon: TrendingUp },
  ]

  return (
    <>
      {/* Hero */}
      <section className="flex flex-col items-center px-4 py-24 text-center sm:py-32">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          {t('hero.title')}
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{t('hero.description')}</p>
        <Button size="lg" className="mt-10" asChild>
          <Link href="/pricing">{t('hero.cta')}</Link>
        </Button>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="mb-12 text-center text-3xl font-bold">{t('features.title')}</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map(({ key, icon: Icon }) => (
            <Card key={key}>
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>{t(`features.${key}.title`)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{t(`features.${key}.description`)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center px-4 py-24 text-center">
        <h2 className="text-3xl font-bold">{t('cta.title')}</h2>
        <p className="mt-4 text-lg text-muted-foreground">{t('cta.description')}</p>
        <Button size="lg" className="mt-8" asChild>
          <Link href="/pricing">{t('cta.button')}</Link>
        </Button>
      </section>
    </>
  )
}
