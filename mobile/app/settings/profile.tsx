// mobile/app/settings/profile.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, View, Switch, Pressable } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { colors, spacing } from '../../constants/theme';
import { Picker } from '@react-native-picker/picker';
import { useCarsStore } from '../../store/carsStore';
import type { CarProfile } from '../../models/carProfile';

type TransportType = 'car' | 'motorcycle' | 'bus' | 'truck';
type FuelType = 'gasoline' | 'diesel' | 'lpg' | 'electric';
type DistanceUnit = 'km' | 'mi';

function uid() { return Math.random().toString(36).slice(2, 10); }

export default function CarProfileForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { cars, load, add, update, remove } = useCarsStore();

  // локальная форма
  const [carId, setCarId] = useState<string>(id ?? uid());
  const [transport, setTransport] = useState<TransportType>('car');
  const [brand, setBrand] = useState('Audi');
  const [model, setModel] = useState('');
  const [plate, setPlate] = useState('');
  const [year, setYear] = useState('');
  const [hasTwoTanks, setHasTwoTanks] = useState(false);
  const [tank1, setTank1] = useState('');
  const [tank2, setTank2] = useState('');
  const [fuel, setFuel] = useState<FuelType>('gasoline');
  const [unit, setUnit] = useState<DistanceUnit>('km');
  const [vin, setVin] = useState('');
  const [odometer, setOdometer] = useState('');

  const brands = useMemo(() => ['Audi', 'BMW', 'Mercedes', 'Hyundai'], []);

  const isEdit = Boolean(id);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!isEdit) return;
    const found = cars.find(c => c.id === id);
    if (!found) return;
    setCarId(found.id);
    setTransport(found.transport);
    setBrand(found.brand);
    setModel(found.model);
    setPlate(found.plate);
    setYear(found.year ? String(found.year) : '');
    setFuel(found.fuel);
    setUnit(found.unit);
    setVin(found.vin ?? '');
    setOdometer(String(found.odometer ?? ''));
    if (found.tanks.length === 2) { setHasTwoTanks(true); setTank1(String(found.tanks[0])); setTank2(String(found.tanks[1])); }
    else { setHasTwoTanks(false); setTank1(String(found.tanks[0] ?? '')); setTank2(''); }
  }, [isEdit, id, cars]);

  const save = async () => {
    if (!model.trim()) return Alert.alert('Профиль авто', 'Введите модель');
    if (year && !/^\d{4}$/.test(year)) return Alert.alert('Профиль авто', 'Год 4 цифрами');
    if (!tank1) return Alert.alert('Профиль авто', 'Укажите объём бака');
    if (hasTwoTanks && !tank2) return Alert.alert('Профиль авто', 'Объём второго бака');
    if (!/^\d+(\.\d+)?$/.test(odometer || '')) return Alert.alert('Профиль авто', 'Одометр числом');

    const car: CarProfile = {
      id: carId,
      transport,
      brand,
      model: model.trim(),
      plate: plate.trim().toUpperCase(),
      year: year ? Number(year) : undefined,
      tanks: hasTwoTanks ? [Number(tank1), Number(tank2)] : [Number(tank1)],
      fuel, unit,
      vin: vin.trim() || undefined,
      odometer: Number(odometer),
    };

    if (isEdit) { await update(car); }
    else { await add(car); }
    router.back();
  };

  const del = async () => {
    if (!isEdit) return router.back();
    await remove(carId);
    router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: isEdit ? 'Редактировать авто' : 'Добавить авто' }} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ThemedText type="title" style={styles.title}>{isEdit ? 'Редактировать авто' : 'Добавить авто'}</ThemedText>

        {/* тип транспорта */}
        <Field label="Тип транспорта">
          <Picker selectedValue={transport} onValueChange={(v: TransportType) => setTransport(v)} style={styles.picker as any}>
            <Picker.Item label="Автомобиль" value="car" />
            <Picker.Item label="Мотоцикл" value="motorcycle" />
            <Picker.Item label="Автобус" value="bus" />
            <Picker.Item label="Грузовик" value="truck" />
          </Picker>
        </Field>

        {/* бренд */}
        <Field label="Производитель">
          <Picker selectedValue={brand} onValueChange={(v: string) => setBrand(v)} style={styles.picker as any}>
            {brands.map(b => <Picker.Item key={b} label={b} value={b} />)}
          </Picker>
        </Field>

        {/* модель */}
        <Field label="Модель">
          <TextInput placeholder="Например, Santa Fe" placeholderTextColor={colors.muted} value={model} onChangeText={setModel} style={styles.input} />
        </Field>

        {/* рег. номер и год */}
        <Row>
          <Col>
            <Field label="Рег. номер">
              <TextInput placeholder="ABC 123" placeholderTextColor={colors.muted} autoCapitalize="characters" value={plate} onChangeText={setPlate} style={styles.input} />
            </Field>
          </Col>
          <Col>
            <Field label="Год">
              <TextInput placeholder="2013" placeholderTextColor={colors.muted} keyboardType="number-pad" maxLength={4} value={year} onChangeText={setYear} style={styles.input} />
            </Field>
          </Col>
        </Row>

        {/* баки */}
        <Row align="center">
          <ThemedText style={{ color: colors.text, marginRight: spacing(1) }}>Два бака</ThemedText>
          <Switch value={hasTwoTanks} onValueChange={setHasTwoTanks} trackColor={{ false: colors.border, true: colors.primary }} thumbColor="#fff" />
        </Row>
        <Row>
          <Col>
            <Field label={hasTwoTanks ? 'Бак 1 (л)' : 'Объём бака (л)'}>
              <TextInput placeholder="70" placeholderTextColor={colors.muted} keyboardType="numeric" value={tank1} onChangeText={setTank1} style={styles.input} />
            </Field>
          </Col>
          {hasTwoTanks && (
            <Col>
              <Field label="Бак 2 (л)">
                <TextInput placeholder="30" placeholderTextColor={colors.muted} keyboardType="numeric" value={tank2} onChangeText={setTank2} style={styles.input} />
              </Field>
            </Col>
          )}
        </Row>

        {/* топливо */}
        <Field label="Тип топлива">
          <Picker selectedValue={fuel} onValueChange={(v: FuelType) => setFuel(v)} style={styles.picker as any}>
            <Picker.Item label="Бензин" value="gasoline" />
            <Picker.Item label="Дизель" value="diesel" />
            <Picker.Item label="Газ (LPG)" value="lpg" />
            <Picker.Item label="Электричество" value="electric" />
          </Picker>
        </Field>

        {/* единицы */}
        <Field label="Единицы расстояния">
          <Picker selectedValue={unit} onValueChange={(v: DistanceUnit) => setUnit(v)} style={styles.picker as any}>
            <Picker.Item label="Километры (км)" value="km" />
            <Picker.Item label="Мили (mi)" value="mi" />
          </Picker>
        </Field>

        {/* одометр */}
        <Field label="Одометр">
          <TextInput placeholder={unit === 'km' ? '180000' : '112000'} placeholderTextColor={colors.muted} keyboardType="numeric" value={odometer} onChangeText={setOdometer} style={styles.input} />
        </Field>

        {/* VIN */}
        <Field label="VIN (опционально)">
          <TextInput placeholder="KMHJU81BDCU123456" placeholderTextColor={colors.muted} autoCapitalize="characters" value={vin} onChangeText={setVin} style={styles.input} maxLength={20} />
        </Field>

        <View style={{ height: spacing(2) }} />
        <Row>
          <PrimaryButton title="Сохранить" onPress={save} />
          {isEdit && <DangerButton title="Удалить" onPress={del} />}
        </Row>
        <View style={{ height: spacing(4) }} />
      </ScrollView>
    </ThemedView>
  );
}

