import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { initDatabase } from '../db/schema';
import { useSettingsStore } from '../stores/settingsStore';

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    (async () => {
      try {
        await initDatabase();
        setReady(true);
      } catch (e) {
        console.error('Erreur init DB:', e);
        setReady(true); // on continue quand même
      }
    })();
  }, []);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#7c6aef" />
        <Text style={styles.loadingText}>Mon Compagnon se réveille...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style={theme === 'sombre' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme === 'sombre' ? '#1a1a2e' : '#f8f5ff',
          },
          headerTintColor: theme === 'sombre' ? '#e0d4ff' : '#4a3f8c',
          headerTitleStyle: {
            fontWeight: '600',
          },
          contentStyle: {
            backgroundColor: theme === 'sombre' ? '#12121f' : '#faf8ff',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="project/[id]" options={{ title: 'Projet' }} />
        <Stack.Screen name="character/[id]" options={{ title: 'Personnage' }} />
        <Stack.Screen name="idea/[id]" options={{ title: 'Idée' }} />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  loadingText: {
    marginTop: 16,
    color: '#e0d4ff',
    fontSize: 16,
  },
});
