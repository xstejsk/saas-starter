import { cookies } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'
import { isSupportedLocale, DEFAULT_LOCALE } from '@/lib/i18n'

export default getRequestConfig(async () => {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get('locale')?.value
  const locale = cookieLocale && isSupportedLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE

  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
  }
})
