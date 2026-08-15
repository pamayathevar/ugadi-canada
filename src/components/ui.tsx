import { ReactNode } from 'react';
import { Image, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { brandImages } from '../data/assets';
import { colors, contentMaxWidth, radius, shadow, spacing, typography } from '../theme/tokens';

type ButtonVariant = 'primary' | 'secondary' | 'light' | 'ghost';

export function Button({
  label,
  onPress,
  variant = 'primary',
  compact = false,
  icon,
}: {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  compact?: boolean;
  icon?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        compact && styles.buttonCompact,
        variant === 'secondary' && styles.buttonSecondary,
        variant === 'light' && styles.buttonLight,
        variant === 'ghost' && styles.buttonGhost,
        pressed && styles.pressed,
      ]}
    >
      {icon ? <Text style={[styles.buttonIcon, variant !== 'primary' && styles.buttonTextDark]}>{icon}</Text> : null}
      <Text style={[styles.buttonText, variant !== 'primary' && styles.buttonTextDark]}>{label}</Text>
    </Pressable>
  );
}

export function Brand({ inverse = false, showTagline = false }: { inverse?: boolean; showTagline?: boolean }) {
  return (
    <View accessibilityLabel="Ugadi Canada" style={[styles.brandLockup, inverse && styles.brandLockupInverse]}>
      <Image source={brandImages.clientMark} style={[styles.brandMark, showTagline && styles.brandMarkLarge]} resizeMode="contain" />
      <View style={styles.brandWordColumn}>
        <Image source={brandImages.clientWordmark} style={[styles.brandWordmark, showTagline && styles.brandWordmarkLarge]} resizeMode="contain" />
        {showTagline
          ? <Image source={brandImages.clientTagline} style={styles.brandTagline} resizeMode="contain" />
          : <Text style={styles.brandCountry}>CANADA</Text>}
      </View>
    </View>
  );
}

export function ScreenFrame({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.frame, style]}>{children}</View>;
}

export function SectionHeading({ eyebrow, title, copy, action }: { eyebrow?: string; title: string; copy?: string; action?: ReactNode }) {
  return (
    <View style={styles.sectionHeading}>
      <View style={styles.sectionText}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.sectionTitle}>{title}</Text>
        {copy ? <Text style={styles.sectionCopy}>{copy}</Text> : null}
      </View>
      {action}
    </View>
  );
}

export function Chip({ label, tone = 'green' }: { label: string; tone?: 'green' | 'gold' | 'neutral' }) {
  return <View style={[styles.chip, tone === 'gold' && styles.chipGold, tone === 'neutral' && styles.chipNeutral]}><Text style={[styles.chipText, tone === 'gold' && styles.chipGoldText, tone === 'neutral' && styles.chipNeutralText]}>{label}</Text></View>;
}

export function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  button: { minHeight: 48, paddingHorizontal: spacing.xl, paddingVertical: 13, borderRadius: radius.pill, backgroundColor: colors.forest900, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  buttonCompact: { minHeight: 40, paddingHorizontal: spacing.lg, paddingVertical: 9 },
  buttonSecondary: { backgroundColor: colors.mango500 },
  buttonLight: { backgroundColor: colors.ivory },
  buttonGhost: { backgroundColor: 'transparent', borderColor: colors.forest900, borderWidth: 1 },
  buttonText: { color: colors.paper, fontSize: 13, fontWeight: '900', letterSpacing: .2 },
  buttonTextDark: { color: colors.forest950 },
  buttonIcon: { color: colors.paper, fontSize: 16, fontWeight: '900' },
  pressed: { opacity: .82, transform: [{ scale: .99 }] },
  brandLockup: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  brandLockupInverse: { backgroundColor: colors.paper, borderRadius: radius.md, paddingHorizontal: spacing.sm, paddingVertical: 5 },
  brandMark: { width: 39, height: 39 },
  brandMarkLarge: { width: 52, height: 52 },
  brandWordColumn: { justifyContent: 'center' },
  brandWordmark: { width: 89, height: 30 },
  brandWordmarkLarge: { width: 120, height: 40 },
  brandTagline: { width: 168, height: 24, marginTop: -2 },
  brandCountry: { color: colors.leaf600, fontSize: 8, lineHeight: 10, fontWeight: '900', letterSpacing: 3.1, marginLeft: 3, marginTop: -2 },
  frame: { width: '100%', maxWidth: contentMaxWidth, alignSelf: 'center', paddingHorizontal: spacing.xl },
  sectionHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: spacing.xl, marginBottom: spacing.xl },
  sectionText: { flex: 1, maxWidth: 670 },
  eyebrow: { ...typography.micro, color: colors.leaf600, marginBottom: spacing.sm },
  sectionTitle: { ...typography.h1, color: colors.ink },
  sectionCopy: { ...typography.body, color: colors.inkSoft, marginTop: spacing.sm },
  chip: { alignSelf: 'flex-start', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: colors.successSoft },
  chipGold: { backgroundColor: colors.mango100 },
  chipNeutral: { backgroundColor: colors.canvas },
  chipText: { ...typography.micro, color: colors.forest800, letterSpacing: .7 },
  chipGoldText: { color: '#8A5A00' },
  chipNeutralText: { color: colors.inkSoft },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: spacing.lg },
});
