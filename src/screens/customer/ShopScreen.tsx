import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { activeCampaign, categories, products } from '../../data/catalog';
import { brandImages, categoryImages, productImages } from '../../data/assets';
import { Product, ProductCategory, formatCad } from '../../domain/commerce';
import { Button, Chip, ScreenFrame, SectionHeading } from '../../components/ui';
import { colors, radius, shadow, spacing, typography } from '../../theme/tokens';

export function ShopScreen({
  wide,
  onAdd,
  onCart,
}: {
  wide: boolean;
  onAdd: (product: Product) => void;
  onCart: () => void;
}) {
  return (
    <View>
      <ScreenFrame style={styles.heroFrame}>
        <ImageBackground source={brandImages.hero} resizeMode="cover" imageStyle={styles.heroImage} style={[styles.hero, !wide && styles.heroMobile]}>
          {!wide ? <View style={styles.mobileMedallion}><Image source={productImages['alphonso-box']} style={styles.mobileMedallionImage} resizeMode="cover" /></View> : null}
          <View style={[styles.heroPanel, !wide && styles.heroPanelMobile]}>
            <Text style={styles.heroEyebrow}>AUTHENTIC INDIA · CLOSER TO HOME</Text>
            <Text style={[styles.heroTitle, !wide && styles.heroTitleMobile]}>A curated Indian market, beautifully delivered.</Text>
            <Text style={styles.heroCopy}>Seasonal fruits today. Fresh vegetables, spices and pantry essentials tomorrow—all selected with care for Canadian homes.</Text>
            <View style={styles.heroActions}>
              <Button label="Shop mango season" onPress={() => {}} variant="secondary" />
              <Button label="Track an order" onPress={() => {}} variant="light" />
            </View>
            <View style={styles.route}><Text style={styles.routeText}>INDIA</Text><View style={styles.routeLine} /><Text style={styles.routePlane}>✈</Text><View style={styles.routeLine} /><Text style={styles.routeText}>TORONTO</Text></View>
          </View>
        </ImageBackground>
      </ScreenFrame>

      <ScreenFrame style={styles.categorySection}>
        <SectionHeading eyebrow="EXPLORE UGADI" title="India’s pantry, produce and seasons" copy="One trusted destination for regional flavour, fresh arrivals and thoughtful festival collections." />
        <View style={styles.categoryGrid}>
          {categories.map((category) => <CategoryCard category={category} wide={wide} key={category.slug} />)}
        </View>
      </ScreenFrame>

      <View style={styles.assuranceBand}>
        <ScreenFrame style={styles.assuranceInner}>
          {[
            ['✦', 'Premium selection', 'Chosen for aroma, texture and flavour'],
            ['⌖', 'GTA delivery', 'Carefully scheduled local delivery'],
            ['♡', 'Handled with care', 'Protected from arrival to your door'],
            ['✓', 'Freshness promise', 'Responsive support for every order'],
          ].map(([icon, title, copy]) => <View style={styles.assuranceItem} key={title}><Text style={styles.assuranceIcon}>{icon}</Text><View><Text style={styles.assuranceTitle}>{title}</Text><Text style={styles.assuranceCopy}>{copy}</Text></View></View>)}
        </ScreenFrame>
      </View>

      <ScreenFrame style={styles.collection}>
        <SectionHeading eyebrow={activeCampaign.eyebrow} title={activeCampaign.title} copy={activeCampaign.description} action={wide ? <Button label="View basket" onPress={onCart} variant="ghost" compact /> : undefined} />
        <View style={styles.productGrid}>
          {products.map((product) => <ProductCard product={product} wide={wide} onAdd={() => onAdd(product)} key={product.id} />)}
        </View>
      </ScreenFrame>

      <ScreenFrame style={styles.storyFrame}>
        <View style={[styles.story, !wide && styles.storyMobile]}>
          <View style={styles.storyLead}>
            <Text style={styles.storyEyebrow}>OUR JOURNEY</Text>
            <Text style={styles.storyTitle}>A better way to bring India home.</Text>
            <Text style={styles.storyCopy}>Ugadi Canada connects the flavours people remember with the care modern families expect. Every category is designed around trusted origin, clear product information and a reliable local delivery experience.</Text>
          </View>
          <View style={styles.steps}>
            {[
              ['01', 'Selected at origin', 'Authentic varieties chosen for the character that makes each region distinctive.'],
              ['02', 'Protected in transit', 'Thoughtful handling and packing maintain quality through the journey.'],
              ['03', 'Delivered locally', 'Clear windows and order updates make the final mile feel effortless.'],
            ].map(([number, title, copy]) => <View style={styles.step} key={number}><Text style={styles.stepNumber}>{number}</Text><View style={{ flex: 1 }}><Text style={styles.stepTitle}>{title}</Text><Text style={styles.stepCopy}>{copy}</Text></View></View>)}
          </View>
        </View>
      </ScreenFrame>

      <ScreenFrame style={styles.deliveryFrame}>
        <View style={[styles.deliveryCard, !wide && styles.deliveryMobile]}>
          <View style={styles.deliveryIcon}><Text style={styles.deliveryIconText}>⌖</Text></View>
          <View style={{ flex: 1 }}><Text style={styles.deliveryEyebrow}>TORONTO · GTA · SELECT ONTARIO CITIES</Text><Text style={styles.deliveryTitle}>See when Ugadi delivers to your neighbourhood.</Text><Text style={styles.deliveryCopy}>Enter your postal code during checkout for available dates, delivery fees and the earliest window.</Text></View>
          <Button label="Check your postal code" onPress={onCart} variant="secondary" />
        </View>
      </ScreenFrame>
    </View>
  );
}

