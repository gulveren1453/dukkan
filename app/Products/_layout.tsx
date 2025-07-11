import { Tabs, useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons'; // İkon kütüphanesini import et

export default function TabLayout() {
  const [user, setUser] = useState(null);
  const colorScheme = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        Alert.alert('Login Required!', 'Please log in.');
        router.replace('/AuthScreen');
      } else {
        setUser(user);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (!user) return null; // Only render tabs if user is authenticated

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons size={30} name="home" color={color} />, // Ana sayfa ikonu
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ color }) => <Ionicons size={30} name="add-circle" color={color} />, // Çiçek yerine ekleme ikonu
        }}
      />
      <Tabs.Screen
        name="edit"
        options={{
          title: 'Edit',
          tabBarIcon: ({ color }) => <Ionicons size={30} name="create" color={color} />, // Düzenleme ikonu
        }}
      />
      <Tabs.Screen
        name="delete"
        options={{
          title: 'Delete',
          tabBarIcon: ({ color }) => <Ionicons size={30} name="trash" color={color} />, // Silme ikonu
        }}
      />
    </Tabs>
  );
}
