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
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getDatabase } from '../../db/schema';
import { Project } from '../../types';
import { useSettingsStore } from '../../stores/settingsStore';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export default function ProjectsScreen() {
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === 'sombre';
  const [projects, setProjects] = useState<Project[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const loadProjects = async () => {
    try {
      const db = await getDatabase();
      const rows = await db.getAllAsync<any>('SELECT * FROM projects ORDER BY updated_at DESC');
      setProjects(
        rows.map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          color: r.color,
          createdAt: r.created_at,
          updatedAt: r.updated_at,
        }))
      );
    } catch (e) {
      console.error(e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProjects();
    }, [])
  );

  const createProject = async () => {
    if (!newName.trim()) {
      Alert.alert('Nom requis', 'Donne un nom à ton projet.');
      return;
    }
    const now = new Date().toISOString();
    const id = generateId();
    try {
      const db = await getDatabase();
      await db.runAsync(
        'INSERT INTO projects (id, name, description, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
        [id, newName.trim(), newDesc.trim() || null, now, now]
      );
      setModalVisible(false);
      setNewName('');
      setNewDesc('');
      loadProjects();
    } catch (e) {
      console.error(e);
      Alert.alert('Erreur', 'Impossible de créer le projet.');
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="library-outline" size={48} color={isDark ? '#5a5a6a' : '#b0a8d0'} />
            <Text style={[styles.emptyText, isDark && styles.textDark]}>
              Aucun projet pour l'instant.\nCrée ton premier roman ou univers !
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, isDark && styles.cardDark]}
            onPress={() => router.push(`/project/${item.id}`)}
          >
            <View style={[styles.colorDot, { backgroundColor: item.color || '#7c6aef' }]} />
            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, isDark && styles.textDark]}>{item.name}</Text>
              {item.description ? (
                <Text style={[styles.cardDesc, isDark && styles.descDark]} numberOfLines={2}>
                  {item.description}
                </Text>
              ) : null}
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#6a6a7a' : '#a0a0b0'} />
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, isDark && styles.modalDark]}>
            <Text style={[styles.modalTitle, isDark && styles.textDark]}>Nouveau projet</Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="Nom du projet (ex: Astrélys)"
              placeholderTextColor="#9a9aaa"
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              style={[styles.input, styles.inputMulti, isDark && styles.inputDark]}
              placeholder="Description (optionnelle)"
              placeholderTextColor="#9a9aaa"
              value={newDesc}
              onChangeText={setNewDesc}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtn}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.createBtn} onPress={createProject}>
                <Text style={styles.createBtnText}>Créer</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#7c6aef',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  cardDark: { backgroundColor: '#1a1a2e' },
  colorDot: { width: 12, height: 12, borderRadius: 6, marginRight: 14 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '600', color: '#2a2a3e' },
  cardDesc: { marginTop: 4, fontSize: 14, color: '#6b6b7b' },
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
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
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
  inputMulti: { minHeight: 80, textAlignVertical: 'top' },
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
