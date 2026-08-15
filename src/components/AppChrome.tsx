import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Brand, Button, ScreenFrame } from './ui';
import { colors, radius, spacing, typography } from '../theme/tokens';

export type CustomerTab = 'shop' | 'orders' | 'account';

const customerTabs: { key: CustomerTab; label: string }[] = [
  { key: 'shop', label: 'The market' },
  { key: 'orders', label: 'My orders' },
  { key: 'account', label: 'Account' },
];

export function CustomerHeader({
  activeTab,
  onTab,
  cartCount,
  onCart,
  onAdmin,
  wide,
}: {
  activeTab: CustomerTab;
  onTab: (tab: CustomerTab) => void;
  cartCount: number;
  onCart: () => void;
  onAdmin: () => void;
  wide: boolean;
}) {
  return (
    <View style={styles.header}>
      <ScreenFrame style={styles.headerInner}>
        <Pressable onPress={() => onTab('shop')}><Brand /></Pressable>
        {wide ? <View style={styles.desktopNav}>{customerTabs.map((item) => <Pressable key={item.key} onPress={() => onTab(item.key)} style={[styles.navLink, activeTab === item.key && styles.navLinkActive]}><Text style={[styles.navText, activeTab === item.key && styles.navTextActive]}>{item.label}</Text></Pressable>)}</View> : null}
        <View style={styles.headerActions}>
          {wide ? <Pressable onPress={onAdmin}><Text style={styles.adminLink}>Admin preview</Text></Pressable> : null}
          <Button label={wide ? `Basket · ${cartCount}` : `${cartCount}`} icon="⌑" onPress={onCart} compact variant={cartCount ? 'secondary' : 'ghost'} />
        </View>
      </ScreenFrame>
    </View>
  );
}

export function MobileNav({ activeTab, onTab }: { activeTab: CustomerTab; onTab: (tab: CustomerTab) => void }) {
  const items: { key: CustomerTab; label: string; icon: string }[] = [
    { key: 'shop', label: 'Shop', icon: '⌂' },
    { key: 'orders', label: 'Orders', icon: '▣' },
    { key: 'account', label: 'Account', icon: '○' },
  ];
  return <View style={styles.mobileNav}>{items.map((item) => <Pressable key={item.key} style={styles.mobileNavItem} onPress={() => onTab(item.key)}><Text style={[styles.mobileIcon, activeTab === item.key && styles.mobileActive]}>{item.icon}</Text><Text style={[styles.mobileLabel, activeTab === item.key && styles.mobileActive]}>{item.label}</Text></Pressable>)}</View>;
}

export function AdminHeader({ onShop }: { onShop: () => void }) {
  return <View style={styles.adminHeader}><ScreenFrame style={styles.headerInner}><Brand inverse /><View style={styles.adminMode}><Text style={styles.adminModeText}>OPERATIONS CONSOLE</Text></View><Button label="View storefront" onPress={onShop} variant="light" compact /></ScreenFrame></View>;
}

const styles = StyleSheet.create({
  header: { backgroundColor: colors.paper, borderBottomColor: colors.line, borderBottomWidth: 1 },
  adminHeader: { backgroundColor: colors.forest950, borderBottomColor: colors.lime300, borderBottomWidth: 3 },
  headerInner: { minHeight: 74, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.lg },
  desktopNav: { flexDirection: 'row', alignSelf: 'stretch' },
  navLink: { justifyContent: 'center', paddingHorizontal: spacing.lg, borderBottomWidth: 3, borderBottomColor: 'transparent' },
  navLinkActive: { borderBottomColor: colors.leaf500 },
  navText: { ...typography.small, color: colors.inkSoft, fontWeight: '700' },
  navTextActive: { color: colors.forest900, fontWeight: '900' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  adminLink: { ...typography.small, color: colors.inkSoft, textDecorationLine: 'underline' },
  adminMode: { backgroundColor: '#134F2D', borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 6 },
  adminModeText: { ...typography.micro, color: colors.lime300 },
  mobileNav: { backgroundColor: colors.ivory, borderTopColor: colors.line, borderTopWidth: 1, minHeight: 70, flexDirection: 'row', paddingBottom: 7, paddingTop: 6 },
  mobileNavItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  mobileIcon: { color: colors.inkSoft, fontSize: 20, fontWeight: '700' },
  mobileLabel: { ...typography.micro, color: colors.inkSoft, letterSpacing: .4, marginTop: 2 },
  mobileActive: { color: colors.forest900 },
});
