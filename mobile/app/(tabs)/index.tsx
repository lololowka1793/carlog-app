import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Switch,
  Pressable,
} from 'react-native';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { colors, spacing } from '../../constants/theme';
import { Picker } from '@react-native-picker/picker';
import { useProfileStore } from '../../store/profileStore';
import type { CarProfile } from '../../models/carProfile';
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function IndexRedirect() {
  useEffect(() => {
    router.replace('/(tabs)/cars'); // стартуем сразу со списка авто
  }, []);
  return null;
}

type TransportType = 'car' | 'motorcycle' | 'bus' | 'truck';
type FuelType = 'gasoline' | 'diesel' | 'lpg' | 'electric';
type DistanceUnit = 'km' | 'mi';

export default function ProfileScreen() {
  const { profile, loadProfile, setProfile } = useProfileStore();

  // локальное состояние формы
  const [transport, setTransport] = useState<TransportType>('car');
  const [brand, setBrand] = useState<string>('Audi');
  const [model, setModel] = useState<string>('');
  const [plate, setPlate] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [hasTwoTanks, setHasTwoTanks] = useState(false);
  const [tank1, setTank1] = useState<string>('');
  const [tank2, setTank2] = useState<string>('');
  const [fuel, setFuel] = useState<FuelType>('gasoline');
  const [unit, setUnit] = useState<DistanceUnit>('km');
  const [vin, setVin] = useState<string>('');
  const [odometer, setOdometer] = useState<string>(''); // строкой для удобного ввода

  const brands = useMemo(() => ['Audi', 'BMW', 'Mercedes', 'Hyundai'], []);

  // загрузка из AsyncStorage при первом рендере
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // если профиль уже есть — подставляем в форму
  useEffect(() => {
    if (!profile) return;
    setTransport(profile.transport);
    setBrand(profile.brand);
    setModel(profile.model);
    setPlate(profile.plate);
    setYear(profile.year ? String(profile.year) : '');
    setFuel(profile.fuel);
    setUnit(profile.unit);
    setVin(profile.vin ?? '');
    setOdometer(profile.odometer ? String(profile.odometer) : '');
    if (profile.tanks.length === 2) {
      setHasTwoTanks(true);
      setTank1(String(profile.tanks[0] ?? ''));
      setTank2(String(profile.tanks[1] ?? ''));
    } else {
      setHasTwoTanks(false);
      setTank1(String(profile.tanks[0] ?? ''));
      setTank2('');
    }
  }, [profile]);

  const submit = async () => {
    // минимальная валидация
    if (!model.trim()) return Alert.alert('Профиль авто', 'Введите модель автомобиля');
    if (year && !/^\d{4}$/.test(year)) return Alert.alert('Профиль авто', 'Год укажите 4 цифрами, напр. 2013');
    if (!tank1) return Alert.alert('Профиль авто', 'Укажите объём бака');
    if (hasTwoTanks && !tank2) return Alert.alert('Профиль авто', 'Укажите объём второго бака');
    if (!/^\d+(\.\d+)?$/.test(odometer || '')) return Alert.alert('Профиль авто', 'Одометр укажите числом');

    const data: CarProfile = {
      transport,
      brand,
      model: model.trim(),
      plate: plate.trim().toUpperCase(),
      year: year ? Number(year) : undefined,
      tanks: hasTwoTanks ? [Number(tank1), Number(tank2)] : [Number(tank1)],
      fuel,
      unit,
      vin: vin.trim() || undefined,
      odometer: Number(odometer),
    };

    await setProfile(data);
    Alert.alert('Профиль авто', 'Данные сохранены ✅');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ThemedText type="title" style={styles.title}>Профиль авто</ThemedText>

        {/* 1. Тип транспорта */}
        <Field label="Тип транспорта">
          <Picker
            selectedValue={transport}
            onValueChange={(v: TransportType) => setTransport(v)}
            style={styles.picker as any}
          >
            <Picker.Item label="Автомобиль" value="car" />
            <Picker.Item label="Мотоцикл" value="motorcycle" />
            <Picker.Item label="Автобус" value="bus" />
            <Picker.Item label="Грузовик" value="truck" />
          </Picker>
        </Field>

        {/* 2. Производитель */}
        <Field label="Производитель">
          <Picker
            selectedValue={brand}
            onValueChange={(v: string) => setBrand(v)}
            style={styles.picker as any}
          >
            {brands.map((b) => <Picker.Item key={b} label={b} value={b} />)}
          </Picker>
        </Field>

        {/* 3. Модель */}
        <Field label="Модель">
          <TextInput
            placeholder="Например, Santa Fe"
            placeholderTextColor={colors.muted}
            value={model}
            onChangeText={setModel}
            style={styles.input}
          />
        </Field>

        {/* 4. Рег. номер и год */}
        <Row>
          <Col>
            <Field label="Рег. номер">
              <TextInput
                placeholder="ABC 123"
                placeholderTextColor={colors.muted}
                autoCapitalize="characters"
                value={plate}
                onChangeText={setPlate}
                style={styles.input}
              />
            </Field>
          </Col>
          <Col>
            <Field label="Год">
              <TextInput
                placeholder="2013"
                placeholderTextColor={colors.muted}
                keyboardType="number-pad"
                maxLength={4}
                value={year}
                onChangeText={setYear}
                style={styles.input}
              />
            </Field>
          </Col>
        </Row>

        {/* 5. Один/два бака */}
        <Row align="center">
          <ThemedText style={{ color: colors.text, marginRight: spacing(1) }}>
            Два бака
          </ThemedText>
          <Switch
            value={hasTwoTanks}
            onValueChange={setHasTwoTanks}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#fff"
          />
        </Row>

        <Row>
          <Col>
            <Field label={hasTwoTanks ? 'Бак 1 (л)' : 'Объём бака (л)'}>
              <TextInput
                placeholder="Напр. 70"
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                value={tank1}
                onChangeText={setTank1}
                style={styles.input}
              />
            </Field>
          </Col>
          {hasTwoTanks && (
            <Col>
              <Field label="Бак 2 (л)">
                <TextInput
                  placeholder="Напр. 30"
                  placeholderTextColor={colors.muted}
                  keyboardType="numeric"
                  value={tank2}
                  onChangeText={setTank2}
                  style={styles.input}
                />
              </Field>
            </Col>
          )}
        </Row>

        {/* 6. Топливо */}
        <Field label="Тип топлива">
          <Picker
            selectedValue={fuel}
            onValueChange={(v: FuelType) => setFuel(v)}
            style={styles.picker as any}
          >
            <Picker.Item label="Бензин" value="gasoline" />
            <Picker.Item label="Дизель" value="diesel" />
            <Picker.Item label="Газ (LPG)" value="lpg" />
            <Picker.Item label="Электричество" value="electric" />
          </Picker>
        </Field>

        {/* 7. Единицы */}
        <Field label="Единицы расстояния">
          <Picker
            selectedValue={unit}
            onValueChange={(v: DistanceUnit) => setUnit(v)}
            style={styles.picker as any}
          >
            <Picker.Item label="Километры (км)" value="km" />
            <Picker.Item label="Мили (mi)" value="mi" />
          </Picker>
        </Field>

        {/* 8. Одометр (новое поле) */}
        <Field label="Одометр">
          <TextInput
            placeholder={unit === 'km' ? 'Напр. 180000' : 'Напр. 112000'}
            placeholderTextColor={colors.muted}
            keyboardType="numeric"
            value={odometer}
            onChangeText={setOdometer}
            style={styles.input}
          />
        </Field>

        {/* 9. VIN */}
        <Field label="VIN (опционально)">
          <TextInput
            placeholder="KMHJU81BDCU123456"
            placeholderTextColor={colors.muted}
            autoCapitalize="characters"
            value={vin}
            onChangeText={setVin}
            style={styles.input}
            maxLength={20}
          />
        </Field>

        <View style={{ height: spacing(2) }} />
        <PrimaryButton title="Сохранить" onPress={submit} />
        <View style={{ height: spacing(4) }} />
      </ScrollView>
    </ThemedView>
  );
}

/* мини-компоненты для поля/сеток/кнопки */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: spacing(2) }}>
      <ThemedText style={styles.label}>{label}</ThemedText>
      {children}
    </View>
  );
}

function Row({ children, align }: { children: React.ReactNode; align?: 'center' }) {
  return (
    <View style={[styles.row, align === 'center' && { alignItems: 'center' }]}>
      {children}
    </View>
  );
}

function Col({ children }: { children: React.ReactNode }) {
  return <View style={styles.col}>{children}</View>;
}

function PrimaryButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && { opacity: 0.9 }]}>
      <ThemedText style={styles.buttonText}>{title}</ThemedText>
    </Pressable>
  );
}

/* стили */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing(2), paddingBottom: spacing(6) },
  title: { marginBottom: spacing(2) },
  label: { color: colors.muted, marginBottom: spacing(1) },
  input: {
    backgroundColor: colors.card,
    color: colors.text,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(1.25),
  },
  picker: {
    backgroundColor: colors.card,
    color: colors.text,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
  },
  row: { flexDirection: 'row', gap: spacing(2), marginBottom: spacing(2) },
  col: { flex: 1 },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: spacing(1.5),
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});
