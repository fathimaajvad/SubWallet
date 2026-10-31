import type { Subscription } from '../../types'
import { monthlyEquivalent, monthlySpend } from './intelligenceEngine'

export function simulateSavings(subscriptions: Subscription[], selectedIds: string[]) {
  const selected = subscriptions.filter(subscription => selectedIds.includes(subscription.id) && subscription.status === 'active')
  const currentMonthly = monthlySpend(subscriptions)
  const potentialMonthlySavings = selected.reduce((total, subscription) => total + monthlyEquivalent(subscription), 0)
  return { selected, currentMonthly, revisedMonthly: currentMonthly - potentialMonthlySavings, potentialMonthlySavings, potentialAnnualSavings: potentialMonthlySavings * 12 }
}