/* мини-компоненты */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: spacing(2) }}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      {children}
    </View>
  );
}
function Row({ children, align }: { children: React.ReactNode; align?: 'center' }) {
  return <View style={[styles.row, align === 'center' && { alignItems: 'center' }]}>{children}</View>;
}
function Col({ children }: { children: React.ReactNode }) { return <View style={styles.col}>{children}</View>; }
function PrimaryButton({ title, onPress }: { title: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && { opacity: 0.9 }]}><ThemedText style={styles.buttonText}>{title}</ThemedText></Pressable>;
}
function DangerButton({ title, onPress }: { title: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.danger, pressed && { opacity: 0.9 }]}><ThemedText style={styles.buttonText}>{title}</ThemedText></Pressable>;
}

/* стили */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing(2), paddingBottom: spacing(6) },
  title: { marginBottom: spacing(2) },
  label: { color: colors.muted, marginBottom: spacing(1) },
  input: {
    backgroundColor: colors.card, color: colors.text, borderColor: colors.border,
    borderWidth: 1, borderRadius: 12, paddingHorizontal: spacing(1.5), paddingVertical: spacing(1.25),
  },
  picker: { backgroundColor: colors.card, color: colors.text, borderColor: colors.border, borderWidth: 1, borderRadius: 12 },
  row: { flexDirection: 'row', gap: spacing(2), marginBottom: spacing(2) },
  col: { flex: 1 },
  button: { backgroundColor: colors.primary, paddingVertical: spacing(1.5), borderRadius: 14, alignItems: 'center', flex: 1 },
  danger: { backgroundColor: colors.danger, paddingVertical: spacing(1.5), borderRadius: 14, alignItems: 'center', flex: 1 },
  buttonText: { color: '#fff', fontWeight: '600' },
});
