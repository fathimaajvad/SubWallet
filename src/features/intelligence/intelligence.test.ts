import { describe, expect, it } from 'vitest'
import type { Subscription } from '../../types'
import { annualizedSpend, monthlyEquivalent, monthlySpend } from './intelligenceEngine'
import { forecastTotal } from './spendingForecast'
import { renewalRisks } from './renewalRisk'
import { simulateSavings } from './savingsSimulator'

const subscription = (overrides: Partial<Subscription>): Subscription => ({
  id: 'test', name: 'Test', category: 'Other', price: 1200, billing: 'monthly', nextRenewal: '2026-11-10', color: '#fff', status: 'active', ...overrides,
})

describe('intelligence calculations', () => {
  it('normalizes every supported billing cadence to a monthly equivalent', () => {
    expect(monthlyEquivalent(subscription({ billing: 'weekly', price: 120 }))).toBe(520)
    expect(monthlyEquivalent(subscription({ billing: 'monthly', price: 120 }))).toBe(120)
    expect(monthlyEquivalent(subscription({ billing: 'quarterly', price: 120 }))).toBe(40)
    expect(monthlyEquivalent(subscription({ billing: 'yearly', price: 1200 }))).toBe(100)
  })

  it('excludes paused subscriptions from recurring spend and annualized spend', () => {
    const records = [subscription({ id: 'active', price: 100 }), subscription({ id: 'paused', price: 900, status: 'paused' })]
    expect(monthlySpend(records)).toBe(100)
    expect(annualizedSpend(records)).toBe(1200)
  })

  it('projects recurring payments without counting paused records', () => {
    const records = [
      subscription({ id: 'weekly', price: 100, billing: 'weekly', nextRenewal: '2026-11-01' }),
      subscription({ id: 'paused', price: 999, status: 'paused', nextRenewal: '2026-11-01' }),
    ]
    expect(forecastTotal(records, new Date('2026-11-01T00:00:00Z'), 7)).toBe(200)
  })

  it('flags renewal clusters and large annual charges with explanations', () => {
    const records = [
      subscription({ id: 'one', name: 'One', price: 100, nextRenewal: '2026-11-03' }),
      subscription({ id: 'two', name: 'Two', price: 100, nextRenewal: '2026-11-05' }),
      subscription({ id: 'annual', name: 'Annual', price: 12000, billing: 'yearly', nextRenewal: '2026-11-10' }),
    ]
    const risks = renewalRisks(records, new Date('2026-10-31T00:00:00Z'))
    expect(risks.find(risk => risk.subscription.id === 'one')?.level).toBe('High')
    expect(risks.find(risk => risk.subscription.id === 'annual')?.explanation).toContain('annual renewal')
  })

  it('simulates savings without changing the source records', () => {
    const records = [subscription({ id: 'keep', price: 100 }), subscription({ id: 'pause', price: 200 })]
    const result = simulateSavings(records, ['pause'])
    expect(result.revisedMonthly).toBe(100)
    expect(records[1].status).toBe('active')
  })
})
