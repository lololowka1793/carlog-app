import { useEffect } from 'react';
import { StyleSheet, Pressable, FlatList } from 'react-native';
import { Link } from 'expo-router';
import { ThemedView } from '../../components/themed-view';
import { ThemedText } from '../../components/themed-text';
import { colors, spacing } from '../../constants/theme';
import { useCarsStore } from '../../store/carsStore';
import type { CarProfile } from '../../models/carProfile';

export default function CarsScreen() {
  const { cars, load } = useCarsStore();

  useEffect(() => { load(); }, [load]);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>Мои авто</ThemedText>

      {cars.length === 0 ? (
        <ThemedText style={styles.muted}>
          Пока нет автомобилей. Добавьте в Настройки → Профиль авто.
        </ThemedText>
      ) : (
        <FlatList
          data={cars}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Link href={`/settings/profile?id=${item.id}`} asChild>
              <Pressable style={styles.card}>
                <ThemedText type="subtitle">{item.brand} {item.model}</ThemedText>
                <ThemedText style={styles.details}>
                  {item.year ? `${item.year}, ` : ''}{item.plate}
                </ThemedText>
                <ThemedText style={styles.details}>
                  {item.odometer} {item.unit}
                </ThemedText>
              </Pressable>
            </Link>
          )}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg, padding: spacing(2) },
  title: { marginBottom: spacing(2) },
  muted: { color: colors.muted },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: spacing(2), marginBottom: spacing(2) },
  details: { color: colors.muted, marginTop: spacing(0.5) },
});
