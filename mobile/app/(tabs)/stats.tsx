import { StyleSheet } from 'react-native';
import { ThemedView } from '../../components/themed-view';
import { ThemedText } from '../../components/themed-text';
import { colors, spacing } from '../../constants/theme';

export default function StatsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Аналитика</ThemedText>
      <ThemedText style={styles.muted}>Средний расход, графики и прогнозы.</ThemedText>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing(2) },
  muted: { color: colors.muted, marginTop: spacing(1) },
});
