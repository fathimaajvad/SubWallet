import { useEffect, useMemo, useState } from 'react'
import { Activity, ArrowUpRight, CalendarDays, Check, ChevronDown, CircleDollarSign, CreditCard, LayoutDashboard, Menu, Pause, Play, Plus, Search, Settings2, Sparkles, Trash2, WalletCards, X } from 'lucide-react'
import type { Category, Subscription, UsageLevel } from './types'
import { loadSubscriptions, saveSubscriptions } from './storage'
import { IntelligenceSection } from './features/intelligence/components/IntelligenceSection'
import { monthlyEquivalent } from './features/intelligence/intelligenceEngine'

const categories: Category[] = ['Entertainment', 'Productivity', 'Fitness', 'Utilities', 'Other']
const colors = ['#a3e635', '#e879f9', '#60a5fa', '#fb923c', '#a78bfa', '#34d399']
const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })
const dateFormat = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' })
const initials = (name: string) => name.split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase()
const dateStamp = (value: string) => {
  const [year, month, day] = value.split('-').map(Number)
  return Date.UTC(year, month - 1, day)
}
const daysUntil = (value: string) => {
  const today = new Date()
  const todayStamp = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  return Math.round((dateStamp(value) - todayStamp) / 86_400_000)
}
function App() {
  const [subscriptions, setSubscriptions] = useState(loadSubscriptions)
  const [query, setQuery] = useState(''); const [filter, setFilter] = useState<'All' | Category>('All')
  const [statusFilter, setStatusFilter] = useState<'All' | 'active' | 'paused'>('All')
  const [modal, setModal] = useState<Subscription | 'new' | null>(null); const [mobileNav, setMobileNav] = useState(false)
  useEffect(() => saveSubscriptions(subscriptions), [subscriptions])
  const active = subscriptions.filter(s => s.status === 'active')
  const monthly = active.reduce((sum, s) => sum + monthlyEquivalent(s), 0)
  const annual = monthly * 12
  const visible = useMemo(() => subscriptions.filter(s => (filter === 'All' || s.category === filter) && (statusFilter === 'All' || s.status === statusFilter) && s.name.toLowerCase().includes(query.toLowerCase())), [subscriptions, filter, statusFilter, query])
  const upcoming = [...active].filter(s => daysUntil(s.nextRenewal) >= 0).sort((a, b) => a.nextRenewal.localeCompare(b.nextRenewal)).slice(0, 4)
  const categoryTotals = categories.map(category => ({ category, total: active.filter(s => s.category === category).reduce((n, s) => n + monthlyEquivalent(s), 0) }))
  const topCategory = [...categoryTotals].sort((a, b) => b.total - a.total)[0]
  const save = (item: Subscription) => { setSubscriptions(items => items.some(s => s.id === item.id) ? items.map(s => s.id === item.id ? item : s) : [item, ...items]); setModal(null) }
  const remove = (id: string) => {
    const item = subscriptions.find(s => s.id === id)
    if (item && window.confirm(`Delete ${item.name} from your wallet?`)) setSubscriptions(items => items.filter(s => s.id !== id))
  }
  const toggle = (id: string) => setSubscriptions(items => items.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'paused' : 'active' } : s))
  const updateUsage = (id: string, usage?: UsageLevel) => setSubscriptions(items => items.map(s => s.id === id ? { ...s, usage } : s))

  return <div className="app-shell">
    <aside className={mobileNav ? 'sidebar open' : 'sidebar'}><div className="brand"><div className="brand-mark"><WalletCards size={19}/></div><span>sub<span className="lime">wallet</span></span></div><button className="close-nav" onClick={() => setMobileNav(false)}><X size={20}/></button><nav><button className="nav-item active"><LayoutDashboard size={18}/> Overview</button><button className="nav-item"><CreditCard size={18}/> My wallet <span className="nav-count">{subscriptions.length}</span></button><button className="nav-item"><Activity size={18}/> Insights</button></nav><div className="sidebar-bottom"><button className="nav-item"><Settings2 size={18}/> Settings</button><div className="profile"><div className="avatar">FA</div><div><strong>Fathima</strong><span>Personal account</span></div><ChevronDown size={15}/></div></div></aside>
    {mobileNav && <div className="backdrop" onClick={() => setMobileNav(false)}/>}<main className="main-content"><header className="topbar"><button className="menu-btn" onClick={() => setMobileNav(true)}><Menu size={21}/></button><div><p className="eyebrow">Saturday, October 31, 2026</p><h1>Good afternoon, Fathima <span className="wave">✦</span></h1></div><div className="top-actions"><button className="icon-button"><Search size={18}/></button><div className="avatar">FA</div></div></header>
      <section className="hero-grid"><div className="hero-card"><div className="hero-top"><div><p className="eyebrow light">MONTHLY SPEND</p><div className="hero-value">{money.format(monthly)}<span>/mo</span></div></div><div className="trend"><ArrowUpRight size={15}/> 12.4%</div></div><div className="hero-footer"><span>Annual run rate</span><strong>{money.format(annual)}</strong><span className="muted-separator">·</span><span>{active.length} active subscriptions</span></div><div className="hero-glow"/></div><div className="quick-stat"><div className="stat-icon"><CalendarDays size={19}/></div><p className="eyebrow">NEXT RENEWAL</p><strong>{upcoming[0] ? dateFormat.format(new Date(upcoming[0].nextRenewal + 'T12:00:00')) : '—'}</strong><span>{upcoming[0]?.name || 'No upcoming payments'}</span></div><div className="quick-stat"><div className="stat-icon lime-bg"><Sparkles size={19}/></div><p className="eyebrow">BIGGEST CATEGORY</p><strong>{topCategory?.category || '—'}</strong><span>{topCategory ? money.format(topCategory.total) + ' / month' : 'Add a subscription'}</span></div></section>
      <section className="content-section wallet-section">
        <div className="section-heading"><div><p className="eyebrow">YOUR COLLECTION</p><h2>Subscription wallet</h2></div><button className="primary-btn" onClick={() => setModal('new')}><Plus size={17}/> Add subscription</button></div>
        <div className="toolbar">
          <div className="search-box"><Search size={17}/><input aria-label="Search subscriptions" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search subscriptions"/></div>
          <div className="filter-groups">
            <div className="filters" aria-label="Filter by category">
              <button className={filter === 'All' ? 'filter active' : 'filter'} onClick={() => setFilter('All')}>All <span>{subscriptions.length}</span></button>
              {categories.map(c => <button key={c} className={filter === c ? 'filter active' : 'filter'} onClick={() => setFilter(c)}>{c}</button>)}
            </div>
            <div className="filters status-filters" aria-label="Filter by status">
              {(['All', 'active', 'paused'] as const).map(status => <button key={status} className={statusFilter === status ? 'filter active' : 'filter'} onClick={() => setStatusFilter(status)}>{status === 'All' ? 'All status' : status === 'active' ? 'Active' : 'Paused'}</button>)}
            </div>
          </div>
        </div>
        <div className="wallet-grid">{visible.map(s => <SubscriptionCard key={s.id} item={s} onEdit={() => setModal(s)} onToggle={() => toggle(s.id)} onDelete={() => remove(s.id)}/>)}{visible.length === 0 && <div className="empty-state"><CircleDollarSign size={28}/><strong>No subscriptions found</strong><span>Try another search or adjust your filters.</span></div>}</div>
      </section>
      <section className="lower-grid"><UpcomingPayments items={upcoming}/><div className="insight-card"><div className="section-heading"><div><p className="eyebrow">SPENDING INSIGHT</p><h2>Where your money goes</h2></div><button className="more-btn">•••</button></div><div className="insight-content"><div className="donut" style={{'--p': `${monthly ? Math.max((topCategory.total / monthly) * 100, 6) : 0}%`} as React.CSSProperties}><div><strong>{money.format(monthly)}</strong><span>per month</span></div></div><div className="legend">{categories.slice(0, 3).map((c, i) => <div className="legend-row" key={c}><span className="dot" style={{background: colors[i]}}/><span>{c}</span><strong>{money.format(categoryTotals.find(x => x.category === c)?.total || 0)}</strong></div>)}</div></div></div></section>
      <IntelligenceSection subscriptions={subscriptions} onUsageChange={updateUsage}/>
    </main>{modal && <SubscriptionModal item={modal === 'new' ? undefined : modal} onClose={() => setModal(null)} onSave={save}/>}</div>
}

