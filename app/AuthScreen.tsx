import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { Alert, Dimensions, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../firebase/Firebase-config';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleAuth = async (values) => {
    try {
      if (isLogin) {
        // Kullanıcıyı giriş yap
        await signInWithEmailAndPassword(auth, values.email, values.password);
        Alert.alert('Entry successful!');

        // Admin kontrolü: Belirli bir e-posta adresini admin olarak kabul et
        if (values.email === 'admin@gmail.com') {
          // Admin sayfasına yönlendir
          router.push('/Products');
        } else {
          // Normal kullanıcıyı Products sayfasına yönlendir
          router.push('/Products');
        }
      } else {
        // Yeni kullanıcı kaydı
        await createUserWithEmailAndPassword(auth, values.email, values.password);
        Alert.alert('Registration successful!');
        setIsLogin(true); // Kayıt sonrası giriş moduna geç
      }
    } catch (error) {
      Alert.alert('Error!', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logo_container}>
        <Image
          source={require('../assets/images/shopping-icon.png')}
          style={styles.logo}
        />
      </View>

      <Formik
        initialValues={{ email: '', password: '' }}
        onSubmit={handleAuth}
      >
        {({ handleSubmit, handleChange, values }) => (
          <View style={styles.body_container}>
            <Input
              placeholder="Email"
              value={values.email}
              onType={handleChange('email')}
              iconName="email"
            />
            <Input
              placeholder="Password"
              value={values.password}
              onType={handleChange('password')}
              iconName="lock"
              isSecure
            />
            <Button text={isLogin ? 'Log In' : 'Sign Up'} onPress={handleSubmit} />
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text style={styles.link}>
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </SafeAreaView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#64b5f6',
  },
  logo_container: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 3,
    resizeMode: 'contain',
    alignSelf: 'center',
    //tintColor: 'white',
  },
  body_container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  link: {
    color: 'white',
    textAlign: 'center',
    marginTop: 15,
    textDecorationLine: 'underline',
  },
});
