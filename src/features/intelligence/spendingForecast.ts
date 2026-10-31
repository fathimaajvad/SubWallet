import type { Subscription } from '../../types'
import { activeSubscriptions } from './intelligenceEngine'

const day = 24 * 60 * 60 * 1000

function parseDate(value: string): Date {
  const [year, month, date] = value.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, date))
}

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function addBillingPeriod(date: Date, billing: Subscription['billing']): Date {
  const next = new Date(date)
  if (billing === 'weekly') next.setUTCDate(next.getUTCDate() + 7)
  if (billing === 'monthly') next.setUTCMonth(next.getUTCMonth() + 1)
  if (billing === 'quarterly') next.setUTCMonth(next.getUTCMonth() + 3)
  if (billing === 'yearly') next.setUTCFullYear(next.getUTCFullYear() + 1)
  return next
}

export type ForecastPayment = { subscriptionId: string; name: string; date: string; amount: number }

export function forecastPayments(subscriptions: Subscription[], start = new Date(), horizonDays = 365): ForecastPayment[] {
  const startDate = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate()))
  const endDate = new Date(startDate.getTime() + horizonDays * day)
  const payments: ForecastPayment[] = []

  activeSubscriptions(subscriptions).forEach(subscription => {
    let date = parseDate(subscription.nextRenewal)
    while (date < startDate) date = addBillingPeriod(date, subscription.billing)
    while (date <= endDate) {
      payments.push({ subscriptionId: subscription.id, name: subscription.name, date: dateKey(date), amount: subscription.price })
      date = addBillingPeriod(date, subscription.billing)
    }
  })
  return payments.sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name))
}

export function forecastTotal(subscriptions: Subscription[], start: Date, horizonDays: number): number {
  return forecastPayments(subscriptions, start, horizonDays).reduce((total, payment) => total + payment.amount, 0)
}

export function forecastWindows(subscriptions: Subscription[], start = new Date()) {
  return [7, 30, 90, 365].map(days => ({ days, total: forecastTotal(subscriptions, start, days) }))
}
