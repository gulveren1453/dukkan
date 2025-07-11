import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage import edildi
import { getApp, getApps, initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getReactNativePersistence, initializeAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Firestore eklendi

// Firebase yapılandırma bilgileri
const firebaseConfig = {
  apiKey: 'AIzaSyBkRYLhlzVLdEfL6kYLy8uN6rA8I7MOLAQ',
  authDomain: 'reactnative-3e849.firebaseapp.com',
  projectId: 'reactnative-3e849',
  storageBucket: 'reactnative-3e849.appspot.com',
  messagingSenderId: '598449929627',
  appId: '1:598449929627:web:b0dfd8ac9d42998c041670',
};

// Firebase uygulamasının zaten başlatılmadığını kontrol et
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Firebase Auth persistence (kalıcı oturum) yapılandırması
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app); // Firestore bağlantısı

export {
  auth, // Firestore'u da export ediyoruz
  createUserWithEmailAndPassword, db, signInWithEmailAndPassword
};
