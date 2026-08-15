import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Chip, ScreenFrame, SectionHeading } from '../../components/ui';
import { demoRetailPartner } from '../../data/partners';
import { formatCad } from '../../domain/commerce';
import { RetailInventoryItem, RetailSale } from '../../domain/partners';
import { colors, radius, shadow, spacing, typography } from '../../theme/tokens';

const stockLabel = (item: RetailInventoryItem) => item.status === 'healthy' ? 'In stock' : item.status === 'low' ? 'Low stock' : 'Out of stock';

export function RetailPartnerDashboard({ wide }: { wide: boolean }) {
  const [inventory, setInventory] = useState<RetailInventoryItem[]>(demoRetailPartner.inventory);
  const [sales, setSales] = useState<RetailSale[]>(demoRetailPartner.recentSales);
  const [selectedId, setSelectedId] = useState(demoRetailPartner.inventory[0]!.id);
  const [quantity, setQuantity] = useState(1);
  const [restockIds, setRestockIds] = useState<string[]>([]);
  const [notice, setNotice] = useState('Inventory is synced to the latest Ugadi consignment transfer.');
  const selected = inventory.find((item) => item.id === selectedId) ?? inventory[0]!;
  const todaySales = sales.filter((sale) => sale.recordedAt.startsWith('Today'));
  const unitsSoldToday = todaySales.reduce((sum, sale) => sum + sale.quantity, 0);
  const grossToday = todaySales.reduce((sum, sale) => sum + sale.totalCents, 0);
  const unitsOnHand = inventory.reduce((sum, item) => sum + item.unitsOnHand, 0);
  const wholesaleValue = inventory.reduce((sum, item) => sum + item.unitsOnHand * item.wholesaleCents, 0);

  const chooseItem = (id: string) => {
    setSelectedId(id);
    setQuantity(1);
  };

  const recordSale = () => {
    if (selected.unitsOnHand < quantity) return;
    const remaining = selected.unitsOnHand - quantity;
    setInventory((current) => current.map((item) => item.id === selected.id ? {
      ...item,
      unitsOnHand: remaining,
      status: remaining === 0 ? 'out_of_stock' : remaining <= item.reorderAt ? 'low' : 'healthy',
    } : item));
    setSales((current) => [{
      id: `SALE-PREVIEW-${current.length + 1}`,
      productId: selected.id,
      productName: selected.productName,
      quantity,
      totalCents: selected.retailCents * quantity,
      recordedAt: 'Today · Just now',
    }, ...current]);
    setNotice(`${quantity} × ${selected.productName} recorded. Store stock and the next settlement were updated.`);
    setQuantity(1);
  };

  const requestRestock = (item: RetailInventoryItem) => {
    if (!restockIds.includes(item.id)) setRestockIds((current) => [...current, item.id]);
    setNotice(`Replenishment requested for ${item.productName}. Ugadi operations will confirm the next transfer.`);
  };

  return <View>
    <View style={styles.hero}><ScreenFrame>
      <Text style={styles.heroEyebrow}>PARTNER STORE WORKSPACE · CONSIGNMENT SALES</Text>
      <View style={styles.heroRow}><View style={styles.heroCopy}><Text style={styles.heroTitle}>{demoRetailPartner.businessName}</Text><Text style={styles.heroText}>{demoRetailPartner.locationName} · Record in-store sales, monitor Ugadi-owned stock and request replenishment from one shared ledger.</Text></View><View style={styles.storeCard}><Text style={styles.storeCardLabel}>STORE CONTACT</Text><Text style={styles.storeCardValue}>{demoRetailPartner.contactName}</Text><Text style={styles.storeCardMeta}>{demoRetailPartner.address}</Text></View></View>
    </ScreenFrame></View>

    <ScreenFrame style={styles.page}>
      <View style={styles.notice}><Text style={styles.noticeIcon}>✓</Text><Text style={styles.noticeText}>{notice}</Text></View>
      <View style={styles.metrics}>
        {[
          ['SOLD TODAY', `${unitsSoldToday} units`, formatCad(grossToday), '↑'],
          ['ON HAND', `${unitsOnHand} units`, `${inventory.filter((item) => item.status === 'low').length} products need attention`, '▣'],
          ['STOCK VALUE', formatCad(wholesaleValue), 'Ugadi consignment value', '◇'],
          ['NEXT SETTLEMENT', 'Monday', demoRetailPartner.settlementSchedule, '✓'],
        ].map(([label, value, note, icon]) => <View style={styles.metric} key={label}><View style={styles.metricTop}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricIcon}>{icon}</Text></View><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricNote}>{note}</Text></View>)}
      </View>

      <View style={[styles.workspace, !wide && styles.workspaceMobile]}>
        <View style={styles.inventoryPanel}>
          <SectionHeading eyebrow="STORE INVENTORY" title="Ugadi products at this location" copy="Every unit is tied to a transfer and supplier lot for traceability." />
          {wide ? <View style={styles.inventoryHeader}><Text style={[styles.tableLabel, { flex: 1 }]}>PRODUCT</Text><Text style={styles.tableLabel}>ON HAND</Text><Text style={styles.tableLabel}>STATUS</Text></View> : null}
          {inventory.map((item) => <Pressable accessibilityRole="button" key={item.id} onPress={() => chooseItem(item.id)} style={({ pressed }) => [styles.inventoryRow, !wide && styles.inventoryRowMobile, selected.id === item.id && styles.inventoryRowSelected, pressed && styles.pressed]}>
            <View style={[styles.productMain, !wide && styles.productMainMobile]}><View style={styles.productMark}><Text style={styles.productMarkText}>{item.productName.split(' ').slice(0, 2).map((word) => word[0]).join('')}</Text></View>
            <View style={styles.productInfo}><Text style={styles.productName}>{item.productName}</Text><Text style={styles.productMeta}>{item.unitLabel} · {item.sku}</Text><Text style={styles.lotMeta}>Lot {item.lotCode} · Best before {item.bestBefore}</Text></View></View>
            <Text style={[styles.onHand, !wide && styles.onHandMobile]}>{item.unitsOnHand}{!wide ? ' units on hand' : ''}</Text>
            <Chip label={restockIds.includes(item.id) ? 'Requested' : stockLabel(item)} tone={item.status === 'healthy' ? 'green' : 'gold'} />
          </Pressable>)}
        </View>

        <View style={styles.salePanel}>
          <Text style={styles.saleEyebrow}>QUICK SELL-THROUGH</Text>
          <Text style={styles.saleTitle}>Record an in-store sale</Text>
          <Text style={styles.saleCopy}>This prototype records the sale against partner stock. Customer payment stays in the store’s existing point-of-sale system.</Text>
          <View style={styles.selectedProduct}><View><Text style={styles.selectedLabel}>SELECTED PRODUCT</Text><Text style={styles.selectedName}>{selected.productName}</Text><Text style={styles.selectedMeta}>{formatCad(selected.retailCents)} each · {selected.unitsOnHand} available</Text></View><Chip label={stockLabel(selected)} tone={selected.status === 'healthy' ? 'green' : 'gold'} /></View>
          <View style={styles.quantityRow}><View><Text style={styles.selectedLabel}>QUANTITY SOLD</Text><Text style={styles.quantityHelp}>Updates store inventory immediately</Text></View><View style={styles.stepper}><Pressable accessibilityRole="button" onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.stepButton}><Text style={styles.stepText}>−</Text></Pressable><Text style={styles.quantity}>{quantity}</Text><Pressable accessibilityRole="button" onPress={() => setQuantity(Math.min(selected.unitsOnHand, quantity + 1))} style={styles.stepButton}><Text style={styles.stepText}>＋</Text></Pressable></View></View>
          <View style={styles.saleTotal}><Text style={styles.saleTotalLabel}>SALE TOTAL</Text><Text style={styles.saleTotalValue}>{formatCad(selected.retailCents * quantity)}</Text></View>
          {selected.unitsOnHand > 0 ? <Button label="Record sale" onPress={recordSale} variant="secondary" /> : null}
          <Button label={restockIds.includes(selected.id) ? 'Replenishment requested' : 'Request replenishment'} onPress={() => requestRestock(selected)} variant="light" />
          <Text style={styles.settlementNote}>Ugadi invoices the agreed wholesale amount from the verified sell-through ledger. Taxes and final commercial terms require client accounting approval.</Text>
        </View>
      </View>

      <View style={[styles.lowerGrid, !wide && styles.workspaceMobile]}>
        <View style={styles.activityPanel}><SectionHeading eyebrow="RECENT SELL-THROUGH" title="Store sales activity" />{sales.slice(0, 4).map((sale) => <View style={styles.activityRow} key={sale.id}><View style={styles.saleIcon}><Text style={styles.saleIconText}>✓</Text></View><View style={{ flex: 1 }}><Text style={styles.activityName}>{sale.quantity} × {sale.productName}</Text><Text style={styles.activityMeta}>{sale.recordedAt} · {sale.id}</Text></View><Text style={styles.activityValue}>{formatCad(sale.totalCents)}</Text></View>)}</View>
        <View style={styles.transferPanel}><Text style={styles.transferEyebrow}>INBOUND TRANSFER</Text><Text style={styles.transferTitle}>TR-208 · Arriving Saturday</Text><Text style={styles.transferCopy}>8 Alphonso Reserve boxes and 6 Taste of Home gift boxes from the Ugadi Etobicoke hub.</Text><View style={styles.transferTimeline}><View style={styles.timelineDone}><Text style={styles.timelineText}>✓ Prepared</Text></View><View style={styles.timelineDone}><Text style={styles.timelineText}>✓ Assigned</Text></View><View style={styles.timelineNext}><Text style={styles.timelineNextText}>○ Receive at store</Text></View></View><Button label="Review transfer" onPress={() => setNotice('Transfer TR-208 is prepared. Receiving will require lot and quantity confirmation at the store.')} variant="ghost" /></View>
      </View>
    </ScreenFrame>
  </View>;
}

