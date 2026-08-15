# Architecture and ownership

## Recommended production shape

```text
Expo app (Android / iOS / web)
  ├─ Supabase Auth + RLS-protected data
  ├─ Product images from object storage/CDN
  └─ Authenticated server functions
       ├─ Checkout orchestration → Stripe OR Moneris
       ├─ Signed payment webhooks → order/payment reconciliation
       ├─ Delivery quote → service zones/capacity
       └─ ETA calculation → Google Routes API

Admin experience (responsive web in the same codebase initially)
  └─ Role-gated catalogue, batch inventory, order and delivery operations
```

## Frontend structure

The customer and admin experiences share the same domain model and design system while remaining separate at the screen level:

```text
App.tsx                         Composition, navigation state and demo data flow
src/theme/tokens.ts             Colour, spacing, radius, type and elevation tokens
src/components/ui.tsx           Reusable brand, button, chip and layout primitives
src/components/AppChrome.tsx    Customer header, mobile navigation and admin chrome
src/data/                       Replaceable catalogue/demo repositories and asset map
src/domain/                     Platform-neutral commerce types and calculations
src/screens/customer/           Shop, basket, orders/tracking and account experiences
src/screens/admin/              Operations dashboard and future admin workflows
src/services/                   Payment and delivery integration boundaries
```

This keeps brand styling consistent, prevents customer code from absorbing admin complexity, and lets Supabase repositories replace demo data without rewriting the visual layer. Expo Router can be introduced when authentication and deep-linked product/order URLs are implemented; the current small state router keeps the prototype dependency-light.

## Important boundaries

- The client sends product IDs and quantities—not trusted prices or totals.
- A server transaction reprices the cart, validates serviceability, reserves inventory, creates a pending order and uses an idempotency key.
- Payment provider secret keys are server-only. A signed webhook is the authority for `paid`; a client success screen is not.
- Hosted tokenization/PaymentSheet keeps raw card data out of this application.
- Google Routes calls are server-side. Store only the driver location needed for active delivery and define automatic retention.
- Order items snapshot name, unit and price so later catalogue edits never rewrite history.
- Products describe what Ugadi sells; variants describe fixed pack sizes and prices; batches describe the physical inventory received from a supplier.
- Every inventory reservation and release should create an immutable movement record linked to a batch and, when applicable, an order.
- Seasonal homepage content comes from campaigns instead of hardcoded screens, so mangoes can lead today and other categories can lead later.
- Reward points are a server-owned ledger. The client may select an offer, but checkout must revalidate balance, offer dates and minimum spend before reserving points.
- Points are permanently redeemed and newly earned only after a signed payment event confirms the order; refunds and cancellations create reversing ledger entries.

## Catalogue model

```text
Category
  └─ Product
       ├─ Compliance metadata
       └─ Product variant (SKU / fixed pack / price)
            └─ Inventory batch (supplier / lot / origin / dates / storage)
                 └─ Inventory movement (receive / reserve / release / sell / adjust)

Campaign
  └─ Featured products + optional category
```

`supabase/migrations/002_catalog_foundation.sql` introduces this model non-destructively. The legacy `products.inventory` field remains only for the beta transition and must not become the source of truth for new reservation functions.

## Rewards model

```text
Customer
  └─ Reward account (balance / lifetime points / tier)
       └─ Reward transaction ledger (earn / redeem / reverse / adjust / expire)

Reward offer
  └─ Points cost + discount + minimum basket + active dates

Order
  └─ Reward offer + points redeemed/earned + discount snapshot
```

`supabase/migrations/003_rewards.sql` adds offers, accounts, the immutable transaction ledger and order reward snapshots. A checkout function must lock the account row and reserve points atomically; the payment webhook finalizes both redemption and earnings with idempotency protection.

## Payment approach

The `PaymentGateway` interface supports either provider:

- **Stripe:** native React Native PaymentSheet for Android/iOS; Stripe's web element/checkout path for web. Server creates and reconciles PaymentIntents.
- **Moneris:** Hosted Tokenization or a Moneris-hosted checkout surface, followed by a server-to-server Purchase using an idempotency key. Confirm the final mobile UX with the merchant's Moneris account team before implementation.

Launch one provider. Maintaining two live providers doubles settlement, refund, webhook and support paths without improving the beta.

### Prototype Stripe flow

`src/screens/customer/PaymentScreen.tsx` reproduces the checkout states needed for user testing: test card details, pricing/reward review, processing, confirmation and a newly scheduled order. `confirmMockStripePayment` waits locally and returns a fake receipt; it does not import the Stripe SDK, tokenize a card, call a server or persist payment data.

For production, replace only that mock boundary with an authenticated `create-checkout` server function and Stripe PaymentSheet/Elements. The server must recalculate the basket, create an idempotent PaymentIntent and treat the signed Stripe webhook—not the client confirmation screen—as payment authority.

## Handover-friendly practices

- Put the client's organization in control of source hosting, Expo/EAS, Apple, Google Play, Supabase, payment, maps and domain accounts from day one.
- Use group-owned email aliases, MFA and a password manager. Do not use a developer's personal account as production owner.
- Maintain separate development, staging and production projects/keys.
- Keep deployments reproducible with scripts and CI; use migrations for every database change.
- Add an admin handbook, incident/refund runbook, release checklist and short screen-recorded training before handover.
- Use error monitoring, uptime checks, daily database backups and budget alerts.

## Phased delivery

### Phase 0 — discovery (about 1 week)

Confirm policies, catalogue, zones, provider, branding and client account ownership. Produce wireframes and a test plan.

### Phase 1 — working beta (about 4–6 weeks for one developer)

Auth, catalogue, basket, addresses, delivery windows, one payment provider, order history, admin order board, inventory, notifications and manual dispatch/ETA.

### Phase 2 — pilot hardening (about 2–3 weeks)

Security and accessibility review, analytics/monitoring, refunds, failure recovery, performance, App Store/Play internal testing and a small GTA pilot.

### Phase 3 — handover (about 1 week plus overlap)

Client training, access review, runbooks, staged production release and an agreed warranty/support window. Expand products only after order and fulfilment metrics are stable.
