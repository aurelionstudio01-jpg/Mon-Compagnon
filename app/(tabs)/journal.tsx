import { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getDatabase } from '../../db/schema';
import { JournalEntry } from '../../types';
import { useSettingsStore } from '../../stores/settingsStore';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function JournalScreen() {
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === 'sombre';
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');

  const loadEntries = async () => {
    try {
      const db = await getDatabase();
      const rows = await db.getAllAsync<any>('SELECT * FROM journal_entries ORDER BY date DESC');
      setEntries(
        rows.map((r) => ({
          id: r.id,
          date: r.date,
          content: r.content,
          mood: r.mood,
          events: r.events,
          ideas: r.ideas,
          goals: r.goals,
          memories: r.memories,
          createdAt: r.created_at,
          updatedAt: r.updated_at,
        }))
      );
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(useCallback(() => { loadEntries(); }, []));

  const createEntry = async () => {
    if (!content.trim()) {
      Alert.alert('Contenu requis');
      return;
    }
    const now = new Date().toISOString();
    const id = generateId();
    try {
      const db = await getDatabase();
      await db.runAsync(
        'INSERT INTO journal_entries (id, date, content, mood, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [id, today(), content.trim(), mood.trim() || null, now, now]
      );
      setModalVisible(false);
      setContent('');
      setMood('');
      loadEntries();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="book-outline" size={48} color={isDark ? '#5a5a6a' : '#b0a8d0'} />
            <Text style={[styles.emptyText, isDark && styles.textDark]}>
              Ton journal est encore vide.\nNote ce que tu as vécu aujourd'hui.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, isDark && styles.cardDark]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.date, isDark && styles.textDark]}>{item.date}</Text>
              {item.mood ? <Text style={styles.mood}>{item.mood}</Text> : null}
            </View>
            <Text style={[styles.content, isDark && styles.descDark]} numberOfLines={4}>
              {item.content}
            </Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, isDark && styles.modalDark]}>
            <Text style={[styles.modalTitle, isDark && styles.textDark]}>Entrée du journal</Text>
            <Text style={[styles.dateLabel, isDark && styles.descDark]}>{today()}</Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="Humeur (optionnelle)"
              placeholderTextColor="#9a9aaa"
              value={mood}
              onChangeText={setMood}
            />
            <TextInput
              style={[styles.input, styles.inputMulti, isDark && styles.inputDark]}
              placeholder="Ce que tu as vécu, pensé, rêvé..."
              placeholderTextColor="#9a9aaa"
              value={content}
              onChangeText={setContent}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtn}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createBtn} onPress={createEntry}>
                <Text style={styles.createBtnText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faf8ff' },
  containerDark: { backgroundColor: '#12121f' },
  list: { padding: 16, paddingBottom: 80 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { marginTop: 16, textAlign: 'center', color: '#6b6b7b', fontSize: 16, lineHeight: 24 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#7c6aef',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardDark: { backgroundColor: '#1a1a2e' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  date: { fontSize: 14, fontWeight: '600', color: '#5b4bc4' },
  mood: { fontSize: 14, color: '#7c6aef' },
  content: { fontSize: 15, color: '#2a2a3e', lineHeight: 22 },
  descDark: { color: '#9a9aaa' },
  textDark: { color: '#e8e4f5' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#7c6aef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 },
  modalDark: { backgroundColor: '#1a1a2e' },
  modalTitle: { fontSize: 20, fontWeight: '600', marginBottom: 4, color: '#2a2a3e' },
  dateLabel: { fontSize: 14, color: '#6b6b7b', marginBottom: 16 },
  input: {
    backgroundColor: '#f0eef8',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
    color: '#2a2a3e',
  },
  inputDark: { backgroundColor: '#2a2a3e', color: '#e8e4f5' },
  inputMulti: { minHeight: 140, textAlignVertical: 'top' },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  cancelBtn: { color: '#6b6b7b', fontSize: 16, padding: 12 },
  createBtn: {
    backgroundColor: '#7c6aef',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginLeft: 12,
  },
  createBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});
