import { StyleSheet, Text, View } from 'react-native';
import { Chip, ScreenFrame, SectionHeading } from '../../components/ui';
import { demoOrders } from '../../data/catalog';
import { Order, formatCad } from '../../domain/commerce';
import { colors, radius, shadow, spacing, typography } from '../../theme/tokens';

const statusLabels: Record<Order['status'], string> = { payment_pending: 'Payment pending', confirmed: 'Confirmed', packing: 'Being packed', out_for_delivery: 'Out for delivery', delivered: 'Delivered', cancelled: 'Cancelled' };

export function OrdersScreen({ wide }: { wide: boolean }) {
  return <ScreenFrame style={styles.page}>
    <SectionHeading eyebrow="YOUR UGADI ORDERS" title="From our hands to yours" copy="Follow every active delivery and revisit your past seasonal orders." />
    {demoOrders.map((order, index) => <View style={[styles.order, !wide && styles.orderMobile]} key={order.id}>
      <View style={styles.orderDetails}>
        <View style={styles.orderTop}><Text style={styles.orderId}>{order.id}</Text><Chip label={statusLabels[order.status]} tone={order.status === 'delivered' ? 'neutral' : 'green'} /></View>
        <Text style={styles.orderTitle}>{order.lineCount} premium mango box</Text>
        <Text style={styles.orderMeta}>{formatCad(order.totalCents)} · {order.deliveryCity}</Text>
        <View style={styles.timeline}>
          {['Confirmed', 'Carefully packed', 'Out for delivery', 'Delivered'].map((step, stepIndex) => { const completed = order.status === 'delivered' || stepIndex <= 2; return <View style={styles.timelineStep} key={step}><View style={[styles.timelineDot, completed && styles.timelineDotDone]} /><Text style={[styles.timelineText, completed && styles.timelineTextDone]}>{step}</Text></View>; })}
        </View>
      </View>
      <View style={[styles.tracking, index > 0 && styles.trackingPast]}>
        {order.eta ? <><Text style={styles.trackingEyebrow}>LIVE DELIVERY</Text><Text style={styles.eta}>{order.eta}</Text><Text style={styles.trackingCopy}>Estimated arrival today</Text><View style={styles.map}><View style={styles.mapStreetA} /><View style={styles.mapStreetB} /><View style={styles.originPin}><Text style={styles.pinText}>●</Text></View><View style={styles.homePin}><Text style={styles.pinText}>◆</Text></View><View style={styles.routeDots}><Text style={styles.routeDotsText}>· · · · · · ·</Text></View></View><Text style={styles.window}>{order.deliveryWindow}</Text></> : <><Text style={styles.trackingEyebrow}>DELIVERED</Text><Text style={styles.pastIcon}>✓</Text><Text style={styles.trackingCopy}>Delivered with care</Text><Text style={styles.window}>{order.deliveryWindow}</Text></>}
      </View>
    </View>)}
  </ScreenFrame>;
}

const styles = StyleSheet.create({
  page: { paddingTop: spacing.xxxl, paddingBottom: spacing.xxxl },
  order: { backgroundColor: colors.paper, borderColor: colors.line, borderWidth: 1, borderRadius: radius.lg, overflow: 'hidden', flexDirection: 'row', marginBottom: spacing.lg, ...shadow },
  orderMobile: { flexDirection: 'column' },
  orderDetails: { flex: 1.5, padding: spacing.xxl },
  orderTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.lg },
  orderId: { ...typography.micro, color: colors.leaf600 },
  orderTitle: { ...typography.h2, color: colors.ink, marginTop: spacing.xl },
  orderMeta: { ...typography.body, color: colors.inkSoft, marginTop: spacing.xs },
  timeline: { marginTop: spacing.xl, gap: spacing.md },
  timelineStep: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  timelineDot: { width: 11, height: 11, borderRadius: 6, borderColor: colors.line, borderWidth: 2 },
  timelineDotDone: { backgroundColor: colors.leaf500, borderColor: colors.leaf500 },
  timelineText: { ...typography.small, color: colors.inkSoft },
  timelineTextDone: { color: colors.ink, fontWeight: '700' },
  tracking: { flex: 1, minWidth: 300, backgroundColor: colors.forest950, padding: spacing.xl },
  trackingPast: { backgroundColor: colors.canvas },
  trackingEyebrow: { ...typography.micro, color: colors.lime300 },
  eta: { color: colors.paper, fontSize: 38, lineHeight: 42, fontWeight: '900', marginTop: spacing.sm },
  trackingCopy: { ...typography.small, color: '#BDD0C0', marginTop: 2 },
  map: { height: 116, backgroundColor: '#D9E8DA', borderRadius: radius.md, marginTop: spacing.lg, overflow: 'hidden' },
  mapStreetA: { position: 'absolute', width: '120%', height: 10, backgroundColor: colors.paper, top: 48, left: -20, transform: [{ rotate: '-8deg' }] },
  mapStreetB: { position: 'absolute', width: 9, height: '140%', backgroundColor: colors.paper, top: -20, left: '62%', transform: [{ rotate: '20deg' }] },
  originPin: { position: 'absolute', left: 24, top: 51 },
  homePin: { position: 'absolute', right: 28, top: 36 },
  pinText: { color: colors.forest900, fontSize: 18 },
  routeDots: { position: 'absolute', left: 51, top: 45 },
  routeDotsText: { color: colors.leaf600, letterSpacing: 4, fontSize: 18 },
  window: { ...typography.small, color: colors.lime300, fontWeight: '800', marginTop: spacing.md },
  pastIcon: { color: colors.forest900, fontSize: 42, fontWeight: '900', marginTop: spacing.xl },
});
