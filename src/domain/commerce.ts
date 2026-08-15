export type ProductCategorySlug =
  | 'fresh-fruits'
  | 'fresh-vegetables'
  | 'spices-pantry'
  | 'gift-boxes';

export type ProductAvailability = 'available' | 'preorder' | 'coming_soon' | 'sold_out';

export type Product = {
  id: string;
  name: string;
  variety: string;
  origin: string;
  description: string;
  unitLabel: string;
  unitPriceCents: number;
  inventory: number;
  imageKey: string;
  active: boolean;
  category: ProductCategorySlug;
  availability: ProductAvailability;
  sku: string;
  sellBy: 'fixed_pack';
  storage: 'ambient' | 'cool' | 'refrigerated' | 'frozen';
  tags: string[];
};

export type ProductCategory = {
  slug: ProductCategorySlug;
  name: string;
  shortName: string;
  description: string;
  imageKey: string;
  availability: ProductAvailability;
  displayOrder: number;
};

export type MerchandisingCampaign = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  category: ProductCategorySlug;
  status: 'draft' | 'scheduled' | 'active' | 'archived';
};

export type CartLine = {
  product: Product;
  quantity: number;
};

export type RewardTier = 'seedling' | 'harvest' | 'heritage';

export type RewardAccount = {
  pointsBalance: number;
  lifetimePoints: number;
  tier: RewardTier;
  nextTierPoints: number;
};

export type RewardOffer = {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  discountCents: number;
  minimumSubtotalCents: number;
};

export type CheckoutPricing = {
  subtotalCents: number;
  deliveryCents: number;
  rewardDiscountCents: number;
  discountedSubtotalCents: number;
  taxCents: number;
  totalCents: number;
  earnedPoints: number;
};

export type OrderStatus =
  | 'payment_pending'
  | 'confirmed'
  | 'packing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type Order = {
  id: string;
  status: OrderStatus;
  totalCents: number;
  deliveryCity: string;
  deliveryWindow: string;
  eta?: string;
  lineCount: number;
};

export const formatCad = (cents: number) =>
  new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(cents / 100);

export const cartSubtotal = (lines: CartLine[]) =>
  lines.reduce((total, line) => total + line.product.unitPriceCents * line.quantity, 0);

export const taxCents = (subtotalCents: number, rate = 0.13) => Math.round(subtotalCents * rate);

export const deliveryFeeCents = (subtotalCents: number) => (subtotalCents >= 7500 ? 0 : 899);

export const rewardDiscountCents = (
  offer: RewardOffer | undefined,
  pointsBalance: number,
  subtotalCents: number,
) => offer && pointsBalance >= offer.pointsCost && subtotalCents >= offer.minimumSubtotalCents
  ? Math.min(offer.discountCents, subtotalCents)
  : 0;

export const pointsEarned = (eligibleSubtotalCents: number) =>
  Math.max(0, Math.floor(eligibleSubtotalCents / 100));

export const calculateCheckoutPricing = (
  lines: CartLine[],
  pointsBalance: number,
  offer?: RewardOffer,
): CheckoutPricing => {
  const subtotalCents = cartSubtotal(lines);
  const deliveryCents = deliveryFeeCents(subtotalCents);
  const appliedRewardCents = rewardDiscountCents(offer, pointsBalance, subtotalCents);
  const discountedSubtotalCents = Math.max(0, subtotalCents - appliedRewardCents);
  const estimatedTaxCents = taxCents(discountedSubtotalCents + deliveryCents);

  return {
    subtotalCents,
    deliveryCents,
    rewardDiscountCents: appliedRewardCents,
    discountedSubtotalCents,
    taxCents: estimatedTaxCents,
    totalCents: discountedSubtotalCents + deliveryCents + estimatedTaxCents,
    earnedPoints: pointsEarned(discountedSubtotalCents),
  };
};
