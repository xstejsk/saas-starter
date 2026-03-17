'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { useTranslations } from 'next-intl'
import { useAction } from 'next-safe-action/hooks'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { updateProfile } from '@/actions/profile'
import { SUPPORTED_LOCALES, LOCALE_LABELS } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const settingsSchema = z.object({
  fullName: z.string().max(200),
  locale: z.enum(SUPPORTED_LOCALES),
})

type SettingsValues = z.infer<typeof settingsSchema>

export function SettingsForm({
  email,
  fullName,
  locale,
}: {
  email: string
  fullName: string
  locale: string
}) {
  const t = useTranslations('dashboard')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SettingsValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: { fullName, locale: locale as SettingsValues['locale'] },
  })

  const { execute } = useAction(updateProfile, {
    onSuccess: () => {
      toast.success(t('profileUpdated'))
      router.refresh()
    },
  })

  function onSubmit(data: SettingsValues) {
    execute(data)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t('settingsTitle')}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{t('settingsTitle')}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t('fullNameLabel')}</Label>
              <Input
                id="fullName"
                placeholder={t('fullNamePlaceholder')}
                {...register('fullName')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('emailLabel')}</Label>
              <Input id="email" type="email" value={email} disabled readOnly />
            </div>

            <div className="space-y-2">
              <Label htmlFor="locale">{t('languageLabel')}</Label>
              <select
                id="locale"
                className="border-input bg-background text-foreground flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs"
                {...register('locale')}
              >
                {SUPPORTED_LOCALES.map((loc) => (
                  <option key={loc} value={loc}>
                    {LOCALE_LABELS[loc]}
                  </option>
                ))}
              </select>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('saving') : t('saveButton')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
