# SubWallet — Implementation Notes

## Architecture
Single-page React + Vite + TypeScript app. `App` owns subscription state and derives all dashboard values. A small `storage` module serializes the state to `localStorage`; no totals are hardcoded.

## Data model
`Subscription { id, name, category, price, billing: 'weekly'|'monthly'|'quarterly'|'yearly', nextRenewal, color, status: 'active'|'paused' }`

Monthly equivalent is `price × 52 / 12` weekly, `price` monthly, `price / 3` quarterly, and `price / 12` yearly. Annualized is monthly equivalent × 12. Paused records are excluded from both.

## Component responsibilities
- `App`: layout, state, derived metrics, search/filter, modal orchestration.
- `StatCard`: compact financial summary.
- `SubscriptionCard`: wallet-style card and pause/resume/delete actions.
- `SubscriptionModal`: add/edit form and validation.
- `UpcomingPayments`: next renewal list.

## Delivery steps
1. Scaffold Vite and Tailwind.
2. Add the dark fintech design system and responsive shell.
3. Add LocalStorage-backed subscription CRUD.
4. Add search, filters, insights, and renewal list.
5. Build, smoke-test, commit to `main`, and push.
