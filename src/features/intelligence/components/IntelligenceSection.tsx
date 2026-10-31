import type { Subscription, UsageLevel } from '../../../types'
import { smartInsights } from '../intelligenceEngine'
import { SavingsSimulator } from './SavingsSimulator'
import { SmartInsights } from './SmartInsights'
import { SpendingForecast } from './SpendingForecast'
import { SubscriptionHealth } from './SubscriptionHealth'

export function IntelligenceSection({ subscriptions, onUsageChange }: { subscriptions: Subscription[]; onUsageChange: (id: string, usage?: UsageLevel) => void }) {
  return <section className="intelligence-section"><div className="intelligence-title"><div><p className="eyebrow">WALLET INTELLIGENCE</p><h2>Make smarter subscription decisions</h2></div><span>Based on your records</span></div><div className="intelligence-grid"><SmartInsights insights={smartInsights(subscriptions)}/><SpendingForecast subscriptions={subscriptions}/><SubscriptionHealth subscriptions={subscriptions} onUsageChange={onUsageChange}/><SavingsSimulator subscriptions={subscriptions}/></div></section>
}
