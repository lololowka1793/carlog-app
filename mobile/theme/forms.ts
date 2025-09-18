// mobile/styles/forms.ts
import { StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

export const formStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing(2), paddingBottom: spacing(6) },
  title: { marginBottom: spacing(2), color: colors.text, fontSize: 24, fontWeight: '700' },
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
    flex: 1,
  },
  danger: {
    backgroundColor: colors.danger,
    paddingVertical: spacing(1.5),
    borderRadius: 14,
    alignItems: 'center',
    flex: 1,
  },
  buttonText: { color: '#fff', fontWeight: '600' },
});
