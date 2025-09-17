import { StyleSheet, Pressable } from 'react-native';
import { ThemedView } from '../../components/themed-view';
import { ThemedText } from '../../components/themed-text';
import { colors, spacing } from '../../constants/theme';
import { Link } from 'expo-router';

export default function SettingsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Настройки</ThemedText>

      <Link href="/settings/profile" asChild>
        <Pressable style={styles.item}>
          <ThemedText>Профиль авто</ThemedText>
        </Pressable>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing(2) },
  title: { marginBottom: spacing(2) },
  item: {
    backgroundColor: colors.card,
    padding: spacing(2),
    borderRadius: 12,
    marginBottom: spacing(1),
  },
});