function SubscriptionCard({ item, onEdit, onToggle, onDelete }: { item: Subscription; onEdit: () => void; onToggle: () => void; onDelete: () => void }) {
  const cadence = { weekly: 'week', monthly: 'month', quarterly: 'quarter', yearly: 'year' }[item.billing]
  const statusLabel = item.status === 'active' ? 'Active' : 'Paused'

  return (
    <article
      className={item.status === 'paused' ? 'subscription-card paused' : 'subscription-card'}
      style={{ '--card-accent': item.color } as React.CSSProperties}
    >
      <div className="card-glow" aria-hidden="true" />
      <div className="card-accent" aria-hidden="true" />

      <div className="card-header">
        <div
          className="service-logo"
          style={{ background: item.color, color: item.color === '#f5f5f5' ? '#10151d' : '#fff' }}
          aria-hidden="true"
        >
          {initials(item.name)}
        </div>
        <div className={`status-badge ${item.status}`}>
          <span className="status-dot" />
          {statusLabel}
        </div>
      </div>

      <div className="card-main">
        <h3 title={item.name}>{item.name}</h3>
        <span className="category-pill">{item.category}</span>
      </div>

      <div className="card-price">
        <strong>{money.format(item.price)}</strong>
        <span>per {cadence}</span>
      </div>

      <div className="card-footer">
        <div className="next-payment">
          <span className="payment-label">NEXT PAYMENT</span>
          <strong>{dateFormat.format(new Date(item.nextRenewal + 'T12:00:00'))}</strong>
        </div>
        <div className="card-actions">
          <button
            title={item.status === 'active' ? 'Pause' : 'Resume'}
            aria-label={item.status === 'active' ? `Pause ${item.name}` : `Resume ${item.name}`}
            onClick={onToggle}
          >
            {item.status === 'active' ? <Pause size={15}/> : <Play size={15}/>}
          </button>
          <button title="Delete" aria-label={`Delete ${item.name}`} onClick={onDelete}>
            <Trash2 size={15}/>
          </button>
          <button title="Edit" aria-label={`Edit ${item.name}`} onClick={onEdit}>
            <ArrowUpRight size={15}/>
          </button>
        </div>
      </div>
    </article>
  )
}
function UpcomingPayments({ items }: { items: Subscription[] }) {
  return (
    <div className="upcoming-card">
      <div className="section-heading">
        <div><p className="eyebrow">COMING UP</p><h2>Upcoming payments</h2></div>
        <button className="link-btn">View calendar <ArrowUpRight size={14}/></button>
      </div>
      {items.length > 0 ? (
        <div className="payment-list">
          {items.map(s => {
            const remaining = daysUntil(s.nextRenewal)
            const dueSoon = remaining <= 3
            return (
              <div className={dueSoon ? 'payment-row due-soon' : 'payment-row'} key={s.id}>
                <div className="mini-logo" style={{ background: s.color }} aria-hidden="true">{initials(s.name)}</div>
                <div className="payment-name">
                  <strong title={s.name}>{s.name}</strong>
                  <span>{remaining === 0 ? 'Due today' : `In ${remaining} ${remaining === 1 ? 'day' : 'days'}`}</span>
                </div>
                <div className="payment-date">
                  <strong>{dateFormat.format(new Date(s.nextRenewal + 'T12:00:00'))}</strong>
                  <span>{money.format(s.price)}</span>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="payments-empty" role="status">
          <div className="payments-empty-icon"><CalendarDays size={21}/></div>
          <strong>You’re all caught up</strong>
          <span>No upcoming renewals. Active payments will appear here.</span>
        </div>
      )}
    </div>
  )
}
function SubscriptionModal({ item, onClose, onSave }: { item?: Subscription; onClose: () => void; onSave: (item: Subscription) => void }) { const [form, setForm] = useState<Subscription>(item || { id: crypto.randomUUID(), name: '', category: 'Entertainment', price: 0, billing: 'monthly', nextRenewal: new Date().toISOString().slice(0, 10), color: colors[0], status: 'active' }); const update = (key: keyof Subscription, value: string | number) => setForm(f => ({...f, [key]: value})); return <div className="modal-backdrop" onMouseDown={e => e.currentTarget === e.target && onClose()}><div className="modal"><div className="modal-header"><div><p className="eyebrow">{item ? 'EDIT SUBSCRIPTION' : 'NEW SUBSCRIPTION'}</p><h2>{item ? 'Update details' : 'Add to your wallet'}</h2></div><button className="icon-button" onClick={onClose}><X size={18}/></button></div><label>Service name<input autoFocus value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Netflix"/></label><div className="form-row"><label>Price<input type="number" min="0" step="0.01" value={form.price || ''} onChange={e => update('price', Number(e.target.value))}/></label><label>Billing<select value={form.billing} onChange={e => update('billing', e.target.value as Subscription['billing'])}><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="quarterly">Quarterly</option><option value="yearly">Yearly</option></select></label></div><div className="form-row"><label>Category<select value={form.category} onChange={e => update('category', e.target.value as Category)}>{categories.map(c => <option key={c}>{c}</option>)}</select></label><label>Next renewal<input type="date" value={form.nextRenewal} onChange={e => update('nextRenewal', e.target.value)}/></label></div><label>Card color<div className="color-picker">{colors.map(c => <button key={c} className={form.color === c ? 'color-swatch selected' : 'color-swatch'} style={{background: c}} onClick={() => update('color', c)}>{form.color === c && <Check size={15} color={c === '#f5f5f5' ? '#111' : '#fff'}/>}</button>)}</div></label><div className="modal-actions"><button className="secondary-btn" onClick={onClose}>Cancel</button><button className="primary-btn" disabled={!form.name || form.price <= 0} onClick={() => onSave(form)}>{item ? 'Save changes' : 'Add subscription'}</button></div></div></div> }

export default App
