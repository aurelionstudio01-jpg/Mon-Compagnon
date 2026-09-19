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
import { Idea, IdeaStatus } from '../../types';
import { useSettingsStore } from '../../stores/settingsStore';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const STATUS_LABELS: Record<IdeaStatus, string> = {
  nouvelle: 'Nouvelle',
  a_developper: 'À développer',
  en_cours: 'En cours',
  utilisee: 'Utilisée',
  abandonnee: 'Abandonnée',
  a_revoir: 'À revoir',
};

export default function IdeasScreen() {
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === 'sombre';
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const loadIdeas = async () => {
    try {
      const db = await getDatabase();
      const rows = await db.getAllAsync<any>('SELECT * FROM ideas ORDER BY updated_at DESC');
      setIdeas(
        rows.map((r) => ({
          id: r.id,
          projectId: r.project_id,
          title: r.title,
          description: r.description,
          category: r.category,
          status: r.status as IdeaStatus,
          createdAt: r.created_at,
          updatedAt: r.updated_at,
        }))
      );
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(useCallback(() => { loadIdeas(); }, []));

  const createIdea = async () => {
    if (!title.trim()) {
      Alert.alert('Titre requis');
      return;
    }
    const now = new Date().toISOString();
    const id = generateId();
    try {
      const db = await getDatabase();
      await db.runAsync(
        'INSERT INTO ideas (id, title, description, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [id, title.trim(), description.trim() || null, 'nouvelle', now, now]
      );
      setModalVisible(false);
      setTitle('');
      setDescription('');
      loadIdeas();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <FlatList
        data={ideas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="bulb-outline" size={48} color={isDark ? '#5a5a6a' : '#b0a8d0'} />
            <Text style={[styles.emptyText, isDark && styles.textDark]}>
              Ton carnet d'idées est vide.\nNote rapidement tout ce qui te passe par la tête.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, isDark && styles.cardDark]}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, isDark && styles.textDark]}>{item.title}</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{STATUS_LABELS[item.status]}</Text>
              </View>
            </View>
            {item.description ? (
              <Text style={[styles.cardDesc, isDark && styles.descDark]} numberOfLines={3}>
                {item.description}
              </Text>
            ) : null}
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, isDark && styles.modalDark]}>
            <Text style={[styles.modalTitle, isDark && styles.textDark]}>Nouvelle idée</Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="Titre de l'idée"
              placeholderTextColor="#9a9aaa"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, styles.inputMulti, isDark && styles.inputDark]}
              placeholder="Description..."
              placeholderTextColor="#9a9aaa"
              value={description}
              onChangeText={setDescription}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtn}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createBtn} onPress={createIdea}>
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
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#2a2a3e', flex: 1 },
  badge: { backgroundColor: '#eef0ff', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 12, color: '#5b4bc4', fontWeight: '500' },
  cardDesc: { marginTop: 8, fontSize: 14, color: '#6b6b7b', lineHeight: 20 },
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
  modalTitle: { fontSize: 20, fontWeight: '600', marginBottom: 16, color: '#2a2a3e' },
  input: {
    backgroundColor: '#f0eef8',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
    color: '#2a2a3e',
  },
  inputDark: { backgroundColor: '#2a2a3e', color: '#e8e4f5' },
  inputMulti: { minHeight: 100, textAlignVertical: 'top' },
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
