import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Divider, ScreenFrame } from '../../components/ui';
import { calculateCheckoutPricing, CartLine, formatCad, Order, RewardAccount, RewardOffer } from '../../domain/commerce';
import { confirmMockStripePayment, MockStripeReceipt } from '../../services/payments';
import { colors, radius, shadow, spacing, typography } from '../../theme/tokens';

type PaymentStatus = 'details' | 'processing' | 'succeeded' | 'failed';

export function PaymentScreen({
  lines,
  wide,
  rewardAccount,
  selectedReward,
  onBack,
  onPaymentSuccess,
  onComplete,
}: {
  lines: CartLine[];
  wide: boolean;
  rewardAccount: RewardAccount;
  selectedReward?: RewardOffer;
  onBack: () => void;
  onPaymentSuccess: () => void;
  onComplete: (order: Order) => void;
}) {
  const pricing = calculateCheckoutPricing(lines, rewardAccount.pointsBalance, selectedReward);
  const [status, setStatus] = useState<PaymentStatus>('details');
  const [receipt, setReceipt] = useState<MockStripeReceipt>();
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);

  const order: Order = {
    id: 'UG-1055',
    status: 'confirmed',
    totalCents: pricing.totalCents,
    deliveryCity: 'Toronto',
    deliveryWindow: 'Tomorrow · 2:00–5:00 PM',
    lineCount: itemCount,
  };

  const pay = async () => {
    setStatus('processing');
    try {
      const nextReceipt = await confirmMockStripePayment(pricing.totalCents);
      setReceipt(nextReceipt);
      setStatus('succeeded');
      onPaymentSuccess();
    } catch {
      setStatus('failed');
    }
  };

  if (status === 'succeeded' && receipt) {
    return <PaymentSuccess order={order} pricing={pricing} receipt={receipt} selectedReward={selectedReward} onComplete={() => onComplete(order)} />;
  }

  return <ScreenFrame style={styles.page}>
    <Pressable accessibilityRole="button" onPress={onBack}><Text style={styles.back}>‹ Return to basket</Text></Pressable>
    <View style={[styles.steps, !wide && styles.stepsMobile]}><View style={styles.stepDone}><Text style={styles.stepDoneText}>✓</Text></View><Text style={[styles.stepText, !wide && styles.stepTextMobile]}>Basket</Text><View style={[styles.stepLine, !wide && styles.stepLineMobile]} /><View style={styles.stepActive}><Text style={styles.stepActiveText}>2</Text></View><Text style={[styles.stepTextActive, !wide && styles.stepTextMobile]}>Payment</Text><View style={[styles.stepLine, !wide && styles.stepLineMobile]} /><View style={styles.stepFuture}><Text style={styles.stepFutureText}>3</Text></View><Text style={[styles.stepText, !wide && styles.stepTextMobile]}>Confirmation</Text></View>

    <View style={[styles.layout, !wide && styles.layoutMobile]}>
      <View style={styles.paymentCard}>
        <View style={styles.paymentTop}><View style={[styles.paymentHeading, !wide && styles.paymentHeadingMobile]}><Text style={styles.eyebrow}>SECURE CHECKOUT</Text><Text style={styles.title}>Payment details</Text><Text style={styles.copy}>Complete this prototype order using Stripe test values.</Text></View><View style={[styles.stripeLockup, !wide && styles.stripeLockupMobile]}><Text style={styles.stripeWord}>stripe</Text><Text style={styles.testMode}>TEST MODE</Text></View></View>

        <View style={styles.testNotice}><Text style={styles.testNoticeIcon}>◇</Text><View style={{ flex: 1 }}><Text style={styles.testNoticeTitle}>Safe prototype simulation</Text><Text style={styles.testNoticeCopy}>These test values stay inside your browser. Nothing is sent to Stripe, stored or charged.</Text></View></View>

        <View style={styles.methodHeading}><Text style={styles.sectionLabel}>PAYMENT METHOD</Text><View style={styles.methodPill}><Text style={styles.methodPillText}>Card</Text></View></View>

        <Text style={styles.label}>Email for receipt</Text>
        <TextInput accessibilityLabel="Email for receipt" defaultValue="arun@example.ca" keyboardType="email-address" autoCapitalize="none" style={styles.input} />

        <Text style={styles.label}>Cardholder name</Text>
        <TextInput accessibilityLabel="Cardholder name" defaultValue="Arun Kumar" autoCapitalize="words" style={styles.input} />

        <Text style={styles.label}>Card number</Text>
        <View style={styles.cardInputWrap}><TextInput accessibilityLabel="Card number" defaultValue="4242 4242 4242 4242" keyboardType="number-pad" style={styles.cardInput} /><View style={styles.visa}><Text style={styles.visaText}>VISA</Text></View></View>

        <View style={[styles.fieldRow, !wide && styles.fieldRowMobile]}>
          <View style={styles.fieldHalf}><Text style={styles.label}>Expiry</Text><TextInput accessibilityLabel="Expiry date" defaultValue="12 / 30" keyboardType="number-pad" style={styles.input} /></View>
          <View style={styles.fieldHalf}><Text style={styles.label}>Security code</Text><TextInput accessibilityLabel="Security code" defaultValue="123" keyboardType="number-pad" secureTextEntry style={styles.input} /></View>
          <View style={styles.fieldHalf}><Text style={styles.label}>Postal code</Text><TextInput accessibilityLabel="Billing postal code" defaultValue="M5V 2T6" autoCapitalize="characters" style={styles.input} /></View>
        </View>

        <View style={styles.billing}><View style={styles.check}><Text style={styles.checkText}>✓</Text></View><View><Text style={styles.billingTitle}>Billing address matches delivery</Text><Text style={styles.billingCopy}>Toronto, Ontario · M5V 2T6</Text></View></View>

        {status === 'failed' ? <View style={styles.error}><Text style={styles.errorText}>The simulated payment could not be completed. Please try again.</Text></View> : null}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Pay ${formatCad(pricing.totalCents)} with Stripe`}
          accessibilityState={{ disabled: status === 'processing', busy: status === 'processing' }}
          disabled={status === 'processing'}
          onPress={pay}
          style={({ pressed }) => [styles.payButton, status === 'processing' && styles.payButtonBusy, pressed && styles.payButtonPressed]}
        ><Text style={styles.payIcon}>{status === 'processing' ? '•••' : '◇'}</Text><Text style={styles.payButtonText}>{status === 'processing' ? 'Processing test payment…' : `Pay ${formatCad(pricing.totalCents)} with Stripe`}</Text></Pressable>
        <Text style={styles.terms}>By continuing, you agree to the prototype Terms and acknowledge that no real payment will occur.</Text>
      </View>

      <OrderSummary lines={lines} rewardAccount={rewardAccount} selectedReward={selectedReward} />
    </View>
  </ScreenFrame>;
}

function OrderSummary({ lines, rewardAccount, selectedReward }: { lines: CartLine[]; rewardAccount: RewardAccount; selectedReward?: RewardOffer }) {
  const pricing = calculateCheckoutPricing(lines, rewardAccount.pointsBalance, selectedReward);
  return <View style={styles.summary}>
    <Text style={styles.summaryEyebrow}>YOUR ORDER</Text>
    <Text style={styles.summaryTitle}>{lines.reduce((sum, line) => sum + line.quantity, 0)} item{lines.reduce((sum, line) => sum + line.quantity, 0) === 1 ? '' : 's'}</Text>
    <View style={styles.summaryItems}>{lines.map((line) => <View style={styles.summaryItem} key={line.product.id}><View style={styles.itemQuantity}><Text style={styles.itemQuantityText}>{line.quantity}</Text></View><View style={{ flex: 1 }}><Text style={styles.itemName}>{line.product.name}</Text><Text style={styles.itemUnit}>{line.product.unitLabel}</Text></View><Text style={styles.itemPrice}>{formatCad(line.product.unitPriceCents * line.quantity)}</Text></View>)}</View>
    <Divider />
    <SummaryRow label="Subtotal" value={formatCad(pricing.subtotalCents)} />
    {pricing.rewardDiscountCents ? <SummaryRow label={`Ugadi Rewards · ${selectedReward?.pointsCost} pts`} value={`−${formatCad(pricing.rewardDiscountCents)}`} reward /> : null}
    <SummaryRow label="Delivery" value={pricing.deliveryCents ? formatCad(pricing.deliveryCents) : 'Complimentary'} />
    <SummaryRow label="Estimated HST" value={formatCad(pricing.taxCents)} />
    <Divider />
    <View style={styles.summaryTotal}><Text style={styles.summaryTotalLabel}>Total</Text><Text style={styles.summaryTotalValue}>{formatCad(pricing.totalCents)}</Text></View>
    <View style={styles.deliveryWindow}><Text style={styles.deliveryWindowIcon}>⌖</Text><View><Text style={styles.deliveryWindowLabel}>DELIVERY WINDOW</Text><Text style={styles.deliveryWindowValue}>Tomorrow · 2:00–5:00 PM</Text></View></View>
    <View style={styles.pointsEarn}><Text style={styles.pointsEarnIcon}>✦</Text><Text style={styles.pointsEarnText}>Earn {pricing.earnedPoints} points after completion</Text></View>
  </View>;
}

function SummaryRow({ label, value, reward = false, light = false }: { label: string; value: string; reward?: boolean; light?: boolean }) {
  return <View style={styles.summaryRow}><Text style={[styles.summaryLabel, light && styles.summaryLabelLight, reward && styles.summaryReward]}>{label}</Text><Text style={[styles.summaryValue, light && styles.summaryValueLight, reward && styles.summaryReward]}>{value}</Text></View>;
}

function PaymentSuccess({ order, pricing, receipt, selectedReward, onComplete }: { order: Order; pricing: ReturnType<typeof calculateCheckoutPricing>; receipt: MockStripeReceipt; selectedReward?: RewardOffer; onComplete: () => void }) {
  return <ScreenFrame style={styles.successPage}>
    <View style={styles.successCard}>
      <View style={styles.successHalo}><View style={styles.successMark}><Text style={styles.successMarkText}>✓</Text></View></View>
      <Text style={styles.successEyebrow}>PAYMENT CONFIRMED · STRIPE TEST MODE</Text>
      <Text style={styles.successTitle}>Your taste of home is on its way.</Text>
      <Text style={styles.successCopy}>Thank you, Arun. We’ve received your prototype order and reserved tomorrow’s delivery window.</Text>
      <View style={styles.receipt}>
        <View style={styles.receiptTop}><View><Text style={styles.receiptLabel}>ORDER</Text><Text style={styles.receiptOrder}>{order.id}</Text></View><View style={styles.paidChip}><Text style={styles.paidChipText}>PAID · TEST</Text></View></View>
        <Divider />
        <SummaryRow label={`Paid with ${receipt.cardBrand} •••• ${receipt.cardLast4}`} value={formatCad(pricing.totalCents)} light />
        {selectedReward && pricing.rewardDiscountCents ? <SummaryRow label={`${selectedReward.pointsCost} reward points redeemed`} value={`−${formatCad(pricing.rewardDiscountCents)}`} reward light /> : null}
        <View style={styles.successDelivery}><Text style={styles.successDeliveryIcon}>⌖</Text><View style={styles.successDetailBody}><Text style={styles.receiptLabel}>DELIVERY</Text><Text style={styles.successDeliveryValue}>Tomorrow · 2:00–5:00 PM</Text><Text style={styles.successDeliveryCopy}>Toronto · Updates will appear in My orders</Text></View></View>
        <View style={styles.successPoints}><Text style={styles.successPointsIcon}>✦</Text><View style={styles.successDetailBody}><Text style={styles.successPointsTitle}>+{pricing.earnedPoints} points pending</Text><Text style={styles.successPointsCopy}>Added when the order is completed</Text></View></View>
      </View>
      <Button label={`View order ${order.id}`} onPress={onComplete} variant="secondary" />
      <Text style={styles.successDemo}>Prototype confirmation · reference {receipt.providerReference.slice(-10)}</Text>
    </View>
  </ScreenFrame>;
}

const styles = StyleSheet.create({
  page: { paddingTop: spacing.xxl, paddingBottom: spacing.xxxl },
  back: { color: colors.forest800, fontSize: 13, fontWeight: '800', marginBottom: spacing.xl },
  steps: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', maxWidth: 560, marginBottom: spacing.xl },
  stepsMobile: { flexWrap: 'nowrap' },
  stepDone: { width: 27, height: 27, borderRadius: 14, backgroundColor: colors.forest900, alignItems: 'center', justifyContent: 'center' },
  stepDoneText: { color: colors.paper, fontWeight: '900' },
  stepActive: { width: 27, height: 27, borderRadius: 14, backgroundColor: colors.mango500, alignItems: 'center', justifyContent: 'center' },
  stepActiveText: { color: colors.forest950, fontWeight: '900' },
  stepFuture: { width: 27, height: 27, borderRadius: 14, borderColor: colors.line, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  stepFutureText: { color: colors.inkSoft, fontWeight: '900' },
  stepText: { ...typography.small, color: colors.inkSoft, fontWeight: '700', marginLeft: spacing.sm },
  stepTextActive: { ...typography.small, color: colors.ink, fontWeight: '900', marginLeft: spacing.sm },
  stepTextMobile: { fontSize: 9, lineHeight: 12, marginLeft: 4 },
  stepLine: { width: 40, height: 1, backgroundColor: colors.line, marginHorizontal: spacing.md },
  stepLineMobile: { width: 14, marginHorizontal: 4 },
  layout: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.xl },
  layoutMobile: { flexDirection: 'column' },
  paymentCard: { flex: 1.5, width: '100%', backgroundColor: colors.paper, borderColor: colors.line, borderWidth: 1, borderRadius: radius.xl, padding: spacing.xxl, ...shadow },
  paymentTop: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.lg },
  paymentHeading: { flex: 1, minWidth: 240 },
  paymentHeadingMobile: { flexBasis: '100%', minWidth: 0 },
  eyebrow: { ...typography.micro, color: colors.leaf600 },
  title: { ...typography.h1, color: colors.ink, marginTop: spacing.sm },
  copy: { ...typography.body, color: colors.inkSoft, marginTop: spacing.xs },
  stripeLockup: { alignItems: 'flex-end' },
  stripeLockupMobile: { alignItems: 'flex-start' },
  stripeWord: { color: '#635BFF', fontSize: 30, lineHeight: 32, fontWeight: '900', letterSpacing: -1.5 },
  testMode: { ...typography.micro, color: '#635BFF', letterSpacing: .5 },
  testNotice: { backgroundColor: '#F0EFFF', borderColor: '#D9D6FF', borderWidth: 1, borderRadius: radius.md, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.xl },
  testNoticeIcon: { color: '#635BFF', fontSize: 20, fontWeight: '900' },
  testNoticeTitle: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  testNoticeCopy: { ...typography.small, color: colors.inkSoft },
  methodHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.xl },
  sectionLabel: { ...typography.micro, color: colors.inkSoft },
  methodPill: { backgroundColor: colors.forest900, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: 6 },
  methodPillText: { ...typography.micro, color: colors.paper, letterSpacing: .3 },
  label: { ...typography.micro, color: colors.inkSoft, marginTop: spacing.lg, marginBottom: spacing.sm },
  input: { height: 50, backgroundColor: colors.ivory, borderColor: colors.line, borderWidth: 1, borderRadius: radius.md, paddingHorizontal: spacing.lg, color: colors.ink, fontSize: 15, fontWeight: '700' },
  cardInputWrap: { height: 50, backgroundColor: colors.ivory, borderColor: '#A8A3FF', borderWidth: 2, borderRadius: radius.md, paddingLeft: spacing.lg, paddingRight: spacing.md, flexDirection: 'row', alignItems: 'center' },
  cardInput: { flex: 1, color: colors.ink, fontSize: 15, fontWeight: '800', height: '100%' },
  visa: { backgroundColor: '#1A1F71', borderRadius: 5, paddingHorizontal: 8, paddingVertical: 5 },
  visaText: { color: colors.paper, fontSize: 9, fontWeight: '900', fontStyle: 'italic' },
  fieldRow: { flexDirection: 'row', gap: spacing.md },
  fieldRowMobile: { flexDirection: 'column', gap: 0 },
  fieldHalf: { flex: 1 },
  billing: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.canvas, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg },
  check: { width: 25, height: 25, borderRadius: 7, backgroundColor: colors.forest900, alignItems: 'center', justifyContent: 'center' },
  checkText: { color: colors.paper, fontWeight: '900' },
  billingTitle: { color: colors.ink, fontSize: 12, fontWeight: '900' },
  billingCopy: { ...typography.small, color: colors.inkSoft },
  error: { backgroundColor: colors.dangerSoft, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg },
  errorText: { ...typography.small, color: colors.danger, fontWeight: '800' },
  payButton: { minHeight: 54, borderRadius: radius.md, backgroundColor: '#635BFF', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, marginTop: spacing.xl },
  payButtonBusy: { opacity: .7 },
  payButtonPressed: { opacity: .85 },
  payIcon: { color: colors.paper, fontSize: 18, fontWeight: '900' },
  payButtonText: { color: colors.paper, fontSize: 14, fontWeight: '900' },
  terms: { ...typography.small, color: colors.inkSoft, textAlign: 'center', marginTop: spacing.md },
  summary: { flex: 1, width: '100%', backgroundColor: colors.forest950, borderRadius: radius.xl, padding: spacing.xl, ...shadow },
  summaryEyebrow: { ...typography.micro, color: colors.lime300 },
  summaryTitle: { ...typography.h2, color: colors.paper, marginTop: spacing.sm },
  summaryItems: { marginTop: spacing.lg, gap: spacing.md },
  summaryItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  itemQuantity: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#14522F', alignItems: 'center', justifyContent: 'center' },
  itemQuantityText: { color: colors.lime300, fontSize: 12, fontWeight: '900' },
  itemName: { color: colors.paper, fontSize: 12, fontWeight: '900' },
  itemUnit: { ...typography.small, color: '#BBD0BF' },
  itemPrice: { ...typography.small, color: colors.paper, fontWeight: '900' },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.lg, marginBottom: spacing.md },
  summaryLabel: { ...typography.small, color: '#BBD0BF' },
  summaryValue: { ...typography.small, color: colors.paper, fontWeight: '900' },
  summaryLabelLight: { color: colors.inkSoft },
  summaryValueLight: { color: colors.ink },
  summaryReward: { color: colors.lime300, fontWeight: '900' },
  summaryTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryTotalLabel: { color: colors.paper, fontSize: 17, fontWeight: '900' },
  summaryTotalValue: { color: colors.paper, fontSize: 28, fontWeight: '900' },
  deliveryWindow: { backgroundColor: '#14522F', borderRadius: radius.md, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.xl },
  deliveryWindowIcon: { color: colors.mango500, fontSize: 20 },
  deliveryWindowLabel: { ...typography.micro, color: colors.lime300 },
  deliveryWindowValue: { color: colors.paper, fontSize: 13, fontWeight: '900', marginTop: 2 },
  pointsEarn: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.lg },
  pointsEarnIcon: { color: colors.mango500, fontSize: 16 },
  pointsEarnText: { ...typography.small, color: '#BBD0BF', fontWeight: '800' },
  successPage: { paddingTop: spacing.xxxl, paddingBottom: spacing.xxxl, alignItems: 'center' },
  successCard: { maxWidth: 760, width: '100%', backgroundColor: colors.paper, borderRadius: radius.xl, borderColor: colors.line, borderWidth: 1, padding: spacing.xxxl, alignItems: 'center', ...shadow },
  successHalo: { width: 112, height: 112, borderRadius: 56, backgroundColor: colors.successSoft, alignItems: 'center', justifyContent: 'center' },
  successMark: { width: 68, height: 68, borderRadius: 34, backgroundColor: colors.forest900, alignItems: 'center', justifyContent: 'center' },
  successMarkText: { color: colors.paper, fontSize: 32, fontWeight: '900' },
  successEyebrow: { ...typography.micro, color: '#635BFF', marginTop: spacing.xl, textAlign: 'center' },
  successTitle: { ...typography.h1, color: colors.ink, textAlign: 'center', marginTop: spacing.sm, maxWidth: 560 },
  successCopy: { ...typography.body, color: colors.inkSoft, textAlign: 'center', marginTop: spacing.sm, maxWidth: 560 },
  receipt: { width: '100%', backgroundColor: colors.ivory, borderColor: colors.line, borderWidth: 1, borderRadius: radius.lg, padding: spacing.xl, marginVertical: spacing.xl },
  receiptTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.lg },
  receiptLabel: { ...typography.micro, color: colors.inkSoft },
  receiptOrder: { ...typography.h2, color: colors.ink, marginTop: spacing.xs },
  paidChip: { backgroundColor: colors.successSoft, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  paidChipText: { ...typography.micro, color: colors.forest800, letterSpacing: .4 },
  successDelivery: { flexDirection: 'row', gap: spacing.md, backgroundColor: colors.paper, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg },
  successDeliveryIcon: { color: colors.leaf600, fontSize: 22 },
  successDetailBody: { flex: 1, minWidth: 0 },
  successDeliveryValue: { color: colors.ink, fontSize: 14, fontWeight: '900', marginTop: 2 },
  successDeliveryCopy: { ...typography.small, color: colors.inkSoft, marginTop: 2 },
  successPoints: { flexDirection: 'row', gap: spacing.md, alignItems: 'center', backgroundColor: colors.mango100, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  successPointsIcon: { color: colors.forest900, fontSize: 20 },
  successPointsTitle: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  successPointsCopy: { ...typography.small, color: colors.inkSoft },
  successDemo: { ...typography.micro, color: colors.inkSoft, textAlign: 'center', marginTop: spacing.lg, letterSpacing: .4 },
});
