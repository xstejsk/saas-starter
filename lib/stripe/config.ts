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
    stripePriceId: 'price_1TBJtFBHNTQcvJqFGjDs8ktD',
    features: ['1 project', 'Basic support', 'Community access'],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For professionals and growing teams',
    price: 499,
    stripePriceId: 'price_1TBJthBHNTQcvJqFZWBcurCa',
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
    stripePriceId: 'price_1TBJu8BHNTQcvJqFY6JFrRgV',
    features: [
      'Everything in Pro',
      'Dedicated support',
      'SLA guarantee',
      'Custom contracts',
      'SSO & SAML',
    ],
  },
]
