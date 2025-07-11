import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { auth } from '../firebase/Firebase-config';

const PrivateRoute = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) {
      // Kullanıcı giriş yapmamışsa giriş sayfasına yönlendir
      router.push('/AuthScreen');
    }
  }, []);  // Bileşen ilk kez render olduğunda çalışacak

  return auth.currentUser ? children : null;  // Kullanıcı giriş yapmışsa, bileşenleri göster
};

export default PrivateRoute;
