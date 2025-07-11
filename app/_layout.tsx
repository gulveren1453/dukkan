import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="AuthScreen" options={{ title: 'Auth' }} />
      <Stack.Screen name="Products/index" options={{ title: 'Products' }} />
    </Stack>
  );
}