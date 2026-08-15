import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { AdminHeader, CustomerHeader, CustomerTab, MobileNav } from './src/components/AppChrome';
import { Brand, ScreenFrame } from './src/components/ui';
import { CartLine, Order, Product } from './src/domain/commerce';
import { demoRewardAccount, rewardOffers } from './src/data/rewards';
import { AccountScreen } from './src/screens/customer/AccountScreen';
import { CartScreen } from './src/screens/customer/CartScreen';
import { OrdersScreen } from './src/screens/customer/OrdersScreen';
import { PaymentScreen } from './src/screens/customer/PaymentScreen';
import { ShopScreen } from './src/screens/customer/ShopScreen';
import { AdminDashboard } from './src/screens/admin/AdminDashboard';
import { colors, spacing, typography } from './src/theme/tokens';

type AppMode = 'customer' | 'admin';

export default function App() {
  const scrollRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const wide = width >= 860;
  const [mode, setMode] = useState<AppMode>('customer');
  const [tab, setTab] = useState<CustomerTab>('shop');
  const [cartOpen, setCartOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [recentOrder, setRecentOrder] = useState<Order>();
  const [selectedRewardId, setSelectedRewardId] = useState<string | null>(null);
  const cartCount = cart.reduce((total, line) => total + line.quantity, 0);
  const selectedReward = rewardOffers.find((offer) => offer.id === selectedRewardId);

  const changeTab = (nextTab: CustomerTab) => {
    setTab(nextTab);
    setCartOpen(false);
    setPaymentOpen(false);
  };

  const addProduct = (product: Product) => {
    setCart((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      return existing
        ? current.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line)
        : [...current, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((current) => quantity <= 0
      ? current.filter((line) => line.product.id !== productId)
      : current.map((line) => line.product.id === productId ? { ...line, quantity } : line));
  };

  const finishPayment = (order: Order) => {
    setRecentOrder(order);
    setCart([]);
    setSelectedRewardId(null);
    setPaymentOpen(false);
    setCartOpen(false);
    setTab('orders');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style={mode === 'admin' ? 'light' : 'dark'} />
      {mode === 'admin'
        ? <AdminHeader onShop={() => { setMode('customer'); setTab('shop'); }} />
        : <CustomerHeader activeTab={tab} onTab={changeTab} cartCount={cartCount} onCart={() => { setPaymentOpen(false); setCartOpen(true); }} onAdmin={() => setMode('admin')} wide={wide} />}

      <ScrollView ref={scrollRef} key={mode === 'admin' ? 'admin' : paymentOpen ? 'payment' : cartOpen ? 'cart' : tab} style={styles.scroll} contentContainerStyle={!wide && mode === 'customer' ? styles.mobileScroll : undefined}>
        {mode === 'admin'
          ? <AdminDashboard wide={wide} />
          : paymentOpen
            ? <PaymentScreen
              lines={cart}
              wide={wide}
              rewardAccount={demoRewardAccount}
              selectedReward={selectedReward}
              onBack={() => { setPaymentOpen(false); setCartOpen(true); }}
              onPaymentSuccess={() => scrollRef.current?.scrollTo({ y: 0, animated: false })}
              onComplete={finishPayment}
            />
            : cartOpen
            ? <CartScreen
              lines={cart}
              wide={wide}
              onBack={() => setCartOpen(false)}
              onQuantity={updateQuantity}
              rewardAccount={demoRewardAccount}
              rewardOffers={rewardOffers}
              selectedReward={selectedReward}
              onRewardChange={setSelectedRewardId}
              onCheckout={() => { setCartOpen(false); setPaymentOpen(true); }}
            />
            : tab === 'shop'
              ? <><ShopScreen wide={wide} onAdd={addProduct} onCart={() => setCartOpen(true)} /><CustomerFooter /></>
              : tab === 'orders'
                ? <OrdersScreen wide={wide} recentOrder={recentOrder} />
                : <AccountScreen
                  wide={wide}
                  onAdmin={() => setMode('admin')}
                  rewardAccount={demoRewardAccount}
                  rewardOffers={rewardOffers}
                  selectedReward={selectedReward}
                  onRewardChange={setSelectedRewardId}
                />}
      </ScrollView>

      {!wide && mode === 'customer' && !cartOpen && !paymentOpen ? <MobileNav activeTab={tab} onTab={changeTab} /> : null}
    </SafeAreaView>
  );
}

function CustomerFooter() {
  return <View style={styles.footer}><ScreenFrame style={styles.footerInner}>
    <View style={styles.footerBrand}><Brand inverse /><Text style={styles.footerPromise}>Authentic taste from India, delivered with care across Canada.</Text></View>
    <View style={styles.footerColumns}>
      <View><Text style={styles.footerLabel}>SHOP</Text><Text style={styles.footerLink}>Fresh fruits</Text><Text style={styles.footerLink}>Vegetables</Text><Text style={styles.footerLink}>Spices & pantry</Text></View>
      <View><Text style={styles.footerLabel}>SUPPORT</Text><Text style={styles.footerLink}>Track an order</Text><Text style={styles.footerLink}>Contact us</Text><Text style={styles.footerLink}>Delivery policy</Text></View>
      <View><Text style={styles.footerLabel}>CONNECT</Text><Text style={styles.footerLink}>www.ugadi.ca</Text><Text style={styles.footerLink}>Toronto, Ontario</Text><Text style={styles.footerLink}>Seasonal updates</Text></View>
    </View>
  </ScreenFrame><ScreenFrame><View style={styles.footerBottom}><Text style={styles.footerLegal}>© 2026 Ugadi Canada · Prototype experience</Text><Text style={styles.footerLegal}>Privacy · Terms · Accessibility</Text></View></ScreenFrame></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ivory },
  scroll: { flex: 1, backgroundColor: colors.canvas },
  mobileScroll: { paddingBottom: 86 },
  footer: { backgroundColor: colors.forest950, paddingTop: spacing.xxxl, paddingBottom: spacing.xl },
  footerInner: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing.xxxl },
  footerBrand: { maxWidth: 330 },
  footerPromise: { ...typography.body, color: '#BFD0C2', marginTop: spacing.xl },
  footerColumns: { flex: 1, minWidth: 320, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing.xl },
  footerLabel: { ...typography.micro, color: colors.lime300, marginBottom: spacing.md },
  footerLink: { ...typography.small, color: colors.paper, marginBottom: spacing.sm },
  footerBottom: { borderTopColor: '#28573A', borderTopWidth: 1, marginTop: spacing.xxl, paddingTop: spacing.lg, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing.md },
  footerLegal: { ...typography.small, color: '#91A596' },
});
