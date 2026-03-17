import { getResend } from './client'
import { WelcomeEmail } from './templates/welcome'

const welcomeTranslations: Record<
  string,
  {
    subject: string
    title: string
    message: string
    ctaLabel: string
  }
> = {
  cs: {
    subject: 'Vítejte v ACME!',
    title: 'Vítejte v ACME',
    message: 'Děkujeme za vaše předplatné. Váš účet je připraven k použití.',
    ctaLabel: 'Přejít na přehled',
  },
  en: {
    subject: 'Welcome to ACME!',
    title: 'Welcome to ACME',
    message: 'Thank you for subscribing. Your account is ready to use.',
    ctaLabel: 'Go to Dashboard',
  },
}

export async function sendWelcomeEmail(
  email: string,
  locale: string,
  dashboardUrl: string,
): Promise<void> {
  const t = welcomeTranslations[locale] ?? welcomeTranslations['cs']

  try {
    await getResend().emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: email,
      subject: t.subject,
      react: WelcomeEmail({
        title: t.title,
        message: t.message,
        ctaLabel: t.ctaLabel,
        dashboardUrl,
      }),
    })
  } catch (error) {
    console.error('Failed to send welcome email:', error)
  }
}
