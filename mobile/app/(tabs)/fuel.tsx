// mobile/app/(tabs)/fuel.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, SectionList, StyleSheet, Pressable, Modal, TextInput, Alert,
} from 'react-native';
import { useFuelStore } from '../../store/fuelStore';
import { useCarsStore } from '../../store/carsStore';
import type { FuelEntry } from '../../models/fuelEntry';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const COLORS = {
  BG: '#0f132e',
  CARD: '#161a3a',
  LINE: '#27306a',
  MUTED: '#aab0f0',
  ACCENT: '#5d7bff',
};

export default function FuelScreen() {
  const { cars, activeCarId } = useCarsStore();
  const unit = useMemo(
    () => cars.find(c => c.id === activeCarId)?.unit ?? 'km',
    [cars, activeCarId]
  );

  const { entries, load, add } = useFuelStore();

  // форма
  const [modal, setModal] = useState(false);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [odometer, setOdometer] = useState<string>('');
  const [liters, setLiters] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [isFull, setIsFull] = useState<boolean>(false);

  useEffect(() => {
    if (activeCarId) load(activeCarId);
  }, [activeCarId, load]);

  // нет активного авто — показываем заглушку
  if (!activeCarId) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.empty}>Сначала выберите активный автомобиль во вкладке «Мои авто»</Text>
      </View>
    );
  }

  // группировка по месяцам
  const sections = useMemo(() => {
    const groups: Record<string, FuelEntry[]> = {};
    entries.forEach(e => {
      const key = format(new Date(e.date), 'LLLL yyyy', { locale: ru }); // «сентябрь 2025»
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    });
    return Object.keys(groups).map(title => ({ title, data: groups[title] }));
  }, [entries]);

  const submit = async () => {
    if (!odometer || !liters || !price) {
      return Alert.alert('Заправки', 'Заполните одометр, литры и цену.');
    }
    const entry: FuelEntry = {
      id: String(Date.now()),
      carId: activeCarId,
      date,
      odometer: Number(odometer),
      liters: Number(liters),
      pricePerLiter: Number(price),
      totalCost: Number(liters) * Number(price),
      isFullTank: isFull,
    };
    await add(entry);
    setModal(false);
    // очистка формы
    setOdometer(''); setLiters(''); setPrice(''); setIsFull(false);
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>Записей пока нет. Нажмите «+», чтобы добавить первую.</Text>
        }
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={styles.timelineCol}>
              <View style={styles.timelineDot} />
              <View style={styles.timelineLine} />
            </View>

            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>Заправка</Text>
              <Text style={styles.itemSub}>
                {format(new Date(item.date), 'EEEE, dd', { locale: ru })}
              </Text>
              <Text style={styles.itemSub}>
                {item.odometer.toLocaleString()} {unit}
              </Text>
            </View>

            <Text style={styles.amount}>
              {item.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽
            </Text>
          </View>
        )}
      />

      {/* FAB */}
      <Pressable style={styles.fab} onPress={() => setModal(true)}>
        <Text style={{ color: 'white', fontSize: 32, lineHeight: 32 }}>＋</Text>
      </Pressable>

      {/* Модалка */}
      <Modal visible={modal} transparent animationType="slide" onRequestClose={() => setModal(false)}>
        <View style={styles.backdrop}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Новая заправка</Text>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Дата</Text>
                <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="2025-09-18" />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Одометр</Text>
                <TextInput style={styles.input} value={odometer} onChangeText={setOdometer} keyboardType="numeric" />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.col}>
                <Text style={styles.label}>Топливо (л)</Text>
                <TextInput style={styles.input} value={liters} onChangeText={setLiters} keyboardType="numeric" />
              </View>
              <View style={styles.col}>
                <Text style={styles.label}>Цена/л</Text>
                <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />
              </View>
            </View>

            <Pressable style={styles.toggle} onPress={() => setIsFull(v => !v)}>
              <View style={[styles.switchBox, isFull && styles.switchOn]} />
              <Text style={styles.toggleText}>Полный бак</Text>
            </Pressable>

            <View style={styles.actions}>
              <Pressable style={[styles.btn, styles.btnGhost]} onPress={() => setModal(false)}>
                <Text style={styles.btnGhostText}>Отмена</Text>
              </Pressable>
              <Pressable style={[styles.btn, styles.btnPrimary]} onPress={submit}>
                <Text style={styles.btnPrimaryText}>Сохранить</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // список
  container: { flex: 1, backgroundColor: COLORS.BG },
  empty: { color: COLORS.MUTED, textAlign: 'center', marginTop: 40, paddingHorizontal: 16 },
  sectionHeader: { color: COLORS.MUTED, fontWeight: '600', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 6 },
  itemRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingHorizontal: 16, paddingVertical: 14, borderBottomColor: COLORS.LINE, borderBottomWidth: 1,
  },
  timelineCol: { width: 28, alignItems: 'center' },
  timelineDot: { width: 14, height: 14, borderRadius: 7, backgroundColor: COLORS.ACCENT, marginTop: 5 },
  timelineLine: { flex: 1, width: 2, backgroundColor: COLORS.ACCENT, marginTop: 2, marginBottom: -12, opacity: 0.4 },
  itemContent: { flex: 1, marginLeft: 8 },
  itemTitle: { color: 'white', fontWeight: '600' },
  itemSub: { color: COLORS.MUTED, fontSize: 12 },
  amount: { color: 'white', fontWeight: '700' },

  // FAB
  fab: {
    position: 'absolute', right: 18, bottom: 24,
    width: 60, height: 60, borderRadius: 30,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.ACCENT, elevation: 8,
  },

  // модальный лист
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: COLORS.CARD, padding: 16, borderTopLeftRadius: 18, borderTopRightRadius: 18 },
  sheetTitle: { color: 'white', fontWeight: '700', fontSize: 16, marginBottom: 10 },

  row: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  col: { flex: 1 },
  label: { color: COLORS.MUTED, marginBottom: 6, fontSize: 12 },
  input: { backgroundColor: 'white', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },

  toggle: { flexDirection: 'row', alignItems: 'center', marginTop: 6, marginBottom: 12 },
  switchBox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: COLORS.ACCENT, marginRight: 8 },
  switchOn: { backgroundColor: COLORS.ACCENT },
  toggleText: { color: 'white' },

  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  btn: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10 },
  btnGhost: { borderWidth: 1, borderColor: '#3b3f74' },
  btnGhostText: { color: COLORS.MUTED },
  btnPrimary: { backgroundColor: COLORS.ACCENT },
  btnPrimaryText: { color: 'white', fontWeight: '700' },
});