function CategoryCard({ category, wide }: { category: ProductCategory; wide: boolean }) {
  const available = category.availability === 'available';
  return <Pressable style={[styles.categoryCard, wide && styles.categoryCardWide]}>
    <ImageBackground source={categoryImages[category.imageKey]} resizeMode="cover" style={styles.categoryImage} imageStyle={styles.categoryImageStyle}>
      <View style={styles.categoryShade} />
      <View style={styles.categoryStatus}><Text style={styles.categoryStatusText}>{available ? 'SHOP NOW' : 'COMING SOON'}</Text></View>
      <View style={styles.categoryBody}>
        <Text style={styles.categoryName}>{category.name}</Text>
        <Text style={styles.categoryDescription}>{category.description}</Text>
        <Text style={styles.categoryArrow}>{available ? 'Explore collection  →' : 'Preview category  →'}</Text>
      </View>
    </ImageBackground>
  </Pressable>;
}

function ProductCard({ product, onAdd, wide }: { product: Product; onAdd: () => void; wide: boolean }) {
  return (
    <View style={[styles.productCard, wide && styles.productCardWide]}>
      <View style={styles.productImageWrap}>
        <Image source={productImages[product.imageKey]} style={styles.productImage} resizeMode="cover" />
        <View style={styles.seasonBadge}><Text style={styles.seasonBadgeText}>SEASONAL RELEASE</Text></View>
      </View>
      <View style={styles.productBody}>
        <View style={styles.productMeta}><Chip label={product.variety} /><Text style={styles.stock}>{product.inventory < 10 ? `Only ${product.inventory} left` : 'In stock'}</Text></View>
        <Text style={styles.productOrigin}>⌖ {product.origin}</Text>
        <Text style={styles.productName}>{product.name}</Text>
        <Text style={styles.productDescription}>{product.description}</Text>
        <View style={styles.productFooter}>
          <View><Text style={styles.productPrice}>{formatCad(product.unitPriceCents)}</Text><Text style={styles.productUnit}>{product.unitLabel}</Text></View>
          <Pressable accessibilityLabel={`Add ${product.name} to basket`} onPress={onAdd} style={({ pressed }) => [styles.addButton, pressed && { opacity: .8 }]}><Text style={styles.addButtonText}>＋</Text></Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroFrame: { paddingTop: spacing.xl },
  hero: { minHeight: 610, borderRadius: radius.xl, overflow: 'hidden', justifyContent: 'center', padding: spacing.xxxl, backgroundColor: colors.mango100, ...shadow },
  heroMobile: { minHeight: 690, justifyContent: 'flex-end', padding: spacing.lg },
  heroImage: { borderRadius: radius.xl },
  mobileMedallion: { position: 'absolute', top: 28, right: 28, width: 210, height: 210, borderRadius: 105, borderColor: colors.ivory, borderWidth: 8, overflow: 'hidden', ...shadow },
  mobileMedallionImage: { width: '100%', height: '100%' },
  heroPanel: { maxWidth: 585, padding: spacing.xxl, borderRadius: radius.lg, backgroundColor: 'rgba(255,253,245,0.92)' },
  heroPanelMobile: { maxWidth: '100%', padding: spacing.xl },
  heroEyebrow: { ...typography.micro, color: colors.leaf600, marginBottom: spacing.md },
  heroTitle: { ...typography.display, color: colors.forest950, maxWidth: 520 },
  heroTitleMobile: { ...typography.h1 },
  heroCopy: { ...typography.body, color: colors.inkSoft, maxWidth: 500, marginTop: spacing.lg },
  heroActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.xl },
  route: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.xl },
  routeText: { ...typography.micro, color: colors.forest900 },
  routeLine: { height: 1, width: 34, backgroundColor: colors.leaf500 },
  routePlane: { color: colors.leaf600, fontSize: 16 },
  categorySection: { paddingTop: spacing.xxxl, paddingBottom: spacing.xxxl },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  categoryCard: { width: '100%', minHeight: 320, borderRadius: radius.lg, overflow: 'hidden', ...shadow },
  categoryCardWide: { width: '23.4%', minWidth: 240, flexGrow: 1, flexBasis: 0 },
  categoryImage: { minHeight: 320, flex: 1, justifyContent: 'space-between', padding: spacing.lg },
  categoryImageStyle: { borderRadius: radius.lg },
  categoryShade: { position: 'absolute', inset: 0, backgroundColor: 'rgba(4,38,18,.28)' },
  categoryStatus: { alignSelf: 'flex-start', backgroundColor: colors.ivory, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 7 },
  categoryStatusText: { ...typography.micro, color: colors.forest900, letterSpacing: .6 },
  categoryBody: { backgroundColor: 'rgba(4,43,21,.88)', borderRadius: radius.md, padding: spacing.lg },
  categoryName: { ...typography.h3, color: colors.paper },
  categoryDescription: { ...typography.small, color: '#D6E3D7', marginTop: spacing.sm, minHeight: 51 },
  categoryArrow: { ...typography.small, color: colors.lime300, fontWeight: '900', marginTop: spacing.md },
  assuranceBand: { backgroundColor: colors.forest950, marginTop: spacing.xl },
  assuranceInner: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingVertical: spacing.xl, gap: spacing.lg },
  assuranceItem: { minWidth: 220, flexGrow: 1, flexBasis: 0, maxWidth: 280, flexDirection: 'row', gap: spacing.md, alignItems: 'center' },
  assuranceIcon: { color: colors.lime300, fontSize: 25 },
  assuranceTitle: { color: colors.paper, fontSize: 13, fontWeight: '900' },
  assuranceCopy: { ...typography.small, color: '#BFD1C2', marginTop: 2 },
  collection: { paddingTop: spacing.xxxl, paddingBottom: spacing.xxxl },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  productCard: { width: '100%', backgroundColor: colors.paper, borderRadius: radius.lg, overflow: 'hidden', borderColor: colors.line, borderWidth: 1, ...shadow },
  productCardWide: { width: '31.9%', minWidth: 300, flexGrow: 1, flexBasis: 0 },
  productImageWrap: { height: 315, backgroundColor: colors.canvas },
  productImage: { width: '100%', height: '100%' },
  seasonBadge: { position: 'absolute', top: 14, left: 14, backgroundColor: colors.ivory, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 7 },
  seasonBadgeText: { ...typography.micro, color: colors.forest900, letterSpacing: .6 },
  productBody: { padding: spacing.xl },
  productMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  stock: { ...typography.small, color: colors.leaf600, fontWeight: '800' },
  productOrigin: { ...typography.micro, color: colors.leaf600, marginTop: spacing.lg, letterSpacing: .5 },
  productName: { ...typography.h2, color: colors.ink, marginTop: spacing.sm },
  productDescription: { ...typography.body, color: colors.inkSoft, marginTop: spacing.md, minHeight: 69 },
  productFooter: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: spacing.lg, marginTop: spacing.xl, borderTopColor: colors.line, borderTopWidth: 1, paddingTop: spacing.lg },
  productPrice: { color: colors.forest950, fontSize: 22, fontWeight: '900' },
  productUnit: { ...typography.small, color: colors.inkSoft, marginTop: 2 },
  addButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.mango500, alignItems: 'center', justifyContent: 'center' },
  addButtonText: { color: colors.forest950, fontSize: 25, lineHeight: 28, fontWeight: '700' },
  storyFrame: { paddingBottom: spacing.xxxl },
  story: { backgroundColor: colors.forest900, borderRadius: radius.xl, padding: spacing.xxxl, flexDirection: 'row', gap: spacing.xxxl, overflow: 'hidden' },
  storyMobile: { flexDirection: 'column', padding: spacing.xl },
  storyLead: { flex: 1 },
  storyEyebrow: { ...typography.micro, color: colors.lime300 },
  storyTitle: { ...typography.h1, color: colors.paper, marginTop: spacing.md },
  storyCopy: { ...typography.body, color: '#C7D9C9', marginTop: spacing.lg },
  steps: { flex: 1, gap: spacing.md },
  step: { backgroundColor: '#0D6A35', borderColor: '#277C48', borderWidth: 1, borderRadius: radius.md, padding: spacing.lg, flexDirection: 'row', gap: spacing.lg },
  stepNumber: { color: colors.lime300, fontSize: 15, fontWeight: '900' },
  stepTitle: { color: colors.paper, fontSize: 15, fontWeight: '900' },
  stepCopy: { ...typography.small, color: '#BCD0BF', marginTop: spacing.xs },
  deliveryFrame: { paddingBottom: spacing.xxxl },
  deliveryCard: { backgroundColor: colors.mango100, borderColor: '#F1D48D', borderWidth: 1, borderRadius: radius.lg, padding: spacing.xxl, flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
  deliveryMobile: { flexDirection: 'column', alignItems: 'stretch', padding: spacing.xl },
  deliveryIcon: { width: 62, height: 62, borderRadius: 31, backgroundColor: colors.forest900, alignItems: 'center', justifyContent: 'center' },
  deliveryIconText: { color: colors.mango500, fontSize: 28 },
  deliveryEyebrow: { ...typography.micro, color: colors.leaf600 },
  deliveryTitle: { ...typography.h3, color: colors.ink, marginTop: spacing.xs },
  deliveryCopy: { ...typography.small, color: colors.inkSoft, marginTop: spacing.xs },
});
