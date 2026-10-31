import { CalendarClock, ChevronRight } from 'lucide-react'
import { forecastWindows } from '../spendingForecast'
import { money } from '../intelligenceEngine'
import type { Subscription } from '../../../types'

export function SpendingForecast({ subscriptions }: { subscriptions: Subscription[] }) {
  const windows = forecastWindows(subscriptions)
  const max = Math.max(...windows.map(window => window.total), 1)
  return <section className="intelligence-card forecast-card"><div className="intelligence-heading"><div><p className="eyebrow">SPENDING FORECAST</p><h2>Expected renewals</h2></div><div className="intelligence-icon blue"><CalendarClock size={17}/></div></div><p className="intelligence-helper">Projected charges from active subscriptions using their next renewal dates and billing cadence.</p><div className="forecast-list">{windows.map(window => <div className="forecast-row" key={window.days}><div className="forecast-label"><strong>{window.days === 365 ? 'Next 12 months' : `Next ${window.days} days`}</strong><span>{money.format(window.total)}</span></div><div className="forecast-track"><span style={{ width: `${Math.max(window.total / max * 100, 4)}%` }}/></div><ChevronRight size={14}/></div>)}</div></section>
}
