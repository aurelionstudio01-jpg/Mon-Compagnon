import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../../stores/settingsStore';

export default function TabsLayout() {
  const theme = useSettingsStore((s) => s.theme);
  const isDark = theme === 'sombre';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#7c6aef',
        tabBarInactiveTintColor: isDark ? '#8a8a9a' : '#6b6b7b',
        tabBarStyle: {
          backgroundColor: isDark ? '#1a1a2e' : '#ffffff',
          borderTopColor: isDark ? '#2a2a3e' : '#e8e4f5',
        },
        headerStyle: {
          backgroundColor: isDark ? '#1a1a2e' : '#f8f5ff',
        },
        headerTintColor: isDark ? '#e0d4ff' : '#4a3f8c',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Compagnon',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: 'Projets',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="library" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ideas"
        options={{
          title: 'Idées',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bulb" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'Plus',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="menu" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
