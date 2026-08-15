import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Chip, ScreenFrame, SectionHeading } from '../../components/ui';
import { colors, radius, shadow, spacing, typography } from '../../theme/tokens';

export function AccountScreen({ onAdmin }: { onAdmin: () => void }) {
  return <ScreenFrame style={styles.page}>
    <SectionHeading eyebrow="YOUR UGADI PROFILE" title="Welcome back, Arun" copy="Keep delivery details and preferences ready for the next seasonal release." />
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
    <View style={styles.preview}><View><Text style={styles.previewEyebrow}>PROTOTYPE CONTROL</Text><Text style={styles.previewTitle}>Review the operations experience</Text><Text style={styles.previewCopy}>Switch to the admin preview to explore orders, inventory and delivery management.</Text></View><Button label="Open admin preview" onPress={onAdmin} variant="light" /></View>
  </ScreenFrame>;
}

const styles = StyleSheet.create({
  page: { paddingTop: spacing.xxxl, paddingBottom: spacing.xxxl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg },
  profileCard: { width: 310, flexGrow: 1, maxWidth: 380, backgroundColor: colors.forest950, borderRadius: radius.lg, padding: spacing.xxl, alignItems: 'flex-start', ...shadow },
  avatar: { width: 74, height: 74, borderRadius: 37, backgroundColor: colors.mango500, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.forest950, fontSize: 23, fontWeight: '900' },
  name: { ...typography.h2, color: colors.paper, marginTop: spacing.xl },
  email: { ...typography.body, color: '#BDD0C0', marginBottom: spacing.lg },
  member: { borderTopColor: '#285A3B', borderTopWidth: 1, width: '100%', marginTop: spacing.xl, paddingTop: spacing.lg },
  memberLabel: { ...typography.micro, color: colors.lime300 },
  memberValue: { color: colors.paper, fontSize: 22, fontWeight: '900', marginTop: spacing.xs },
  menuCard: { flex: 2, minWidth: 320, backgroundColor: colors.paper, borderRadius: radius.lg, borderColor: colors.line, borderWidth: 1, overflow: 'hidden', ...shadow },
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
});
