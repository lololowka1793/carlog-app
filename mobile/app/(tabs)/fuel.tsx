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

export default function FuelScreen() {
  const { cars, activeCarId } = useCarsStore();
  const unit = useMemo(
    () => cars.find(c => c.id === activeCarId)?.unit ?? 'km',
    [cars, activeCarId]
  );

  const { entries, load, add } = useFuelStore();

  // форма добавления (в модалке)
  const [modal, setModal] = useState(false);
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [odometer, setOdometer] = useState<string>('');
  const [liters, setLiters] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [isFull, setIsFull] = useState<boolean>(false);

  useEffect(() => {
    if (activeCarId) load(activeCarId);
  }, [activeCarId, load]);

  // группируем по месяцам
  const sections = useMemo(() => {
    const groups: Record<string, FuelEntry[]> = {};
    entries.forEach(e => {
      const key = format(new Date(e.date), 'LLLL yyyy', { locale: ru }); // «сентябрь 2025»
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    });
    return Object.keys(groups).map(title => ({
      title,
      data: groups[title],
    }));
  }, [entries]);

  const submit = async () => {
    if (!activeCarId) return Alert.alert('Заправки', 'Сначала выберите активный авто во вкладке «Мои авто».');
    if (!odometer || !liters || !price) return Alert.alert('Заправки', 'Заполните одометр, литры и цену.');

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
              {item.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })} ₽
            </Text>
          </View>
        )}
      />

      {/* FAB */}
      <Pressable style={styles.fab} onPress={() => setModal(true)}>
        <Text style={{ color: 'white', fontSize: 28, lineHeight: 28 }}>＋</Text>
      </Pressable>

      {/* Модалка добавления */}
      <Modal visible={modal} transparent animationType="slide" onRequestClose={() => setModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Новая заправка</Text>

            <Text style={styles.label}>Дата</Text>
            <TextInput style={styles.input} value={date} onChangeText={setDate} placeholder="2025-09-17" />

            <Text style={styles.label}>Одометр</Text>
            <TextInput style={styles.input} value={odometer} onChangeText={setOdometer} keyboardType="numeric" />

            <Text style={styles.label}>Литры</Text>
            <TextInput style={styles.input} value={liters} onChangeText={setLiters} keyboardType="numeric" />

            <Text style={styles.label}>Цена за литр</Text>
            <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />

            <Pressable style={styles.toggle} onPress={() => setIsFull(v => !v)}>
              <View style={[styles.checkbox, isFull && styles.checkboxOn]} />
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

const BG = '#0f132e';
const MUTED = '#aab0f0';
const ACCENT = '#5d7bff';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  empty: { color: MUTED, textAlign: 'center', marginTop: 40, paddingHorizontal: 16 },
  sectionHeader: {
    color: MUTED, fontWeight: '600', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6,
  },
  itemRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomColor: '#1f2455', borderBottomWidth: 1,
  },
  timelineCol: { width: 30, alignItems: 'center' },
  timelineDot: { width: 18, height: 18, borderRadius: 9, backgroundColor: ACCENT, marginTop: 4 },
  timelineLine: { flex: 1, width: 2, backgroundColor: ACCENT, marginTop: 2, marginBottom: -12 },
  itemContent: { flex: 1, marginLeft: 6 },
  itemTitle: { color: 'white', fontWeight: '600' },
  itemSub: { color: MUTED, fontSize: 12 },
  amount: { color: 'white', fontWeight: '700' },

  fab: {
    position: 'absolute', right: 18, bottom: 24,
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: ACCENT, elevation: 6,
  },

  modalBackdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'flex-end',
  },
  modalCard: {
    alignSelf: 'stretch', backgroundColor: '#161a3a', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16,
  },
  modalTitle: { color: 'white', fontWeight: '700', fontSize: 16, marginBottom: 12 },
  label: { color: MUTED, marginTop: 6, marginBottom: 4, fontSize: 12 },
  input: { backgroundColor: 'white', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  toggle: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 2, borderColor: ACCENT, marginRight: 8 },
  checkboxOn: { backgroundColor: ACCENT },
  toggleText: { color: 'white' },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 14, gap: 10 },
  btn: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  btnGhost: { borderWidth: 1, borderColor: '#3b3f74' },
  btnGhostText: { color: MUTED },
  btnPrimary: { backgroundColor: ACCENT },
  btnPrimaryText: { color: 'white', fontWeight: '600' },
});
