export type Category = 'Entertainment' | 'Productivity' | 'Fitness' | 'Utilities' | 'Other'
export type Billing = 'monthly' | 'yearly'
export type Status = 'active' | 'paused'
export type Subscription = {
  id: string; name: string; category: Category; price: number; billing: Billing
  nextRenewal: string; color: string; status: Status
}
