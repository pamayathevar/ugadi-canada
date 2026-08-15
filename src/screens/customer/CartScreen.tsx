import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Chip, Divider, ScreenFrame } from '../../components/ui';
import { productImages } from '../../data/assets';
import { calculateCheckoutPricing, CartLine, formatCad, RewardAccount, RewardOffer } from '../../domain/commerce';
import { colors, radius, shadow, spacing, typography } from '../../theme/tokens';

export function CartScreen({
  lines,
  wide,
  onBack,
  onQuantity,
  rewardAccount,
  rewardOffers,
  selectedReward,
  onRewardChange,
  onCheckout,
}: {
  lines: CartLine[];
  wide: boolean;
  onBack: () => void;
  onQuantity: (productId: string, quantity: number) => void;
  rewardAccount: RewardAccount;
  rewardOffers: RewardOffer[];
  selectedReward?: RewardOffer;
  onRewardChange: (rewardId: string | null) => void;
  onCheckout: () => void;
}) {
  const pricing = calculateCheckoutPricing(lines, rewardAccount.pointsBalance, selectedReward);
  const subtotal = pricing.subtotalCents;
  const delivery = pricing.deliveryCents;
  const rewardDiscount = pricing.rewardDiscountCents;
  const tax = pricing.taxCents;
  const total = pricing.totalCents;
  const earnedPoints = pricing.earnedPoints;
  const rewardShortfall = selectedReward ? Math.max(0, selectedReward.minimumSubtotalCents - subtotal) : 0;

  if (!lines.length) return <ScreenFrame style={styles.page}><Pressable onPress={onBack}><Text style={styles.back}>‹ Return to the collection</Text></Pressable><View style={styles.empty}><View style={styles.emptyIcon}><Text style={styles.emptyIconText}>⌑</Text></View><Text style={styles.emptyTitle}>Your basket is waiting.</Text><Text style={styles.emptyCopy}>Discover this season’s mango boxes and bring home something exceptional.</Text><Button label="Explore the collection" onPress={onBack} variant="secondary" /></View></ScreenFrame>;

  return (
    <ScreenFrame style={styles.page}>
      <Pressable onPress={onBack}><Text style={styles.back}>‹ Continue shopping</Text></Pressable>
      <Text style={styles.eyebrow}>YOUR SELECTION</Text>
      <Text style={styles.title}>Basket & delivery</Text>
      <Text style={styles.copy}>Review your boxes, choose a delivery window and continue to secure payment.</Text>
      <View style={[styles.layout, !wide && styles.layoutMobile]}>
        <View style={styles.lines}>
          {lines.map((line) => <View style={styles.line} key={line.product.id}>
            <Image source={productImages[line.product.imageKey]} style={styles.lineImage} resizeMode="cover" />
            <View style={styles.lineBody}>
              <Chip label={line.product.variety} />
              <Text style={styles.lineName}>{line.product.name}</Text>
              <Text style={styles.lineUnit}>{line.product.unitLabel}</Text>
              <View style={styles.quantity}>
                <Pressable onPress={() => onQuantity(line.product.id, line.quantity - 1)} style={styles.quantityButton}><Text style={styles.quantityButtonText}>−</Text></Pressable>
                <Text style={styles.quantityValue}>{line.quantity}</Text>
                <Pressable onPress={() => onQuantity(line.product.id, line.quantity + 1)} style={styles.quantityButton}><Text style={styles.quantityButtonText}>＋</Text></Pressable>
              </View>
            </View>
            <Text style={styles.linePrice}>{formatCad(line.product.unitPriceCents * line.quantity)}</Text>
          </View>)}

          <View style={styles.rewardsCard}>
            <View style={styles.rewardsHeading}>
              <View style={styles.rewardsMark}><Text style={styles.rewardsMarkText}>✦</Text></View>
              <View style={{ flex: 1 }}><Text style={styles.rewardsEyebrow}>UGADI REWARDS</Text><Text style={styles.rewardsTitle}>Use points on this order</Text><Text style={styles.rewardsCopy}>{rewardAccount.pointsBalance.toLocaleString('en-CA')} points available</Text></View>
            </View>
            {selectedReward ? <View style={[styles.selectedReward, !rewardDiscount && styles.selectedRewardPending]}>
              <View style={styles.selectedRewardCheck}><Text style={styles.selectedRewardCheckText}>{rewardDiscount ? '✓' : '!'}</Text></View>
              <View style={{ flex: 1 }}><Text style={styles.selectedRewardName}>{selectedReward.name}</Text><Text style={styles.selectedRewardCopy}>{rewardDiscount ? `${selectedReward.pointsCost} points reserved · ${formatCad(selectedReward.discountCents)} saved` : `Add ${formatCad(rewardShortfall)} more to unlock this reward.`}</Text></View>
              <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${selectedReward.name}`} onPress={() => onRewardChange(null)}><Text style={styles.removeReward}>Remove</Text></Pressable>
            </View> : <View>
              <Text style={styles.chooseReward}>Choose one reward for this basket</Text>
              <View style={styles.rewardChoices}>{rewardOffers.map((offer) => {
                const locked = rewardAccount.pointsBalance < offer.pointsCost;
                const minimumMissing = Math.max(0, offer.minimumSubtotalCents - subtotal);
                return <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Redeem ${offer.name}`}
                  accessibilityState={{ disabled: locked }}
                  disabled={locked}
                  key={offer.id}
                  onPress={() => onRewardChange(offer.id)}
                  style={({ pressed }) => [styles.rewardChoice, locked && styles.rewardChoiceLocked, pressed && styles.rewardChoicePressed]}
                ><Text style={styles.rewardChoiceValue}>{formatCad(offer.discountCents)} off</Text><Text style={styles.rewardChoiceCost}>{offer.pointsCost} pts</Text><Text style={styles.rewardChoiceStatus}>{locked ? `${offer.pointsCost - rewardAccount.pointsBalance} more points needed` : minimumMissing ? `Add ${formatCad(minimumMissing)} to qualify` : 'Ready to redeem'}</Text></Pressable>;
              })}</View>
            </View>}
          </View>

          <View style={styles.deliveryCard}>
            <View style={styles.deliveryHeading}><View style={styles.deliveryMark}><Text style={styles.deliveryMarkText}>⌖</Text></View><View><Text style={styles.deliveryTitle}>Where should we deliver?</Text><Text style={styles.deliveryCopy}>We’ll confirm serviceability and available dates.</Text></View></View>
            <Text style={styles.label}>Postal code</Text>
            <TextInput defaultValue="M5V 2T6" autoCapitalize="characters" placeholder="A1A 1A1" placeholderTextColor={colors.inkSoft} style={styles.input} />
            <View style={styles.success}><Text style={styles.successIcon}>✓</Text><View><Text style={styles.successTitle}>Delivery is available</Text><Text style={styles.successCopy}>Earliest window: Tomorrow · 2:00–5:00 PM</Text></View></View>
            <View style={styles.window}><View><Text style={styles.windowLabel}>SELECTED WINDOW</Text><Text style={styles.windowValue}>Tomorrow · 2:00–5:00 PM</Text></View><Text style={styles.windowCheck}>●</Text></View>
          </View>
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryEyebrow}>ORDER SUMMARY</Text>
          <Text style={styles.summaryTitle}>{lines.reduce((sum, line) => sum + line.quantity, 0)} premium box{lines.reduce((sum, line) => sum + line.quantity, 0) === 1 ? '' : 'es'}</Text>
          <Divider />
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>{formatCad(subtotal)}</Text></View>
          {selectedReward ? <View style={styles.summaryRow}><Text style={styles.rewardSummaryLabel}>Rewards · {selectedReward.pointsCost} pts</Text><Text style={styles.rewardSummaryValue}>{rewardDiscount ? `−${formatCad(rewardDiscount)}` : 'Not applied'}</Text></View> : null}
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Delivery</Text><Text style={styles.summaryValue}>{delivery ? formatCad(delivery) : 'Complimentary'}</Text></View>
          <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Estimated HST</Text><Text style={styles.summaryValue}>{formatCad(tax)}</Text></View>
          {delivery ? <Text style={styles.threshold}>Add {formatCad(Math.max(0, 7500 - subtotal))} more for complimentary delivery.</Text> : <Text style={styles.freeDelivery}>✓ Complimentary delivery applied</Text>}
          <Divider />
          <View style={styles.totalRow}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalValue}>{formatCad(total)}</Text></View>
          <View style={styles.earnPoints}><Text style={styles.earnPointsIcon}>✦</Text><Text style={styles.earnPointsCopy}>You’ll earn <Text style={styles.earnPointsStrong}>{earnedPoints} points</Text> when this order is completed.</Text></View>
          <Button label="Continue to secure payment" onPress={onCheckout} variant="secondary" />
          <View style={styles.secure}><Text style={styles.secureIcon}>◇</Text><Text style={styles.secureCopy}>Payment details are handled securely by the selected payment provider.</Text></View>
          <Text style={styles.demo}>Prototype checkout · no card will be charged</Text>
        </View>
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  page: { paddingTop: spacing.xxl, paddingBottom: spacing.xxxl },
  back: { color: colors.forest800, fontSize: 13, fontWeight: '800', marginBottom: spacing.xl },
  eyebrow: { ...typography.micro, color: colors.leaf600 },
  title: { ...typography.h1, color: colors.ink, marginTop: spacing.sm },
  copy: { ...typography.body, color: colors.inkSoft, marginTop: spacing.sm, maxWidth: 650 },
  layout: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xl, marginTop: spacing.xxl },
  layoutMobile: { flexDirection: 'column' },
  lines: { flex: 1.65, width: '100%', gap: spacing.md },
  line: { backgroundColor: colors.paper, borderColor: colors.line, borderWidth: 1, borderRadius: radius.lg, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  lineImage: { width: 124, height: 124, borderRadius: radius.md, backgroundColor: colors.canvas },
  lineBody: { flex: 1 },
  lineName: { ...typography.h3, color: colors.ink, marginTop: spacing.sm },
  lineUnit: { ...typography.small, color: colors.inkSoft, marginTop: 2 },
  linePrice: { color: colors.forest950, fontSize: 17, fontWeight: '900', alignSelf: 'flex-start', marginTop: spacing.sm },
  quantity: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, alignSelf: 'flex-start', borderColor: colors.line, borderWidth: 1, borderRadius: radius.pill, overflow: 'hidden' },
  quantityButton: { width: 34, height: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.canvas },
  quantityButtonText: { color: colors.forest900, fontSize: 17, fontWeight: '900' },
  quantityValue: { width: 34, textAlign: 'center', color: colors.ink, fontWeight: '900' },
  rewardsCard: { backgroundColor: colors.ivory, borderColor: colors.mango500, borderWidth: 1, borderRadius: radius.lg, padding: spacing.xl },
  rewardsHeading: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rewardsMark: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.mango500, alignItems: 'center', justifyContent: 'center' },
  rewardsMarkText: { color: colors.forest950, fontSize: 20, fontWeight: '900' },
  rewardsEyebrow: { ...typography.micro, color: colors.leaf600 },
  rewardsTitle: { ...typography.h3, color: colors.ink, marginTop: 2 },
  rewardsCopy: { ...typography.small, color: colors.inkSoft },
  selectedReward: { backgroundColor: colors.successSoft, borderColor: colors.leaf500, borderWidth: 1, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  selectedRewardPending: { backgroundColor: colors.mango100, borderColor: colors.mango500 },
  selectedRewardCheck: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.forest900, alignItems: 'center', justifyContent: 'center' },
  selectedRewardCheckText: { color: colors.paper, fontWeight: '900' },
  selectedRewardName: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  selectedRewardCopy: { ...typography.small, color: colors.inkSoft, marginTop: 2 },
  removeReward: { ...typography.small, color: colors.forest800, fontWeight: '900', textDecorationLine: 'underline' },
  chooseReward: { ...typography.small, color: colors.inkSoft, marginTop: spacing.lg, marginBottom: spacing.sm },
  rewardChoices: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  rewardChoice: { flex: 1, minWidth: 145, backgroundColor: colors.paper, borderColor: colors.line, borderWidth: 1, borderRadius: radius.md, padding: spacing.md },
  rewardChoiceLocked: { opacity: .5 },
  rewardChoicePressed: { borderColor: colors.leaf500, backgroundColor: colors.successSoft },
  rewardChoiceValue: { color: colors.forest900, fontSize: 16, fontWeight: '900' },
  rewardChoiceCost: { ...typography.micro, color: colors.leaf600, marginTop: spacing.xs },
  rewardChoiceStatus: { ...typography.small, color: colors.inkSoft, marginTop: spacing.sm },
  deliveryCard: { marginTop: spacing.sm, backgroundColor: colors.paper, borderColor: colors.line, borderWidth: 1, borderRadius: radius.lg, padding: spacing.xl },
  deliveryHeading: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  deliveryMark: { width: 45, height: 45, borderRadius: 23, backgroundColor: colors.mango100, alignItems: 'center', justifyContent: 'center' },
  deliveryMarkText: { color: colors.forest900, fontSize: 20 },
  deliveryTitle: { ...typography.h3, color: colors.ink },
  deliveryCopy: { ...typography.small, color: colors.inkSoft },
  label: { ...typography.micro, color: colors.inkSoft, marginTop: spacing.xl, marginBottom: spacing.sm },
  input: { height: 50, backgroundColor: colors.ivory, borderColor: colors.line, borderWidth: 1, borderRadius: radius.md, paddingHorizontal: spacing.lg, color: colors.ink, fontSize: 16, fontWeight: '700' },
  success: { backgroundColor: colors.successSoft, borderRadius: radius.md, padding: spacing.md, flexDirection: 'row', gap: spacing.md, alignItems: 'center', marginTop: spacing.md },
  successIcon: { color: colors.forest800, fontSize: 20, fontWeight: '900' },
  successTitle: { color: colors.forest950, fontSize: 13, fontWeight: '900' },
  successCopy: { ...typography.small, color: colors.forest800 },
  window: { borderColor: colors.leaf500, borderWidth: 2, borderRadius: radius.md, padding: spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md },
  windowLabel: { ...typography.micro, color: colors.leaf600 },
  windowValue: { color: colors.ink, fontSize: 14, fontWeight: '900', marginTop: 3 },
  windowCheck: { color: colors.leaf500, fontSize: 18 },
  summary: { flex: 1, width: '100%', backgroundColor: colors.forest950, borderRadius: radius.lg, padding: spacing.xl, ...shadow },
  summaryEyebrow: { ...typography.micro, color: colors.lime300 },
  summaryTitle: { ...typography.h2, color: colors.paper, marginTop: spacing.sm },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.lg, marginBottom: spacing.md },
  summaryLabel: { ...typography.small, color: '#BED0C1' },
  summaryValue: { ...typography.small, color: colors.paper, fontWeight: '800' },
  rewardSummaryLabel: { ...typography.small, color: colors.lime300, fontWeight: '800' },
  rewardSummaryValue: { ...typography.small, color: colors.lime300, fontWeight: '900' },
  threshold: { ...typography.small, color: colors.mango500, backgroundColor: '#164F2E', borderRadius: radius.sm, padding: spacing.md, marginTop: spacing.sm },
  freeDelivery: { ...typography.small, color: colors.lime300, marginTop: spacing.sm },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  totalLabel: { color: colors.paper, fontSize: 17, fontWeight: '900' },
  totalValue: { color: colors.paper, fontSize: 27, fontWeight: '900' },
  earnPoints: { backgroundColor: '#14522F', borderRadius: radius.md, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  earnPointsIcon: { color: colors.mango500, fontSize: 17, fontWeight: '900' },
  earnPointsCopy: { ...typography.small, color: '#BBD0BF', flex: 1 },
  earnPointsStrong: { color: colors.paper, fontWeight: '900' },
  secure: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start', marginTop: spacing.lg },
  secureIcon: { color: colors.lime300, fontSize: 17 },
  secureCopy: { ...typography.small, color: '#BBD0BF', flex: 1 },
  demo: { ...typography.micro, color: '#9FB2A3', textAlign: 'center', marginTop: spacing.lg, letterSpacing: .5 },
  empty: { backgroundColor: colors.paper, borderRadius: radius.xl, padding: spacing.xxxl, alignItems: 'center', borderColor: colors.line, borderWidth: 1, maxWidth: 660, width: '100%', alignSelf: 'center', ...shadow },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.mango100, alignItems: 'center', justifyContent: 'center' },
  emptyIconText: { color: colors.forest900, fontSize: 32 },
  emptyTitle: { ...typography.h1, color: colors.ink, marginTop: spacing.xl, textAlign: 'center' },
  emptyCopy: { ...typography.body, color: colors.inkSoft, marginVertical: spacing.lg, textAlign: 'center', maxWidth: 430 },
});
