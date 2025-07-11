import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, TextInput, View } from 'react-native';
import { db } from '../../firebase/Firebase-config';

export default function DeleteProduct() {
  const [productId, setProductId] = useState('');
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        Alert.alert('Login Required!', 'You must be logged in to delete a product.');
        router.replace('/AuthScreen');
      } else {
        // Admin kontrolü: E-posta kontrolü yapıyoruz
        if (user.email !== 'admin@gmail.com') {
          Alert.alert('Unauthorized Access!', 'Only admin can access this page.');
          router.replace('/Products'); // Admin olmayan kullanıcıyı Products sayfasına yönlendir
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSearch = async () => {
    try {
      if (!productId) {
        Alert.alert('Error!', 'Please enter a product ID.');
        return;
      }

      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        Alert.alert(
          'Deletion Confirmation',
          'Are you sure you want to delete this product?',
          [
            { text: 'No' },
            { text: 'Yes', onPress: () => handleDelete(docRef) },
          ]
        );
      } else {
        Alert.alert('Error!', 'No product with this ID was found.');
      }
    } catch (err) {
      Alert.alert('Error!', err.message);
    }
  };

  const handleDelete = async (docRef) => {
    try {
      await deleteDoc(docRef);
      Alert.alert('Successful!', 'Product deleted.');
      router.replace('/Products');
    } catch (err) {
      Alert.alert('Error!', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter the product ID"
        value={productId}
        onChangeText={setProductId}
        style={styles.input}
      />
      <Button title="Delete Product" onPress={handleSearch} />
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
