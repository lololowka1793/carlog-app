// mobile/styles/list.ts
import { StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

export const listStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  section: { paddingHorizontal: spacing(2), paddingTop: spacing(2) },
  sectionTitle: { color: colors.muted, fontWeight: '600', marginBottom: spacing(1) },

  item: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: spacing(2),
    paddingVertical: spacing(2),
    marginHorizontal: spacing(2),
    marginBottom: spacing(1.5),
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing(1.5),
  },
  itemTextWrap: { flex: 1, minWidth: 0 }, // важно для обрезки текста
  itemTitle: { color: '#fff', fontWeight: '600' },
  itemSubtitle: { color: colors.muted, marginTop: 2 },

  // одна строка с троеточием — чтобы не «вылазило»
  oneLine: { numberOfLines: 1 } as any, // используем в <Text numberOfLines={1} />
});
