// mobile/app/(tabs)/cars.tsx
import React, { useEffect } from 'react';
import { FlatList, Pressable, Text, View, StyleSheet } from 'react-native';
import { useCarsStore } from '../../store/carsStore';
import { MaterialIcons } from '@expo/vector-icons';

const COLORS = { BG: '#0f132e', MUTED: '#aab0f0' };

export default function CarsScreen() {
  const { cars, activeCarId, load, setActive } = useCarsStore();

  useEffect(() => { load(); }, [load]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Мои авто</Text>

      <FlatList
        data={cars}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>Нет автомобилей</Text>}
        renderItem={({ item }) => {
          const isActive = item.id === activeCarId;
          return (
            <Pressable
              style={[styles.card, isActive && styles.activeCard]}
              onPress={() => setActive(item.id)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.carName}>
                  {item.brand} {item.model} · {item.plate}
                </Text>
                <Text style={styles.details}>
                  Одометр: {item.odometer.toLocaleString()} {item.unit} · Топливо: {item.fuel}
                </Text>
              </View>
              {isActive
                ? <MaterialIcons name="check-circle" size={24} color="#6aa84f" />
                : <MaterialIcons name="radio-button-unchecked" size={24} color="#4a4f86" />
              }
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BG },
  title: { color: 'white', fontWeight: '700', fontSize: 18, paddingHorizontal: 16, paddingTop: 14 },
  empty: { color: COLORS.MUTED, textAlign: 'center', marginTop: 40 },
  card: {
    flexDirection: 'row', alignItems: 'center',
    padding: 16, borderRadius: 12, backgroundColor: '#171b42',
    marginBottom: 12, borderWidth: 1, borderColor: '#2a2f6c',
  },
  activeCard: { borderColor: '#6aa84f', shadowColor: '#6aa84f', shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  carName: { color: 'white', fontWeight: '600', marginBottom: 4 },
  details: { color: COLORS.MUTED, fontSize: 12 },
});
