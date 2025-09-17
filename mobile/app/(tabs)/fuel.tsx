// mobile/app/(tabs)/fuel.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useCarsStore } from '../../store/carsStore';
import { useFuelStore } from '../../store/fuelStore';
import type { FuelEntry } from '../../models/fuelEntry';

export default function FuelScreen() {
  const { activeCarId } = useCarsStore();
  const { entries, load, add, getByCarId } = useFuelStore();

  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [odometer, setOdometer] = useState<string>('');
  const [liters, setLiters] = useState<string>('');
  const [pricePerLiter, setPricePerLiter] = useState<string>('');
  const [isFullTank, setIsFullTank] = useState<boolean>(false);

  const [carEntries, setCarEntries] = useState<FuelEntry[]>([]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!activeCarId) {
      setCarEntries([]);
      return;
    }
    setCarEntries(getByCarId(activeCarId));
  }, [entries, activeCarId, getByCarId]);

  const addEntry = async () => {
    if (!activeCarId) {
      Alert.alert('Заправки', 'Сначала выберите активный автомобиль во вкладке «Мои авто».');
      return;
    }
    if (!odometer || !liters || !pricePerLiter) {
      Alert.alert('Заправки', 'Заполните одометр, литры и цену за литр.');
      return;
    }

    const entry: FuelEntry = {
      id: String(Date.now()),
      carId: activeCarId,
      date,
      odometer: Number(odometer),
      liters: Number(liters),
      pricePerLiter: Number(pricePerLiter),
      totalCost: Number(liters) * Number(pricePerLiter),
      isFullTank,
    };
    await add(entry);

    // очистим форму
    setLiters('');
    setPricePerLiter('');
    setIsFullTank(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Журнал заправок</Text>

      <View style={styles.form}>
        <Text>Дата (YYYY-MM-DD)</Text>
        <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="2025-09-17" />

        <Text>Одометр</Text>
        <TextInput style={styles.input} value={odometer} onChangeText={setOdometer} keyboardType="numeric" placeholder="123456" />

        <Text>Литры</Text>
        <TextInput style={styles.input} value={liters} onChangeText={setLiters} keyboardType="numeric" placeholder="45.6" />

        <Text>Цена за литр</Text>
        <TextInput style={styles.input} value={pricePerLiter} onChangeText={setPricePerLiter} keyboardType="numeric" placeholder="26.5" />

        <View style={{ height: 8 }} />
        <Button title={isFullTank ? 'Полный бак: ДА' : 'Полный бак: НЕТ'} onPress={() => setIsFullTank(v => !v)} />
        <View style={{ height: 8 }} />
        <Button title="Добавить заправку" onPress={addEntry} />
      </View>

      <View style={{ height: 16 }} />

      <FlatList
        data={carEntries}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={{ opacity: 0.6 }}>Записей пока нет</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.date}</Text>
            <Text>Одометр: {item.odometer}</Text>
            <Text>Литры: {item.liters}</Text>
            <Text>Цена/л: {item.pricePerLiter}</Text>
            <Text>Сумма: {item.totalCost}</Text>
            {item.isFullTank ? <Text>Полный бак</Text> : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  form: { backgroundColor: '#f4f4f7', padding: 12, borderRadius: 8 },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 8, marginBottom: 8 },
  card: { backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#eee' },
});
