import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import { db } from '../../firebase/Firebase-config';

export default function AddProduct() {
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');  // Görsel URL'si için state
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        Alert.alert('Authentication needed!', 'For adding product you need to logged in!');
        router.replace('/AuthScreen'); // Giriş sayfasına yönlendir
      } else {
        setUser(user);
        // Eğer admin değilse, Products sayfasına yönlendir
        if (user.email !== 'admin@gmail.com') {
          Alert.alert('Unauthorized Access!', 'Only admin can access this page.');
          router.replace('/Products'); // Normal kullanıcıyı Products sayfasına yönlendir
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAdd = async () => {
    if (!id || !title || !desc || !price || !imageUrl) {
      Alert.alert('Incomplete Information', 'Please fill in all fields and enter an image URL.');
      return;
    }

    try {
      // Firestore'a verileri kaydet
      await setDoc(doc(db, 'products', id), {
        title,
        description: desc,
        price: parseFloat(price),
        image: imageUrl, // Girilen görsel URL'sini kaydediyoruz
      });

      Alert.alert('Successful!', 'Product successfully added.');
      router.back();
    } catch (err) {
      Alert.alert('Error!', `Product could not be added: ${err.message}`);
    }
  };

  if (!user) return null; // Eğer kullanıcı yoksa hiç bir şey render etme.

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Product ID"
        value={id}
        onChangeText={setId}
        style={styles.input}
      />
      <TextInput
        placeholder="Product Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={desc}
        onChangeText={setDesc}
        style={styles.input}
      />
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
        style={styles.input}
      />
      
      <TextInput
        placeholder="Image URL"
        value={imageUrl}
        onChangeText={setImageUrl}
        style={styles.input}
      />

      <Button title="Add Product" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 8,
    padding: 10,
    borderRadius: 5,
  },
});
