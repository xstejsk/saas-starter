export type Plan = {
  id: string
  name: string
  description: string
  price: number
  stripePriceId: string
  features: string[]
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Get started with the basics',
    price: 0,
    stripePriceId: 'price_free_placeholder',
    features: ['1 project', 'Basic support', 'Community access'],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For professionals and growing teams',
    price: 499,
    stripePriceId: 'price_pro_monthly_placeholder',
    features: [
      'Unlimited projects',
      'Priority support',
      'Advanced analytics',
      'Custom integrations',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations',
    price: 1999,
    stripePriceId: 'price_enterprise_monthly_placeholder',
    features: [
      'Everything in Pro',
      'Dedicated support',
      'SLA guarantee',
      'Custom contracts',
      'SSO & SAML',
    ],
  },
]
