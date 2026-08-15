import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Chip, ScreenFrame, SectionHeading } from '../../components/ui';
import { colors, radius, shadow, spacing, typography } from '../../theme/tokens';

export function AdminDashboard({ wide }: { wide: boolean }) {
  return <View>
    <View style={styles.welcome}><ScreenFrame><Text style={styles.welcomeEyebrow}>FRIDAY, AUGUST 14 · TORONTO</Text><Text style={styles.welcomeTitle}>Good evening, Priya.</Text><Text style={styles.welcomeCopy}>Orders are healthy. Two items need attention before tomorrow’s delivery run.</Text></ScreenFrame></View>
    <ScreenFrame style={styles.page}>
      <View style={styles.metrics}>
        {([
          ['TODAY’S ORDERS', '29', '+12% from last Friday', '↑'],
          ['NET SALES', '$2,846.50', '28 payments captured', '◇'],
          ['UNITS AVAILABLE', '67', 'Across 3 active SKUs', '▣'],
          ['ON-TIME DELIVERY', '96%', 'Last 30 days', '✓'],
        ] as const).map(([label, value, note, icon]) => <View style={styles.metric} key={label}><View style={styles.metricTop}><Text style={styles.metricLabel}>{label}</Text><Text style={styles.metricIcon}>{icon}</Text></View><Text style={styles.metricValue}>{value}</Text><Text style={styles.metricNote}>{note}</Text></View>)}
      </View>

      <View style={[styles.mainGrid, !wide && styles.mainGridMobile]}>
        <View style={styles.ordersPanel}>
          <SectionHeading eyebrow="FULFILMENT" title="Today’s order board" action={<Button label="View all orders" onPress={() => {}} compact variant="ghost" />} />
          <View style={styles.stages}>
            {([
              ['NEW', 6, colors.mango500], ['PACKING', 9, colors.leaf500], ['OUT TODAY', 14, colors.forest800], ['COMPLETED', 38, colors.line],
            ] as const).map(([label, count, color]) => <View style={styles.stage} key={label}><View style={[styles.stageAccent, { backgroundColor: color }]} /><Text style={styles.stageLabel}>{label}</Text><Text style={styles.stageValue}>{count}</Text><Text style={styles.stageMeta}>orders</Text></View>)}
          </View>
          <View style={styles.orderList}>
            {([
              ['UG-1054', 'Neha Sharma', '2 items · Toronto', 'New'],
              ['UG-1053', 'Ravi Patel', '1 item · Mississauga', 'Packing'],
              ['UG-1051', 'Meera Iyer', '3 items · Brampton', 'Ready'],
            ] as const).map(([id, name, summary, status]) => <Pressable style={styles.orderRow} key={id}><View style={styles.orderAvatar}><Text style={styles.orderAvatarText}>{name.split(' ').map((part) => part[0]).join('')}</Text></View><View style={{ flex: 1 }}><Text style={styles.orderName}>{name}</Text><Text style={styles.orderSummary}>{id} · {summary}</Text></View><Chip label={status} tone={status === 'New' ? 'gold' : 'green'} /><Text style={styles.chevron}>›</Text></Pressable>)}
          </View>
        </View>

        <View style={styles.sideColumn}>
          <View style={styles.attention}>
            <Text style={styles.panelEyebrow}>NEEDS ATTENTION</Text>
            <View style={styles.alert}><Text style={styles.alertIcon}>!</Text><View style={{ flex: 1 }}><Text style={styles.alertTitle}>Gift box inventory is low</Text><Text style={styles.alertCopy}>7 remaining · 4 already reserved</Text></View></View>
            <View style={styles.alert}><Text style={styles.alertIcon}>⌖</Text><View style={{ flex: 1 }}><Text style={styles.alertTitle}>One address needs review</Text><Text style={styles.alertCopy}>Order UG-1049 · postal code mismatch</Text></View></View>
            <Button label="Resolve issues" onPress={() => {}} variant="secondary" />
          </View>
          <View style={styles.routes}>
            <Text style={styles.panelEyebrow}>TODAY’S ROUTES</Text>
            {([
              ['Toronto West', '8 stops · 2:00–5:00 PM', 'Packing'],
              ['Mississauga', '6 stops · 3:00–6:00 PM', 'Ready'],
            ] as const).map(([name, summary, status]) => <View style={styles.route} key={name}><View style={styles.routeIcon}><Text>⌁</Text></View><View style={{ flex: 1 }}><Text style={styles.routeName}>{name}</Text><Text style={styles.routeSummary}>{summary}</Text></View><Chip label={status} tone="neutral" /></View>)}
          </View>
          <View style={styles.routes}>
            <Text style={styles.panelEyebrow}>CATALOGUE READINESS</Text>
            {([
              ['Fresh fruits', '3 live products', 'Live'],
              ['Fresh vegetables', 'Category prepared', 'Planned'],
              ['Spices & pantry', 'Category prepared', 'Planned'],
            ] as const).map(([name, summary, status]) => <View style={styles.route} key={name}><View style={styles.routeIcon}><Text>✦</Text></View><View style={{ flex: 1 }}><Text style={styles.routeName}>{name}</Text><Text style={styles.routeSummary}>{summary}</Text></View><Chip label={status} tone={status === 'Live' ? 'green' : 'neutral'} /></View>)}
          </View>
        </View>
      </View>
    </ScreenFrame>
  </View>;
}

