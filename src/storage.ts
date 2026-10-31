import type { Subscription } from './types'

// v2 intentionally starts a clean INR dataset rather than showing legacy USD records.
const KEY = 'subwallet-subscriptions-v2'
const seed: Subscription[] = [
  { id: '1', name: 'Netflix', category: 'Entertainment', price: 649, billing: 'monthly', nextRenewal: '2026-11-04', color: '#e50914', status: 'active' },
  { id: '2', name: 'Figma', category: 'Productivity', price: 1_299, billing: 'monthly', nextRenewal: '2026-11-12', color: '#a879ff', status: 'active' },
  { id: '3', name: 'Spotify', category: 'Entertainment', price: 119, billing: 'monthly', nextRenewal: '2026-11-18', color: '#1ed760', status: 'active' },
  { id: '4', name: 'Notion', category: 'Productivity', price: 8_000, billing: 'yearly', nextRenewal: '2026-11-26', color: '#f5f5f5', status: 'active' },
]

export function loadSubscriptions(): Subscription[] {
  try { const saved = localStorage.getItem(KEY); return saved ? JSON.parse(saved) : seed } catch { return seed }
}
export function saveSubscriptions(items: Subscription[]) { localStorage.setItem(KEY, JSON.stringify(items)) }
