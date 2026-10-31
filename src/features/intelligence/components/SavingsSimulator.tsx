import { Calculator, Check } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Subscription } from '../../../types'
import { money } from '../intelligenceEngine'
import { simulateSavings } from '../savingsSimulator'

export function SavingsSimulator({ subscriptions }: { subscriptions: Subscription[] }) {
  const active = subscriptions.filter(subscription => subscription.status === 'active')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const result = useMemo(() => simulateSavings(subscriptions, selectedIds), [subscriptions, selectedIds])
  const toggle = (id: string) => setSelectedIds(ids => ids.includes(id) ? ids.filter(item => item !== id) : [...ids, id])
  return <section className="intelligence-card savings-card"><div className="intelligence-heading"><div><p className="eyebrow">WHAT-IF SIMULATOR</p><h2>Explore potential savings</h2></div><div className="intelligence-icon orange"><Calculator size={17}/></div></div><p className="intelligence-helper">Select subscriptions you are considering pausing or removing. This is only a simulation and will not change your wallet.</p><div className="simulator-grid"><div className="simulator-options">{active.map(subscription => <label className="simulator-option" key={subscription.id}><input type="checkbox" checked={selectedIds.includes(subscription.id)} onChange={() => toggle(subscription.id)}/><span className="fake-check">{selectedIds.includes(subscription.id) && <Check size={12}/>}</span><span>{subscription.name}</span></label>)}{!active.length && <span className="muted-copy">No active subscriptions to simulate.</span>}</div><div className="savings-result"><span>Potential monthly savings</span><strong>{money.format(result.potentialMonthlySavings)}</strong><div><span>Revised monthly</span><b>{money.format(result.revisedMonthly)}</b></div><div><span>Potential annual savings</span><b>{money.format(result.potentialAnnualSavings)}</b></div></div></div></section>
}
