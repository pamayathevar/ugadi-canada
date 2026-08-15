import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Chip, ScreenFrame, SectionHeading } from '../../components/ui';
import { demoDeliveryRoute } from '../../data/partners';
import { DeliveryStop, DeliveryStopStatus } from '../../domain/partners';
import { colors, radius, shadow, spacing, typography } from '../../theme/tokens';

const statusLabels: Record<DeliveryStopStatus, string> = {
  ready: 'Ready', en_route: 'En route', arrived: 'Arrived', delivered: 'Delivered', exception: 'Needs help',
};

const nextAction: Record<Exclude<DeliveryStopStatus, 'delivered'>, { label: string; status: DeliveryStopStatus; notice: string }> = {
  ready: { label: 'Start this delivery', status: 'en_route', notice: 'Navigation started and the customer was notified.' },
  en_route: { label: 'I have arrived', status: 'arrived', notice: 'Arrival recorded. Confirm the hand-off when complete.' },
  arrived: { label: 'Confirm delivery', status: 'delivered', notice: 'Delivery confirmed with a timestamp and audit event.' },
  exception: { label: 'Resume delivery', status: 'en_route', notice: 'The issue is cleared and delivery has resumed.' },
};

export function DeliveryPartnerDashboard({ wide }: { wide: boolean }) {
  const [stops, setStops] = useState<DeliveryStop[]>(demoDeliveryRoute.stops);
  const [selectedId, setSelectedId] = useState(demoDeliveryRoute.stops.find((stop) => stop.status !== 'delivered')?.id ?? demoDeliveryRoute.stops[0]!.id);
  const [notice, setNotice] = useState('Route loaded. Customer contact details are available only during an active delivery.');
  const selectedStop = stops.find((stop) => stop.id === selectedId) ?? stops[0]!;
  const completed = stops.filter((stop) => stop.status === 'delivered').length;
  const remainingUnits = stops.filter((stop) => stop.status !== 'delivered').reduce((sum, stop) => sum + stop.units, 0);
  const progress = Math.round(completed / stops.length * 100);
  const activeAction = selectedStop.status === 'delivered' ? undefined : nextAction[selectedStop.status];
  const sortedStops = useMemo(() => [...stops].sort((a, b) => a.sequence - b.sequence), [stops]);

  const updateSelected = (status: DeliveryStopStatus, message: string) => {
    const updated = stops.map((stop) => stop.id === selectedStop.id ? { ...stop, status } : stop);
    setStops(updated);
    setNotice(message);
    if (status === 'delivered') {
      const next = updated.find((stop) => stop.status !== 'delivered');
      if (next) setSelectedId(next.id);
    }
  };

  return <View>
    <View style={styles.hero}><ScreenFrame>
      <Text style={styles.heroEyebrow}>PRIVATE DELIVERY WORKSPACE · FRIDAY, AUGUST 14</Text>
      <View style={styles.heroRow}><View style={styles.heroCopy}><Text style={styles.heroTitle}>Good afternoon, Samir.</Text><Text style={styles.heroText}>{demoDeliveryRoute.name} is ready. Complete each hand-off in sequence and keep Ugadi operations informed.</Text></View><View style={styles.routeBadge}><Text style={styles.routeBadgeValue}>{progress}%</Text><Text style={styles.routeBadgeLabel}>ROUTE COMPLETE</Text></View></View>
    </ScreenFrame></View>

    <ScreenFrame style={styles.page}>
      <View style={styles.notice}><Text style={styles.noticeIcon}>✓</Text><Text style={styles.noticeText}>{notice}</Text></View>
      <View style={styles.metrics}>
        {[
          ['ASSIGNED STOPS', String(stops.length), demoDeliveryRoute.routeWindow, '⌖'],
          ['COMPLETED', String(completed), `${stops.length - completed} deliveries remaining`, '✓'],
          ['UNITS ON BOARD', String(remainingUnits), demoDeliveryRoute.vehicleLabel, '▣'],
          ['NEXT ETA', selectedStop.eta.replace('Delivered ', ''), selectedStop.deliveryWindow, '→'],
        ].map(([label, value, note, icon]) => <View style={styles.metric} key={label}><View style={styles.metricTop}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricIcon}>{icon}</Text></View><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricNote}>{note}</Text></View>)}
      </View>

      <View style={[styles.workspace, !wide && styles.workspaceMobile]}>
        <View style={styles.stopListPanel}>
          <SectionHeading eyebrow="TODAY’S RUN" title="Assigned stops" copy="Select a stop to review only the delivery details you need." />
          <View style={styles.routeOrigin}><View style={styles.originIcon}><Text style={styles.originIconText}>U</Text></View><View style={{ flex: 1 }}><Text style={styles.originName}>{demoDeliveryRoute.startLocation}</Text><Text style={styles.originMeta}>{demoDeliveryRoute.deliveryPartner} · {demoDeliveryRoute.vehicleLabel}</Text></View><Chip label="Loaded" /></View>
          {sortedStops.map((stop) => <Pressable accessibilityRole="button" key={stop.id} onPress={() => setSelectedId(stop.id)} style={({ pressed }) => [styles.stopRow, selectedId === stop.id && styles.stopRowSelected, pressed && styles.pressed]}>
            <View style={[styles.sequence, stop.status === 'delivered' && styles.sequenceDone]}><Text style={[styles.sequenceText, stop.status === 'delivered' && styles.sequenceTextDone]}>{stop.status === 'delivered' ? '✓' : stop.sequence}</Text></View>
            <View style={styles.stopSummary}><Text style={styles.stopCustomer}>{stop.customerName}</Text><Text style={styles.stopAddress}>{stop.city} · {stop.units} {stop.units === 1 ? 'unit' : 'units'} · {stop.deliveryWindow}</Text><Text style={styles.stopOrder}>{stop.orderId}</Text></View>
            <Chip label={statusLabels[stop.status]} tone={stop.status === 'ready' ? 'neutral' : stop.status === 'exception' ? 'gold' : 'green'} />
          </Pressable>)}
        </View>

        <View style={styles.activePanel}>
          <View style={styles.activeTop}><View><Text style={styles.activeEyebrow}>STOP {selectedStop.sequence} · {selectedStop.orderId}</Text><Text style={styles.activeTitle}>{selectedStop.customerName}</Text></View><Chip label={statusLabels[selectedStop.status]} tone={selectedStop.status === 'exception' ? 'gold' : 'green'} /></View>
          <View style={styles.map}><View style={styles.streetA} /><View style={styles.streetB} /><View style={styles.routeLine} /><View style={styles.vanPin}><Text style={styles.pinText}>●</Text></View><View style={styles.dropPin}><Text style={styles.pinText}>◆</Text></View><View style={styles.etaBubble}><Text style={styles.etaBubbleText}>{selectedStop.eta}</Text></View></View>
          <View style={styles.addressCard}><Text style={styles.detailLabel}>DELIVER TO</Text><Text style={styles.address}>{selectedStop.address}</Text><Text style={styles.addressMeta}>{selectedStop.city}, ON · {selectedStop.postalCode}</Text></View>
          <View style={styles.detailGrid}>
            <View style={styles.detail}><Text style={styles.detailLabel}>CONTACT</Text><Text style={styles.detailValue}>{selectedStop.phone}</Text></View>
            <View style={styles.detail}><Text style={styles.detailLabel}>HAND-OFF</Text><Text style={styles.detailValue}>{selectedStop.units} {selectedStop.units === 1 ? 'package' : 'packages'} · {selectedStop.deliveryWindow}</Text></View>
          </View>
          {selectedStop.instructions ? <View style={styles.instructions}><Text style={styles.instructionsIcon}>i</Text><View style={{ flex: 1 }}><Text style={styles.detailLabel}>DELIVERY NOTE</Text><Text style={styles.instructionsText}>{selectedStop.instructions}</Text></View></View> : null}
          {selectedStop.status === 'delivered' ? <View style={styles.proof}><Text style={styles.proofIcon}>✓</Text><View><Text style={styles.proofTitle}>Proof of delivery recorded</Text><Text style={styles.proofCopy}>Timestamp and driver identity saved. Customer details are now hidden.</Text></View></View> : null}
          <View style={styles.actions}>
            {activeAction ? <Button label={activeAction.label} onPress={() => updateSelected(activeAction.status, activeAction.notice)} variant="secondary" /> : null}
            {selectedStop.status !== 'delivered' && selectedStop.status !== 'exception' ? <Button label="Report an issue" onPress={() => updateSelected('exception', 'Issue flagged for Ugadi dispatch. The stop remains assigned to you.')} variant="light" /> : null}
          </View>
          <Text style={styles.privacy}>For customer privacy, the full route and contact details are visible only to the assigned delivery partner during the active route.</Text>
        </View>
      </View>
    </ScreenFrame>
  </View>;
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.forest950, paddingTop: spacing.xxl, paddingBottom: 88 },
  heroEyebrow: { ...typography.micro, color: colors.lime300 },
  heroRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: spacing.xl },
  heroCopy: { flex: 1, minWidth: 280, maxWidth: 760 },
  heroTitle: { ...typography.h1, color: colors.paper, marginTop: spacing.sm },
  heroText: { ...typography.body, color: '#BFD0C2', marginTop: spacing.sm },
  routeBadge: { borderColor: '#356649', borderWidth: 1, borderRadius: radius.lg, padding: spacing.lg, minWidth: 150 },
  routeBadgeValue: { color: colors.paper, fontSize: 30, fontWeight: '900' },
  routeBadgeLabel: { ...typography.micro, color: colors.lime300, marginTop: spacing.xs },
  page: { marginTop: -52, paddingBottom: spacing.xxxl },
  notice: { backgroundColor: colors.successSoft, borderColor: colors.leaf500, borderWidth: 1, borderRadius: radius.md, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  noticeIcon: { color: colors.forest800, fontSize: 18, fontWeight: '900' },
  noticeText: { ...typography.small, color: colors.forest950, flex: 1, fontWeight: '700' },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  metric: { minWidth: 210, flexGrow: 1, flexBasis: 0, backgroundColor: colors.paper, borderRadius: radius.lg, padding: spacing.lg, borderColor: colors.line, borderWidth: 1, ...shadow },
  metricTop: { flexDirection: 'row', justifyContent: 'space-between' },
  metricLabel: { ...typography.micro, color: colors.inkSoft },
  metricIcon: { color: colors.leaf500, fontSize: 18, fontWeight: '900' },
  metricValue: { color: colors.ink, fontSize: 27, lineHeight: 32, fontWeight: '900', marginTop: spacing.md },
  metricNote: { ...typography.small, color: colors.inkSoft, marginTop: spacing.xs },
  workspace: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.lg, marginTop: spacing.xl },
  workspaceMobile: { flexDirection: 'column' },
  stopListPanel: { flex: 1, width: '100%', backgroundColor: colors.paper, borderRadius: radius.lg, borderColor: colors.line, borderWidth: 1, padding: spacing.xl },
  routeOrigin: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, backgroundColor: colors.canvas, borderRadius: radius.md, marginBottom: spacing.md },
  originIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.forest900, alignItems: 'center', justifyContent: 'center' },
  originIconText: { color: colors.paper, fontWeight: '900' },
  originName: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  originMeta: { ...typography.small, color: colors.inkSoft },
  stopRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderRadius: radius.md, borderColor: 'transparent', borderWidth: 2, marginBottom: spacing.xs },
  stopRowSelected: { borderColor: colors.leaf500, backgroundColor: colors.successSoft },
  pressed: { opacity: .78 },
  sequence: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.canvas, alignItems: 'center', justifyContent: 'center' },
  sequenceDone: { backgroundColor: colors.forest900 },
  sequenceText: { color: colors.forest900, fontWeight: '900' },
  sequenceTextDone: { color: colors.paper },
  stopSummary: { flex: 1 },
  stopCustomer: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  stopAddress: { ...typography.small, color: colors.inkSoft, marginTop: 2 },
  stopOrder: { ...typography.micro, color: colors.leaf600, marginTop: 2, letterSpacing: .4 },
  activePanel: { flex: 1.08, width: '100%', backgroundColor: colors.forest950, borderRadius: radius.lg, padding: spacing.xl, ...shadow },
  activeTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.md },
  activeEyebrow: { ...typography.micro, color: colors.lime300 },
  activeTitle: { ...typography.h2, color: colors.paper, marginTop: spacing.xs },
  map: { height: 190, backgroundColor: '#D9E8DA', borderRadius: radius.md, marginTop: spacing.xl, overflow: 'hidden' },
  streetA: { position: 'absolute', width: '130%', height: 14, backgroundColor: colors.paper, top: 82, left: -30, transform: [{ rotate: '-8deg' }] },
  streetB: { position: 'absolute', width: 12, height: '150%', backgroundColor: colors.paper, top: -40, left: '67%', transform: [{ rotate: '21deg' }] },
  routeLine: { position: 'absolute', width: '58%', height: 4, backgroundColor: colors.leaf600, top: 92, left: 65, transform: [{ rotate: '-7deg' }] },
  vanPin: { position: 'absolute', left: 54, top: 82 },
  dropPin: { position: 'absolute', right: 72, top: 67 },
  pinText: { color: colors.forest900, fontSize: 20 },
  etaBubble: { position: 'absolute', right: spacing.md, top: spacing.md, backgroundColor: colors.paper, borderRadius: radius.pill, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  etaBubbleText: { color: colors.forest900, fontSize: 12, fontWeight: '900' },
  addressCard: { borderBottomColor: '#28573A', borderBottomWidth: 1, paddingVertical: spacing.lg },
  detailLabel: { ...typography.micro, color: colors.lime300 },
  address: { color: colors.paper, fontSize: 18, fontWeight: '900', marginTop: spacing.xs },
  addressMeta: { ...typography.small, color: '#BFD0C2', marginTop: 2 },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, paddingVertical: spacing.lg },
  detail: { flex: 1, minWidth: 180 },
  detailValue: { ...typography.small, color: colors.paper, fontWeight: '800', marginTop: spacing.xs },
  instructions: { flexDirection: 'row', gap: spacing.md, backgroundColor: '#124D2C', borderRadius: radius.md, padding: spacing.md },
  instructionsIcon: { width: 26, height: 26, borderRadius: 13, color: colors.forest950, backgroundColor: colors.mango500, textAlign: 'center', lineHeight: 26, fontWeight: '900' },
  instructionsText: { ...typography.small, color: colors.paper, marginTop: spacing.xs },
  proof: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.successSoft, borderRadius: radius.md, padding: spacing.md },
  proofIcon: { color: colors.forest900, fontSize: 20, fontWeight: '900' },
  proofTitle: { color: colors.forest950, fontSize: 13, fontWeight: '900' },
  proofCopy: { ...typography.small, color: colors.inkSoft },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xl },
  privacy: { ...typography.small, color: '#91A596', marginTop: spacing.lg },
});
