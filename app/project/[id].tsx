import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getDatabase } from '../../db/schema';
import { Project } from '../../types';
import { useSettingsStore } from '../../stores/settingsStore';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === 'sombre';
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const db = await getDatabase();
        const row = await db.getFirstAsync<any>('SELECT * FROM projects WHERE id = ?', [id]);
        if (row) {
          setProject({
            id: row.id,
            name: row.name,
            description: row.description,
            color: row.color,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
          });
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id]);

  if (!project) {
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <Text style={[styles.loading, isDark && styles.textDark]}>Chargement...</Text>
      </View>
    );
  }

  const sections = [
    { icon: 'people-outline' as const, label: 'Personnages', desc: 'Fiches de personnages' },
    { icon: 'planet-outline' as const, label: 'Univers', desc: 'Mondes, lieux, règles' },
    { icon: 'document-text-outline' as const, label: 'Brouillons', desc: 'Scènes et chapitres' },
    { icon: 'bulb-outline' as const, label: 'Idées du projet', desc: 'Idées liées à ce roman' },
    { icon: 'time-outline' as const, label: 'Chronologie', desc: 'Événements et timeline' },
  ];

  return (
    <>
      <Stack.Screen options={{ title: project.name }} />
      <ScrollView style={[styles.container, isDark && styles.containerDark]} contentContainerStyle={styles.content}>
        {project.description ? (
          <Text style={[styles.desc, isDark && styles.descDark]}>{project.description}</Text>
        ) : null}

        {sections.map((s) => (
          <TouchableOpacity key={s.label} style={[styles.card, isDark && styles.cardDark]}>
            <Ionicons name={s.icon} size={26} color="#7c6aef" />
            <View style={styles.cardText}>
              <Text style={[styles.cardTitle, isDark && styles.textDark]}>{s.label}</Text>
              <Text style={[styles.cardDesc, isDark && styles.descDark]}>{s.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={isDark ? '#6a6a7a' : '#c0c0d0'} />
          </TouchableOpacity>
        ))}

        <Text style={[styles.hint, isDark && styles.descDark]}>
          Les sous-sections (personnages, univers, écriture...) arriveront dans les prochaines versions.
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faf8ff' },
  containerDark: { backgroundColor: '#12121f' },
  content: { padding: 16 },
  loading: { textAlign: 'center', marginTop: 40, color: '#6b6b7b' },
  desc: { fontSize: 15, color: '#4a4a5a', marginBottom: 20, lineHeight: 22 },
  descDark: { color: '#9a9aaa' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  cardDark: { backgroundColor: '#1a1a2e' },
  cardText: { flex: 1, marginLeft: 14 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#2a2a3e' },
  cardDesc: { fontSize: 13, color: '#6b6b7b', marginTop: 2 },
  textDark: { color: '#e8e4f5' },
  hint: { marginTop: 24, textAlign: 'center', fontSize: 13, color: '#9a9aaa', lineHeight: 20 },
});
