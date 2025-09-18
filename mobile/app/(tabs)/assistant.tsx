// mobile/app/(tabs)/assistant.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, FlatList } from 'react-native';

const COLORS = {
  BG: '#0f132e',
  CARD: '#161a3a',
  LINE: '#27306a',
  MUTED: '#aab0f0',
  ACCENT: '#5d7bff',
};

type Msg = { id: string; role: 'user' | 'ai'; text: string };

export default function AssistantScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([
    { id: '0', role: 'ai', text: 'Привет! Я помогу по твоему авто и журналам.' },
  ]);

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const user: Msg = { id: String(Date.now()), role: 'user', text: trimmed };
    // пока стаб: просто эхо
    const ai: Msg = { id: String(Date.now() + 1), role: 'ai', text: 'Ок, принял 👌' };
    setMessages((m) => [...m, user, ai]);
    setInput('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.role === 'user' ? styles.me : styles.ai]}>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
      />
      <View style={styles.composer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Спросить про авто..."
          placeholderTextColor={COLORS.MUTED}
          style={styles.input}
        />
        <Pressable style={styles.send} onPress={send}>
          <Text style={{ color: 'white', fontWeight: '700' }}>Отправить</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BG },
  bubble: {
    maxWidth: '85%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  me: { alignSelf: 'flex-end', backgroundColor: '#2a3bb8' },
  ai: { alignSelf: 'flex-start', backgroundColor: COLORS.CARD, borderWidth: 1, borderColor: COLORS.LINE },
  text: { color: 'white' },
  composer: {
    flexDirection: 'row',
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.LINE,
    backgroundColor: COLORS.CARD,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  send: { backgroundColor: COLORS.ACCENT, paddingHorizontal: 14, borderRadius: 10, justifyContent: 'center' },
});
