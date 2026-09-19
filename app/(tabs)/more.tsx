import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../../stores/settingsStore';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getDatabase } from '../../db/schema';

export default function MoreScreen() {
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const companionName = useSettingsStore((s) => s.name);
  const isDark = theme === 'sombre';

  const exportBackup = async () => {
    try {
      const db = await getDatabase();
      const projects = await db.getAllAsync('SELECT * FROM projects');
      const characters = await db.getAllAsync('SELECT * FROM characters');
      const ideas = await db.getAllAsync('SELECT * FROM ideas');
      const journal = await db.getAllAsync('SELECT * FROM journal_entries');
      const memory = await db.getAllAsync('SELECT * FROM memory_items');
      const world = await db.getAllAsync('SELECT * FROM world_elements');
      const drafts = await db.getAllAsync('SELECT * FROM drafts');

      const backup = {
        version: 1,
        exportedAt: new Date().toISOString(),
        projects,
        characters,
        ideas,
        journal,
        memory,
        world,
        drafts,
      };

      const path = FileSystem.documentDirectory + 'MonCompagnon_Backup.json';
      await FileSystem.writeAsStringAsync(path, JSON.stringify(backup, null, 2));

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(path, {
          mimeType: 'application/json',
          dialogTitle: 'Exporter la sauvegarde Mon Compagnon',
        });
      } else {
        Alert.alert('Sauvegarde créée', path);
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Erreur', 'Impossible d\'exporter la sauvegarde.');
    }
  };

  const MenuItem = ({
    icon,
    label,
    onPress,
    right,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress?: () => void;
    right?: React.ReactNode;
  }) => (
    <TouchableOpacity style={[styles.item, isDark && styles.itemDark]} onPress={onPress} disabled={!onPress && !right}>
      <Ionicons name={icon} size={22} color="#7c6aef" style={styles.icon} />
      <Text style={[styles.itemText, isDark && styles.textDark]}>{label}</Text>
      {right || <Ionicons name="chevron-forward" size={18} color={isDark ? '#6a6a7a' : '#c0c0d0'} />}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.section, isDark && styles.sectionDark]}>Compagnon</Text>
      <MenuItem icon="person-circle-outline" label={`Nom : ${companionName}`} />
      <MenuItem
        icon="color-palette-outline"
        label="Thème sombre"
        right={
          <Switch
            value={isDark}
            onValueChange={(v) => setTheme(v ? 'sombre' : 'clair')}
            trackColor={{ true: '#7c6aef' }}
          />
        }
      />

      <Text style={[styles.section, isDark && styles.sectionDark]}>Données</Text>
      <MenuItem icon="download-outline" label="Exporter la sauvegarde" onPress={exportBackup} />
      <MenuItem
        icon="information-circle-outline"
        label="À propos"
        onPress={() =>
          Alert.alert(
            'Mon Compagnon',
            'Version 1.0.0 (MVP)\n\nL\'IA m\'aide à créer.\nElle ne crée pas à ma place.\n\nToutes les données sont stockées localement sur ton appareil.'
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#faf8ff', padding: 16 },
  containerDark: { backgroundColor: '#12121f' },
  section: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7c6aef',
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionDark: { color: '#a89bff' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  itemDark: { backgroundColor: '#1a1a2e' },
  icon: { marginRight: 14 },
  itemText: { flex: 1, fontSize: 16, color: '#2a2a3e' },
  textDark: { color: '#e8e4f5' },
});
