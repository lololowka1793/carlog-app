import { StyleSheet } from 'react-native';
import { ThemedView } from '../../components/themed-view';
import { ThemedText } from '../../components/themed-text';
import { colors, spacing } from '../../constants/theme';

export default function FuelScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Заправки</ThemedText>
      <ThemedText style={styles.muted}>Здесь будет журнал заправок.</ThemedText>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing(2) },
  muted: { color: colors.muted, marginTop: spacing(1) },
});
