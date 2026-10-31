import type { Subscription } from '../../types'
import { activeSubscriptions } from './intelligenceEngine'

const day = 24 * 60 * 60 * 1000
const parse = (value: string) => { const [year, month, date] = value.split('-').map(Number); return new Date(Date.UTC(year, month - 1, date)) }

export type RenewalRisk = { subscription: Subscription; level: 'Low' | 'Medium' | 'High'; explanation: string }

export function renewalRisks(subscriptions: Subscription[], today = new Date()): RenewalRisk[] {
  const active = activeSubscriptions(subscriptions)
  const sorted = [...active].sort((a, b) => a.nextRenewal.localeCompare(b.nextRenewal))
  const amounts = active.map(subscription => subscription.price).sort((a, b) => a - b)
  const median = amounts.length ? amounts[Math.floor(amounts.length / 2)] : 0
  const now = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())

  return sorted.map(subscription => {
    const renewal = parse(subscription.nextRenewal)
    const daysAway = Math.round((renewal.getTime() - now) / day)
    const nearby = active.filter(other => other.id !== subscription.id)
      .map(other => Math.abs(parse(other.nextRenewal).getTime() - renewal.getTime()) / day)
    const cluster3 = nearby.some(days => days <= 3)
    const cluster7 = nearby.some(days => days <= 7)
    const largeCharge = median > 0 && subscription.price >= median * 2
    const annualSoon = subscription.billing === 'yearly' && daysAway >= 0 && daysAway <= 30
    const reasons: string[] = []
    if (cluster3) reasons.push('another renewal is within 3 days')
    else if (cluster7) reasons.push('another renewal is within 7 days')
    if (largeCharge) reasons.push('the charge is high relative to your other subscriptions')
    if (annualSoon) reasons.push('an annual renewal is approaching')
    const level: RenewalRisk['level'] = cluster3 || (largeCharge && annualSoon) ? 'High' : cluster7 || largeCharge || annualSoon ? 'Medium' : 'Low'
    return { subscription, level, explanation: reasons.length ? reasons.join('; ') + '.' : 'No unusual renewal pattern detected.' }
  }).sort((a, b) => riskRank(a.level) - riskRank(b.level))
}

function riskRank(level: RenewalRisk['level']): number {
  return level === 'High' ? 0 : level === 'Medium' ? 1 : 2
}
