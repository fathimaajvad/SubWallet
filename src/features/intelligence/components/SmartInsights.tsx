import { ArrowUpRight, Lightbulb, Sparkles } from 'lucide-react'
import type { SmartInsight } from '../intelligenceEngine'

export function SmartInsights({ insights }: { insights: SmartInsight[] }) {
  return <section className="intelligence-card smart-insights"><div className="intelligence-heading"><div><p className="eyebrow">SMART INSIGHTS</p><h2>What your wallet is telling you</h2></div><div className="intelligence-icon"><Sparkles size={17}/></div></div><div className="insight-list">{insights.map(insight => <div className={`smart-insight ${insight.tone}`} key={insight.label}><div className="smart-insight-icon"><Lightbulb size={15}/></div><div><p>{insight.label}</p><strong>{insight.value}</strong><span>{insight.detail}</span></div><ArrowUpRight size={14}/></div>)}</div></section>
}
