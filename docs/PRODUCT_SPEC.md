# Ugadi Canada — MVP product specification

## Product goal

Build a curated India-to-Canada food marketplace for customers across Toronto and the GTA, beginning with seasonal mango boxes and expanding into fresh fruits, vegetables, spices, pantry essentials and festival gifts. Make origin and product information part of the buying experience, make delivery status visible, and give a small operations team enough control to run daily fulfilment. Categories, products, pack sizes and campaigns must be configurable without an app release.

## Brand promise

**A taste of home, delivered.** The experience should feel rooted in India and welcoming in Canada: warm, proud and contemporary rather than ornamental or stereotypical. Product storytelling should focus on genuine variety, place of origin, seasonality and flavour. Claims about farms, certifications, ripening methods or exact provenance must be supported by supplier records before publication.

The client campaign poster is preserved as the primary visual reference; implementation notes are in `docs/DESIGN_REFERENCE.md`.

## MVP users and flows

### Customer

1. Browse categories, seasonal campaigns and active products with stock availability.
2. Add boxes to a basket; enter an address and validate its service zone.
3. Select an available delivery window.
4. Pay in CAD with the configured provider.
5. Receive an order confirmation and status notifications.
6. View order history, scheduled window and—only once dispatched—traffic-aware ETA on a map.
7. Manage profile, addresses and notification preferences.
8. View the Ugadi Rewards balance and activity, select one eligible reward and see the discount and future earnings in the basket.

Guest browsing is supported, but authentication is required before payment so an order always has an owner and can be recovered on another device.

### Admin and support

1. Dashboard for new, packing, dispatched and completed orders.
2. View and update order status, assign delivery windows and add internal notes.
3. Manage categories, campaigns, products, variants, prices, images and availability.
4. Receive inventory by supplier lot/batch and track reserved, sold, damaged or recalled quantities.
5. Manage service zones, fees and free-delivery thresholds.
6. Create routes/driver assignments and update dispatch status.
7. View payment state and initiate a controlled refund; never view raw card data.
8. Export daily orders and contact customers.
9. View reward enrollment, points issuance and pending redemption totals; adjust balances only through an audited support action.

`support` can work with orders and customers. `admin` also manages catalogue and delivery configuration. `owner` controls staff access and payment configuration.

## Delivery model

There are two different promises:

- **Before dispatch:** a delivery window based on postal-code service zones, capacity and operating days.
- **After dispatch:** a traffic-aware ETA calculated on the server from the driver's latest consented location and destination. Customer location pages must not expose other customers or the complete driver route.

Beta can begin with manual route assignment and driver location/status updates. Route optimization and a dedicated driver app should be a later phase.

## Out of scope for first beta

- Multi-vendor marketplace, subscriptions and complex promotion stacking.
- Automated warehouse purchasing/import management.
- Variable/catch-weight pricing; beta products use fixed packs and variants.
- Live multi-stop route optimization and driver payroll.
- Multiple currencies or provinces outside configured Ontario service zones.
- Both payment providers live at the same time. Build the adapter now; launch one first.

## Acceptance criteria

- The same project builds for Android, iOS and web.
- A customer cannot order an inactive or out-of-stock product.
- Inventory reservations are allocated to traceable batches rather than a product-level counter.
- A recalled or quality-held batch cannot be allocated to a new order.
- Price, tax, delivery fee and inventory are recalculated server-side at checkout.
- Duplicate payment requests/webhooks cannot duplicate an order or charge.
- Customers can read only their own orders, addresses and tracking data.
- Staff actions are role-gated and recorded in status history/audit logs.
- A failed payment leaves no committed inventory reservation after expiry.
- No payment secret, routing server key or service-role key ships in the app bundle.
- Reward balances and offer eligibility are recalculated server-side; duplicate webhooks cannot double-earn or double-redeem points.

## Decisions needed before live integration

1. Legal business/app name, domain, logo and support contact.
2. Launch cities/postal prefixes, delivery days, cut-off time and fees.
3. Launch products, categories, fixed pack sizes, pricing, tax treatment and inventory source of truth.
4. Supplier, lot-code, origin, storage and labelling information for every launch product.
5. Launch payment provider: Stripe or Moneris, plus merchant test credentials.
6. Refund/cancellation, substitution, privacy and delivery policies.
7. Whether drivers are employees/contractors and how they share location.
8. Rewards launch rules: tier thresholds, point expiry, refund reversals and whether points are earned before or after tax/delivery.
