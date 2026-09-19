import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../../stores/settingsStore';

interface Message {
  id: string;
  role: 'user' | 'companion';
  content: string;
  createdAt: string;
}

export default function CompanionScreen() {
  const companionName = useSettingsStore((s) => s.name);
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === 'sombre';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'companion',
      content: `Coucou ! Je suis ${companionName}. Content de te retrouver. Tu veux créer quelque chose aujourd'hui, ou juste discuter ?`,
      createdAt: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList>(null);

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Réponse simple pour le MVP (sans IA pour l'instant)
    setTimeout(() => {
      const reply = generateSimpleReply(userMsg.content, companionName);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'companion',
          content: reply,
          createdAt: new Date().toISOString(),
        },
      ]);
    }, 600);
  };

  useEffect(() => {
    listRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, isDark && styles.containerDark]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.role === 'user' ? styles.userBubble : styles.companionBubble,
              isDark && (item.role === 'user' ? styles.userBubbleDark : styles.companionBubbleDark),
            ]}
          >
            <Text
              style={[
                styles.bubbleText,
                item.role === 'user' ? styles.userText : styles.companionText,
                isDark && styles.textDark,
              ]}
            >
              {item.content}
            </Text>
          </View>
        )}
      />

      <View style={[styles.inputRow, isDark && styles.inputRowDark]}>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          value={input}
          onChangeText={setInput}
          placeholder="Écris à ton compagnon..."
          placeholderTextColor={isDark ? '#6a6a7a' : '#9a9aaa'}
          multiline
          maxLength={2000}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function generateSimpleReply(text: string, name: string): string {
  const lower = text.toLowerCase();

  if (lower.includes('coucou') || lower.includes('salut') || lower.includes('bonjour')) {
    return `Coucou ! Content de te parler. Comment tu te sens aujourd'hui ?`;
  }
  if (lower.includes('idée') || lower.includes('astrélys') || lower.includes('roman')) {
    return `Oh, une idée ? Dis-moi tout, je suis tout ouïe. Tu veux que je la note dans le carnet ?`;
  }
  if (lower.includes('pas envie') || lower.includes('fatigu')) {
    return `C'est ok de faire une pause. On peut juste discuter, ou tu peux noter une petite pensée dans le journal si tu veux.`;
  }
  if (lower.includes('merci')) {
    return `Avec plaisir ! Je suis là pour ça.`;
  }
  if (lower.includes('qui es-tu') || lower.includes('présente')) {
    return `Je suis ${name}, ton compagnon créatif. Je suis là pour discuter, t'aider à écrire, classer tes idées et garder la mémoire de tes projets. Mais c'est toujours toi qui décides.`;
  }

  return `Je t'écoute. Tu peux me parler de tout : tes idées, tes personnages, ta journée, ou juste ce qui te passe par la tête.`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faf8ff' },
  containerDark: { backgroundColor: '#12121f' },
  list: { padding: 16, paddingBottom: 8 },
  bubble: {
    maxWidth: '82%',
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#7c6aef',
    borderBottomRightRadius: 4,
  },
  companionBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#eef0ff',
    borderBottomLeftRadius: 4,
  },
  userBubbleDark: { backgroundColor: '#5b4bc4' },
  companionBubbleDark: { backgroundColor: '#2a2a3e' },
  bubbleText: { fontSize: 16, lineHeight: 22 },
  userText: { color: '#fff' },
  companionText: { color: '#2a2a3e' },
  textDark: { color: '#e8e4f5' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e8e4f5',
    backgroundColor: '#fff',
  },
  inputRowDark: {
    backgroundColor: '#1a1a2e',
    borderTopColor: '#2a2a3e',
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: '#f0eef8',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#2a2a3e',
  },
  inputDark: {
    backgroundColor: '#2a2a3e',
    color: '#e8e4f5',
  },
  sendBtn: {
    marginLeft: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#7c6aef',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
