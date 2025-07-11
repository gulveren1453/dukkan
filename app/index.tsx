import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { auth } from '../firebase/Firebase-config';

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Kullanıcı giriş yaptıysa direkt /Products sayfasına yönlendir
        router.replace('/AuthScreen');
      } else {
        // Giriş yapmamışsa yine /Products sayfasına yönlendir
        // Ancak edit, delete, add gibi sayfalara gitmeye çalıştıklarında yönlendir
        router.replace('/AuthScreen');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#64b5f6" />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});
