import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Body, Caption, Title } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';

/**
 * Placeholder for routes not yet built out. Detail routes get a native
 * translucent header from the root stack, so content insets automatically.
 */
export function Stub({
  title,
  note,
  /** true for screens with a native header; adds no extra top padding. */
  headered = false,
}: {
  title: string;
  note: string;
  headered?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.bg }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: spacing.xl,
        paddingTop: headered ? spacing.xl : insets.top + spacing.xl,
      }}>
      <Caption color={colors.gold}>Not yet built</Caption>
      <Title style={{ marginTop: spacing.sm }}>{title}</Title>
      <Body style={{ marginTop: spacing.sm }}>{note}</Body>
      <View style={{ height: spacing.xxxl }} />
    </ScrollView>
  );
}
