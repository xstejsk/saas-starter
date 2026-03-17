export type Plan = {
  id: string
  price: number
  stripePriceId: string
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    price: 0,
    stripePriceId: 'price_1TBJtFBHNTQcvJqFGjDs8ktD',
  },
  {
    id: 'pro',
    price: 499,
    stripePriceId: 'price_1TBJthBHNTQcvJqFZWBcurCa',
  },
  {
    id: 'enterprise',
    price: 1999,
    stripePriceId: 'price_1TBJu8BHNTQcvJqFY6JFrRgV',
  },
]
