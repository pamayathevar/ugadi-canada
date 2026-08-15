# Ugadi Canada

Universal customer and admin MVP foundation for a Toronto/GTA importer bringing an authentic taste of India to local families. One Expo/React Native TypeScript project targets Android, iOS and web.

## What is included

- A premium responsive visual prototype with editorial product photography, shop, basket, delivery quote, order tracking, account and admin dashboard flows.
- An Ugadi Rewards wallet with points activity, selectable offers and basket redemption calculations.
- A Stripe-style test checkout with demo card details, local processing simulation and order confirmation.
- A maintainable frontend architecture with shared design tokens/components and separated customer/admin screens.
- Multi-category catalogue foundations for fruits, vegetables, spices, pantry items and gifts, with mangoes as the active seasonal campaign.
- A non-destructive batch inventory, supplier, compliance and campaign migration for Supabase.
- Generic product/order domain models that can support future products.
- Payment and delivery service contracts with server-only security boundaries.
- Initial Supabase/Postgres schema and row-level security policies.
- MVP scope, production architecture and client handover plan.

The prototype uses demo data. The Stripe checkout uses local test values and intentionally makes no payment network request or card charge.

## Run locally

Requires Node.js 22.13 or later for Expo SDK 57.

```bash
npm install
npm run web
```

Or use `npm run ios` / `npm run android`. Copy `.env.example` to `.env` only when a Supabase project and map key exist.

## Suggested implementation order

1. Confirm the decisions in `docs/PRODUCT_SPEC.md`.
2. Create client-owned development/staging Supabase and Expo/EAS projects.
3. Add Supabase Auth/client setup and apply all three migrations, including `003_rewards.sql`.
4. Replace demo products/orders with repository queries.
5. Implement the transactional `create-order` server function.
6. Implement one payment provider and signed webhook reconciliation.
7. Add delivery capacity, dispatch and ETA server functions.
8. Add push/email notifications, tests, monitoring and store builds.

## Security note

Never put Stripe, Moneris, Supabase secret/service-role, or Google Routes server keys in `EXPO_PUBLIC_*` variables. Anything with that prefix is bundled into the client.
