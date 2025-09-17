import { useEffect } from 'react';
import { FlatList, Pressable, Text, View, StyleSheet } from 'react-native';
import { useCarsStore } from '../../store/carsStore';
import { useProfileStore } from '../../store/profileStore';
import { router } from 'expo-router';

export default function CarsScreen() {
  const { cars, load, setActive } = useCarsStore();
  const { setProfile } = useProfileStore();

  useEffect(() => { load(); }, [load]);

  return (
    <FlatList
      data={cars}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable
          style={styles.card}
          onPress={() => {
            setActive(item.id);
            setProfile(item);
            router.push('/(tabs)/fuel'); // можно открыть журнал
          }}
        >
          <Text>{item.brand} {item.model} ({item.plate})</Text>
          <Text>Одометр: {item.odometer}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 8,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
});
