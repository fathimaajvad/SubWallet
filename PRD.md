# SubWallet — Product Requirements

## Goal
Build a premium, mobile-first wallet for seeing and controlling recurring subscriptions at a glance.

## MVP users and jobs
- Individuals who want one calm view of recurring spending.
- Users can understand monthly and annualized spend, see renewal timing, and manage each subscription.

## Requirements
1. Dashboard: total monthly spend, annualized spend, active subscription count, and a lightweight category insight.
2. Wallet: card-based subscription list with brand, category, billing cadence, price, and next renewal.
3. Add/edit: create and update a subscription with name, INR price, weekly/monthly/quarterly/yearly billing cycle, category, renewal date, and color.
4. Controls: pause/resume and delete a subscription from its card.
5. Upcoming payments: show the next renewals in chronological order.
6. Search and category filters for the wallet.
7. Persistence: all records come from user-entered state and survive refresh through LocalStorage.
8. Responsive: polished desktop layout that collapses gracefully to mobile.

## Out of scope
Authentication, payment processing, bank integrations, notifications, and a backend.

## Success criteria
The MVP feels like a wallet, not an admin table; a user can add a record in under one minute, immediately see it reflected in totals, and manage it without leaving the dashboard.
