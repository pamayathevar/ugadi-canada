import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Chip, ScreenFrame, SectionHeading } from '../../components/ui';
import { rewardActivity } from '../../data/rewards';
import { formatCad, RewardAccount, RewardOffer } from '../../domain/commerce';
import { colors, radius, shadow, spacing, typography } from '../../theme/tokens';

const tierLabels: Record<RewardAccount['tier'], string> = {
  seedling: 'Seedling member',
  harvest: 'Harvest member',
  heritage: 'Heritage member',
};

export function AccountScreen({
  wide,
  onAdmin,
  onDelivery,
  onRetail,
  rewardAccount,
  rewardOffers,
  selectedReward,
  onRewardChange,
}: {
  wide: boolean;
  onAdmin: () => void;
  onDelivery: () => void;
  onRetail: () => void;
  rewardAccount: RewardAccount;
  rewardOffers: RewardOffer[];
  selectedReward?: RewardOffer;
  onRewardChange: (rewardId: string | null) => void;
}) {
  const progress = Math.min(100, rewardAccount.lifetimePoints / rewardAccount.nextTierPoints * 100);
  const remainingToNextTier = Math.max(0, rewardAccount.nextTierPoints - rewardAccount.lifetimePoints);
  const pointsAfterReservation = rewardAccount.pointsBalance - (selectedReward?.pointsCost ?? 0);

  return <ScreenFrame style={styles.page}>
    <SectionHeading eyebrow="YOUR UGADI PROFILE" title="Welcome back, Arun" copy="Your delivery preferences, rewards and seasonal favourites—all in one place." />

    <View style={styles.rewardsHero}>
      <View style={styles.balancePanel}>
        <View style={styles.rewardsMark}><Text style={styles.rewardsMarkText}>✦</Text></View>
        <Text style={styles.rewardsEyebrow}>UGADI REWARDS</Text>
        <Text style={styles.points}>{rewardAccount.pointsBalance.toLocaleString('en-CA')}</Text>
        <Text style={styles.pointsLabel}>points ready to use</Text>
        <Chip label={tierLabels[rewardAccount.tier]} tone="gold" />
        {selectedReward ? <View style={styles.reserved}><Text style={styles.reservedIcon}>✓</Text><View><Text style={styles.reservedTitle}>{selectedReward.name} selected</Text><Text style={styles.reservedCopy}>{pointsAfterReservation.toLocaleString('en-CA')} points remain after checkout</Text></View></View> : null}
        <View style={styles.progressHeader}><Text style={styles.progressLabel}>HERITAGE STATUS</Text><Text style={styles.progressMeta}>{remainingToNextTier} points to go</Text></View>
        <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${progress}%` }]} /></View>
        <Text style={styles.earnRule}>Earn 1 point for every $1 spent on completed orders.</Text>
      </View>

      <View style={styles.wallet}>
        <Text style={styles.walletEyebrow}>REDEEM YOUR POINTS</Text>
        <Text style={styles.walletTitle}>Choose a market reward</Text>
        <Text style={styles.walletCopy}>Select one reward now and it will be waiting in your basket.</Text>
        <View style={styles.offerList}>
          {rewardOffers.map((offer) => {
            const selected = selectedReward?.id === offer.id;
            const locked = rewardAccount.pointsBalance < offer.pointsCost;
            return <Pressable
              accessibilityRole="button"
              accessibilityLabel={`${selected ? 'Remove' : 'Redeem'} ${offer.name}`}
              accessibilityState={{ disabled: locked, selected }}
              disabled={locked}
              key={offer.id}
              onPress={() => onRewardChange(selected ? null : offer.id)}
              style={({ pressed }) => [styles.offer, !wide && styles.offerMobile, selected && styles.offerSelected, locked && styles.offerLocked, pressed && styles.offerPressed]}
            >
              <View style={[styles.offerValue, !wide && styles.offerValueMobile]}><Text style={styles.offerAmount}>{formatCad(offer.discountCents)}</Text><Text style={styles.offerMinimum}>on {formatCad(offer.minimumSubtotalCents)}+</Text></View>
              <View style={styles.offerBody}><Text style={styles.offerName}>{offer.name}</Text><Text style={styles.offerDescription}>{offer.description}</Text></View>
              <View style={[styles.offerAction, !wide && styles.offerActionMobile, selected && styles.offerActionSelected]}><Text style={[styles.offerActionText, selected && styles.offerActionTextSelected]}>{selected ? '✓ Applied' : locked ? `${offer.pointsCost - rewardAccount.pointsBalance} to go` : `${offer.pointsCost} pts`}</Text></View>
            </Pressable>;
          })}
        </View>
      </View>
    </View>

    <View style={styles.activityCard}>
      <View style={styles.activityHeading}><View><Text style={styles.activityEyebrow}>RECENT ACTIVITY</Text><Text style={styles.activityTitle}>Points earned</Text></View><Text style={styles.activityLifetime}>{rewardAccount.lifetimePoints.toLocaleString('en-CA')} lifetime points</Text></View>
      <View style={styles.activityRows}>{rewardActivity.map((item) => <View style={styles.activityRow} key={item.id}><View style={styles.activityIcon}><Text style={styles.activityIconText}>＋</Text></View><View style={{ flex: 1 }}><Text style={styles.activityName}>{item.label}</Text><Text style={styles.activityDate}>{item.date}</Text></View><Text style={styles.activityPoints}>+{item.points} pts</Text></View>)}</View>
    </View>

    <View style={styles.grid}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}><Text style={styles.avatarText}>AK</Text></View>
        <Text style={styles.name}>Arun Kumar</Text><Text style={styles.email}>arun@example.ca</Text>
        <Chip label="Seasonal updates enabled" />
        <View style={styles.member}><Text style={styles.memberLabel}>UGADI CUSTOMER SINCE</Text><Text style={styles.memberValue}>2026</Text></View>
      </View>
      <View style={styles.menuCard}>
        {[
          ['⌖', 'Delivery addresses', '1 saved address'],
          ['◇', 'Payment methods', 'Managed securely at checkout'],
          ['✦', 'Seasonal notifications', 'Email and push enabled'],
          ['?', 'Help & support', 'Contact the Ugadi team'],
          ['○', 'Privacy & account', 'Data and communication settings'],
        ].map(([icon, title, copy]) => <Pressable style={styles.menuItem} key={title}><View style={styles.menuIcon}><Text style={styles.menuIconText}>{icon}</Text></View><View style={{ flex: 1 }}><Text style={styles.menuTitle}>{title}</Text><Text style={styles.menuCopy}>{copy}</Text></View><Text style={styles.chevron}>›</Text></Pressable>)}
      </View>
    </View>
    <View style={styles.preview}><View style={styles.previewCopyBlock}><Text style={styles.previewEyebrow}>PROTOTYPE CONTROL</Text><Text style={styles.previewTitle}>Review every Ugadi role</Text><Text style={styles.previewCopy}>Explore administration, private delivery and partner-store sell-through experiences.</Text></View><View style={styles.previewActions}><Button label="Admin" onPress={onAdmin} variant="light" /><Button label="Delivery partner" onPress={onDelivery} variant="light" /><Button label="Retail partner" onPress={onRetail} variant="light" /></View></View>
  </ScreenFrame>;
}

const styles = StyleSheet.create({
  page: { paddingTop: spacing.xxxl, paddingBottom: spacing.xxxl },
  rewardsHero: { backgroundColor: colors.forest950, borderRadius: radius.xl, overflow: 'hidden', flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.lg, ...shadow },
  balancePanel: { flex: 1, minWidth: 300, padding: spacing.xxl, backgroundColor: colors.forest950 },
  rewardsMark: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.mango500, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl },
  rewardsMarkText: { color: colors.forest950, fontSize: 22, fontWeight: '900' },
  rewardsEyebrow: { ...typography.micro, color: colors.lime300 },
  points: { color: colors.paper, fontSize: 54, lineHeight: 58, fontWeight: '900', letterSpacing: -2, marginTop: spacing.sm },
  pointsLabel: { ...typography.body, color: '#BFD0C2', marginBottom: spacing.lg },
  reserved: { backgroundColor: '#14522F', borderRadius: radius.md, padding: spacing.md, marginTop: spacing.lg, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  reservedIcon: { color: colors.lime300, fontWeight: '900', fontSize: 18 },
  reservedTitle: { color: colors.paper, fontSize: 13, fontWeight: '900' },
  reservedCopy: { ...typography.small, color: '#BFD0C2' },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md, marginTop: spacing.xl },
  progressLabel: { ...typography.micro, color: colors.paper },
  progressMeta: { ...typography.small, color: colors.lime300 },
  progressTrack: { height: 8, borderRadius: radius.pill, backgroundColor: '#285B3B', overflow: 'hidden', marginTop: spacing.sm },
  progressFill: { height: '100%', borderRadius: radius.pill, backgroundColor: colors.mango500 },
  earnRule: { ...typography.small, color: '#BFD0C2', marginTop: spacing.md },
  wallet: { flex: 1.35, minWidth: 300, padding: spacing.xxl, backgroundColor: colors.ivory },
  walletEyebrow: { ...typography.micro, color: colors.leaf600 },
  walletTitle: { ...typography.h2, color: colors.ink, marginTop: spacing.sm },
  walletCopy: { ...typography.body, color: colors.inkSoft, marginTop: spacing.xs },
  offerList: { gap: spacing.sm, marginTop: spacing.xl },
  offer: { backgroundColor: colors.paper, borderColor: colors.line, borderWidth: 1, borderRadius: radius.md, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  offerMobile: { flexDirection: 'column', alignItems: 'stretch', padding: spacing.lg },
  offerSelected: { borderColor: colors.leaf500, borderWidth: 2, backgroundColor: colors.successSoft },
  offerLocked: { opacity: .55 },
  offerPressed: { opacity: .82 },
  offerValue: { width: 78 },
  offerValueMobile: { width: '100%', flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  offerAmount: { color: colors.forest900, fontSize: 18, fontWeight: '900' },
  offerMinimum: { ...typography.small, color: colors.inkSoft },
  offerBody: { flex: 1 },
  offerName: { color: colors.ink, fontSize: 13, fontWeight: '900' },
  offerDescription: { ...typography.small, color: colors.inkSoft, marginTop: 2 },
  offerAction: { minWidth: 76, borderRadius: radius.pill, borderColor: colors.forest800, borderWidth: 1, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, alignItems: 'center' },
  offerActionMobile: { alignSelf: 'stretch' },
  offerActionSelected: { backgroundColor: colors.forest900, borderColor: colors.forest900 },
  offerActionText: { ...typography.micro, color: colors.forest800, letterSpacing: .3 },
  offerActionTextSelected: { color: colors.paper },
  activityCard: { backgroundColor: colors.paper, borderColor: colors.line, borderWidth: 1, borderRadius: radius.lg, padding: spacing.xl, marginBottom: spacing.lg },
  activityHeading: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: spacing.md },
  activityEyebrow: { ...typography.micro, color: colors.leaf600 },
  activityTitle: { ...typography.h3, color: colors.ink, marginTop: spacing.xs },
  activityLifetime: { ...typography.small, color: colors.inkSoft },
  activityRows: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginTop: spacing.lg },
  activityRow: { flex: 1, minWidth: 235, flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.canvas, borderRadius: radius.md, padding: spacing.md },
  activityIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.successSoft, alignItems: 'center', justifyContent: 'center' },
  activityIconText: { color: colors.forest800, fontSize: 16, fontWeight: '900' },
  activityName: { color: colors.ink, fontSize: 12, fontWeight: '900' },
  activityDate: { ...typography.small, color: colors.inkSoft },
  activityPoints: { color: colors.leaf600, fontSize: 13, fontWeight: '900' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  profileCard: { width: 310, flexGrow: 1, maxWidth: 380, backgroundColor: colors.forest950, borderRadius: radius.lg, padding: spacing.xxl, alignItems: 'flex-start', ...shadow },
  avatar: { width: 74, height: 74, borderRadius: 37, backgroundColor: colors.mango500, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.forest950, fontSize: 23, fontWeight: '900' },
  name: { ...typography.h2, color: colors.paper, marginTop: spacing.xl },
  email: { ...typography.body, color: '#BDD0C0', marginBottom: spacing.lg },
  member: { borderTopColor: '#285A3B', borderTopWidth: 1, width: '100%', marginTop: spacing.xl, paddingTop: spacing.lg },
  memberLabel: { ...typography.micro, color: colors.lime300 },
  memberValue: { color: colors.paper, fontSize: 22, fontWeight: '900', marginTop: spacing.xs },
  menuCard: { flex: 2, minWidth: 300, backgroundColor: colors.paper, borderRadius: radius.lg, borderColor: colors.line, borderWidth: 1, overflow: 'hidden', ...shadow },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg, borderBottomColor: colors.line, borderBottomWidth: 1 },
  menuIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.canvas, alignItems: 'center', justifyContent: 'center' },
  menuIconText: { color: colors.forest900, fontSize: 18, fontWeight: '900' },
  menuTitle: { color: colors.ink, fontSize: 14, fontWeight: '900' },
  menuCopy: { ...typography.small, color: colors.inkSoft, marginTop: 2 },
  chevron: { color: colors.leaf600, fontSize: 24 },
  preview: { backgroundColor: colors.leaf500, borderRadius: radius.lg, padding: spacing.xl, marginTop: spacing.xl, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: spacing.xl },
  previewEyebrow: { ...typography.micro, color: colors.forest950 },
  previewTitle: { ...typography.h3, color: colors.forest950, marginTop: spacing.xs },
  previewCopy: { ...typography.small, color: colors.forest950, marginTop: 2 },
  previewCopyBlock: { flex: 1, minWidth: 250 },
  previewActions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
});
