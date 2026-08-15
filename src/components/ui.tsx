import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
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

export function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <View style={styles.brandLockup}>
      <View style={[styles.mark, inverse && styles.markInverse]}><View style={[styles.markCore, inverse && styles.markCoreInverse]} /></View>
      <View>
        <Text style={[styles.brandName, inverse && styles.inverseText]}>ugadi</Text>
        <Text style={[styles.brandSub, inverse && styles.inverseMuted]}>CANADA</Text>
      </View>
    </View>
  );
}

export function ScreenFrame({ children, style }: { children: ReactNode; style?: ViewStyle }) {
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
  mark: { width: 38, height: 38, borderRadius: 20, borderWidth: 9, borderColor: colors.forest800, borderTopColor: colors.lime300, transform: [{ rotate: '28deg' }], alignItems: 'center', justifyContent: 'center' },
  markInverse: { borderColor: colors.lime300, borderTopColor: colors.paper },
  markCore: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.ivory },
  markCoreInverse: { backgroundColor: colors.forest950 },
  brandName: { color: colors.forest900, fontSize: 29, lineHeight: 27, fontWeight: '900', letterSpacing: -1.8 },
  brandSub: { color: colors.leaf600, fontSize: 8, lineHeight: 11, fontWeight: '900', letterSpacing: 3.2, marginLeft: 2 },
  inverseText: { color: colors.paper },
  inverseMuted: { color: colors.lime300 },
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