const styles = StyleSheet.create({
  welcome: { backgroundColor: colors.forest950, paddingTop: spacing.xxl, paddingBottom: 86 },
  welcomeEyebrow: { ...typography.micro, color: colors.lime300 },
  welcomeTitle: { ...typography.h1, color: colors.paper, marginTop: spacing.sm },
  welcomeCopy: { ...typography.body, color: '#BFD0C2', marginTop: spacing.sm },
  page: { marginTop: -52, paddingBottom: spacing.xxxl },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  metric: { minWidth: 215, flexGrow: 1, flexBasis: 0, backgroundColor: colors.paper, borderRadius: radius.lg, padding: spacing.xl, borderColor: colors.line, borderWidth: 1, ...shadow },
  metricTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metricLabel: { ...typography.micro, color: colors.inkSoft, letterSpacing: .7 },
  metricIcon: { color: colors.leaf500, fontSize: 20, fontWeight: '900' },
  metricValue: { color: colors.ink, fontSize: 28, fontWeight: '900', marginTop: spacing.lg },
  metricNote: { ...typography.small, color: colors.leaf600, marginTop: spacing.xs },
  mainGrid: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.lg, marginTop: spacing.xl },
  mainGridMobile: { flexDirection: 'column' },
  ordersPanel: { flex: 1.75, width: '100%', backgroundColor: colors.paper, borderRadius: radius.lg, padding: spacing.xl, borderColor: colors.line, borderWidth: 1 },
  stages: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  stage: { minWidth: 120, flexGrow: 1, backgroundColor: colors.canvas, borderRadius: radius.md, padding: spacing.lg, overflow: 'hidden' },
  stageAccent: { height: 5, position: 'absolute', top: 0, left: 0, right: 0 },
  stageLabel: { ...typography.micro, color: colors.inkSoft, marginTop: spacing.sm },
  stageValue: { color: colors.ink, fontSize: 28, fontWeight: '900', marginTop: spacing.sm },
  stageMeta: { ...typography.small, color: colors.inkSoft },
  orderList: { marginTop: spacing.xl, borderTopColor: colors.line, borderTopWidth: 1 },
  orderRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, borderBottomColor: colors.line, borderBottomWidth: 1 },
  orderAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.mango100, alignItems: 'center', justifyContent: 'center' },
  orderAvatarText: { color: colors.forest900, fontSize: 12, fontWeight: '900' },
  orderName: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  orderSummary: { ...typography.small, color: colors.inkSoft, marginTop: 2 },
  chevron: { color: colors.leaf600, fontSize: 22 },
  sideColumn: { flex: 1, width: '100%', gap: spacing.lg },
  attention: { backgroundColor: colors.forest950, borderRadius: radius.lg, padding: spacing.xl, ...shadow },
  panelEyebrow: { ...typography.micro, color: colors.lime300, marginBottom: spacing.lg },
  alert: { backgroundColor: '#124D2C', borderRadius: radius.md, padding: spacing.md, flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  alertIcon: { color: colors.mango500, fontSize: 18, fontWeight: '900' },
  alertTitle: { color: colors.paper, fontSize: 13, fontWeight: '900' },
  alertCopy: { ...typography.small, color: '#B8CDBC', marginTop: 2 },
  routes: { backgroundColor: colors.paper, borderRadius: radius.lg, padding: spacing.xl, borderColor: colors.line, borderWidth: 1 },
  route: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md, borderBottomColor: colors.line, borderBottomWidth: 1 },
  routeIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.successSoft, alignItems: 'center', justifyContent: 'center' },
  routeName: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  routeSummary: { ...typography.small, color: colors.inkSoft, marginTop: 2 },
});