const styles = StyleSheet.create({
  hero: { backgroundColor: colors.forest950, paddingTop: spacing.xxl, paddingBottom: 88 },
  heroEyebrow: { ...typography.micro, color: colors.lime300 },
  heroRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: spacing.xl },
  heroCopy: { flex: 1, minWidth: 280, maxWidth: 720 },
  heroTitle: { ...typography.h1, color: colors.paper, marginTop: spacing.sm },
  heroText: { ...typography.body, color: '#BFD0C2', marginTop: spacing.sm },
  storeCard: { width: 300, maxWidth: '100%', backgroundColor: '#124D2C', borderRadius: radius.lg, padding: spacing.lg },
  storeCardLabel: { ...typography.micro, color: colors.lime300 },
  storeCardValue: { color: colors.paper, fontSize: 17, fontWeight: '900', marginTop: spacing.xs },
  storeCardMeta: { ...typography.small, color: '#BFD0C2', marginTop: spacing.xs },
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
  inventoryPanel: { flex: 1.4, width: '100%', backgroundColor: colors.paper, borderRadius: radius.lg, borderColor: colors.line, borderWidth: 1, padding: spacing.xl },
  inventoryHeader: { flexDirection: 'row', gap: spacing.lg, paddingHorizontal: spacing.md, paddingBottom: spacing.sm, borderBottomColor: colors.line, borderBottomWidth: 1 },
  tableLabel: { ...typography.micro, color: colors.inkSoft, width: 82, textAlign: 'right' },
  inventoryRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderRadius: radius.md, borderColor: 'transparent', borderWidth: 2, marginTop: spacing.xs },
  inventoryRowMobile: { flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md },
  inventoryRowSelected: { backgroundColor: colors.successSoft, borderColor: colors.leaf500 },
  pressed: { opacity: .78 },
  productMark: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.mango100, alignItems: 'center', justifyContent: 'center' },
  productMarkText: { color: colors.forest900, fontSize: 11, fontWeight: '900' },
  productMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  productMainMobile: { width: '100%', flexBasis: '100%' },
  productInfo: { flex: 1 },
  productName: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  productMeta: { ...typography.small, color: colors.inkSoft, marginTop: 2 },
  lotMeta: { ...typography.micro, color: colors.leaf600, letterSpacing: .25, marginTop: 3 },
  onHand: { color: colors.ink, fontSize: 22, fontWeight: '900', width: 64, textAlign: 'center' },
  onHandMobile: { width: 'auto', fontSize: 13, textAlign: 'left', marginLeft: 54 },
  salePanel: { flex: .85, width: '100%', backgroundColor: colors.forest950, borderRadius: radius.lg, padding: spacing.xl, gap: spacing.md, ...shadow },
  saleEyebrow: { ...typography.micro, color: colors.lime300 },
  saleTitle: { ...typography.h2, color: colors.paper },
  saleCopy: { ...typography.small, color: '#BFD0C2' },
  selectedProduct: { backgroundColor: '#124D2C', borderRadius: radius.md, padding: spacing.md, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing.md },
  selectedLabel: { ...typography.micro, color: colors.lime300 },
  selectedName: { color: colors.paper, fontSize: 15, fontWeight: '900', marginTop: spacing.xs },
  selectedMeta: { ...typography.small, color: '#BFD0C2', marginTop: 2 },
  quantityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  quantityHelp: { ...typography.small, color: '#BFD0C2', marginTop: 2 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  stepButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center' },
  stepText: { color: colors.forest900, fontSize: 20, fontWeight: '900' },
  quantity: { color: colors.paper, width: 26, textAlign: 'center', fontSize: 18, fontWeight: '900' },
  saleTotal: { borderTopColor: '#28573A', borderTopWidth: 1, paddingTop: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  saleTotalLabel: { ...typography.micro, color: colors.lime300 },
  saleTotalValue: { color: colors.paper, fontSize: 25, fontWeight: '900' },
  settlementNote: { ...typography.small, color: '#91A596' },
  lowerGrid: { flexDirection: 'row', alignItems: 'stretch', gap: spacing.lg, marginTop: spacing.lg },
  activityPanel: { flex: 1.3, width: '100%', backgroundColor: colors.paper, borderRadius: radius.lg, borderColor: colors.line, borderWidth: 1, padding: spacing.xl },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, borderTopColor: colors.line, borderTopWidth: 1 },
  saleIcon: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.successSoft, alignItems: 'center', justifyContent: 'center' },
  saleIconText: { color: colors.forest900, fontWeight: '900' },
  activityName: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  activityMeta: { ...typography.small, color: colors.inkSoft },
  activityValue: { color: colors.forest900, fontSize: 13, fontWeight: '900' },
  transferPanel: { flex: .7, width: '100%', backgroundColor: colors.mango100, borderRadius: radius.lg, padding: spacing.xl },
  transferEyebrow: { ...typography.micro, color: colors.leaf600 },
  transferTitle: { ...typography.h3, color: colors.ink, marginTop: spacing.xs },
  transferCopy: { ...typography.small, color: colors.inkSoft, marginTop: spacing.sm },
  transferTimeline: { gap: spacing.sm, marginVertical: spacing.xl },
  timelineDone: { borderLeftColor: colors.leaf500, borderLeftWidth: 3, paddingLeft: spacing.md },
  timelineNext: { borderLeftColor: colors.paper, borderLeftWidth: 3, paddingLeft: spacing.md },
  timelineText: { ...typography.small, color: colors.forest900, fontWeight: '900' },
  timelineNextText: { ...typography.small, color: colors.inkSoft, fontWeight: '700' },
});
