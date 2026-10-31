import type { Category, Subscription, UsageLevel } from '../../types'

export const categories: Category[] = ['Entertainment', 'Productivity', 'Fitness', 'Utilities', 'Other']
export const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })

export function monthlyEquivalent(subscription: Subscription): number {
  switch (subscription.billing) {
    case 'weekly': return subscription.price * 52 / 12
    case 'quarterly': return subscription.price / 3
    case 'yearly': return subscription.price / 12
    default: return subscription.price
  }
}

export function activeSubscriptions(subscriptions: Subscription[]): Subscription[] {
  return subscriptions.filter(subscription => subscription.status === 'active')
}

export function monthlySpend(subscriptions: Subscription[]): number {
  return activeSubscriptions(subscriptions).reduce((total, subscription) => total + monthlyEquivalent(subscription), 0)
}

export function annualizedSpend(subscriptions: Subscription[]): number {
  return monthlySpend(subscriptions) * 12
}

export function categorySpend(subscriptions: Subscription[]) {
  return categories.map(category => ({
    category,
    total: activeSubscriptions(subscriptions)
      .filter(subscription => subscription.category === category)
      .reduce((total, subscription) => total + monthlyEquivalent(subscription), 0),
  }))
}

export type SmartInsight = { label: string; value: string; detail: string; tone: 'lime' | 'blue' | 'orange' | 'purple' }

export function smartInsights(subscriptions: Subscription[]): SmartInsight[] {
  const active = activeSubscriptions(subscriptions)
  const total = monthlySpend(subscriptions)
  const categoryTotals = categorySpend(subscriptions).filter(item => item.total > 0).sort((a, b) => b.total - a.total)
  const largest = [...active].sort((a, b) => monthlyEquivalent(b) - monthlyEquivalent(a))[0]
  const rare = active.filter(subscription => subscription.usage === 'rare')
  const annual = active.filter(subscription => subscription.billing === 'yearly').sort((a, b) => b.price - a.price)[0]

  const insights: SmartInsight[] = []
  if (categoryTotals[0]) {
    const percentage = total ? Math.round(categoryTotals[0].total / total * 100) : 0
    insights.push({ label: 'Highest category', value: categoryTotals[0].category, detail: `${money.format(categoryTotals[0].total)} / month · ${percentage}% of recurring spend`, tone: 'lime' })
  }
  if (largest) insights.push({ label: 'Largest active subscription', value: largest.name, detail: `${money.format(monthlyEquivalent(largest))} monthly equivalent`, tone: 'blue' })
  if (rare.length) {
    const savings = rare.reduce((totalSavings, subscription) => totalSavings + monthlyEquivalent(subscription), 0)
    insights.push({ label: 'Review opportunity', value: `${rare.length} rarely used`, detail: `Potential savings of ${money.format(savings)} / month if paused`, tone: 'orange' })
  } else {
    insights.push({ label: 'Annual run rate', value: money.format(annualizedSpend(subscriptions)), detail: 'Based on active subscriptions only', tone: 'purple' })
  }
  if (annual) insights.push({ label: 'Annual renewal to watch', value: annual.name, detail: `${money.format(annual.price)} billed yearly`, tone: 'orange' })
  return insights.slice(0, 4)
}

export function usageLabel(usage?: UsageLevel): string {
  return usage ? usage.charAt(0).toUpperCase() + usage.slice(1) : 'Not marked'
}
