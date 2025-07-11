import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Alert, Button, Image, StyleSheet, Text, TextInput, View } from 'react-native';
import { db } from '../../firebase/Firebase-config';

export default function EditProduct() {
  const [productId, setProductId] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [user, setUser] = useState(null);
  const [productLoaded, setProductLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        Alert.alert('Login Required!', 'You must be logged in to edit the product.');
        router.replace('/AuthScreen');
      } else {
        setUser(user);
        // Admin kontrolü: E-posta kontrolü yapıyoruz
        if (user.email !== 'admin@gmail.com') {
          Alert.alert('Unauthorized Access', 'Only admin can access this page.');
          router.replace('/Products'); // Admin olmayan kullanıcıyı Products sayfasına yönlendir
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProduct = async () => {
    if (!productId) {
      Alert.alert('Warning!', 'Please enter a product ID');
      return;
    }

    try {
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const productData = docSnap.data();
        setTitle(productData.title);
        setDesc(productData.description);
        setPrice(productData.price.toString());
        setImage(productData.image);
        setProductLoaded(true);
      } else {
        Alert.alert('Error!', 'Product not found.');
      }
    } catch (err) {
      Alert.alert('Error!', err.message);
    }
  };

  const handleUpdate = async () => {
    if (!productLoaded) {
      Alert.alert('Error!', 'Please install a valid product first.');
      return;
    }

    try {
      const docRef = doc(db, 'products', productId);
      await updateDoc(docRef, {
        title,
        description: desc,
        price: parseFloat(price),
        image: image,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email,
      });

      Alert.alert('Successful!', 'Product edited.');
    } catch (err) {
      Alert.alert('Error!', err.message || 'An error occurred.');
    }
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ürün ID</Text>
      <TextInput
        placeholder="Enter product ID"
        value={productId}
        onChangeText={setProductId}
        style={styles.input}
      />
      <Button title="Get Product Information" onPress={fetchProduct} />

      {productLoaded && (
        <>
          <TextInput
            placeholder="Title"
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
            value={image}
            onChangeText={setImage}
            style={styles.input}
          />
          {image ? <Image source={{ uri: image }} style={styles.imagePreview} /> : null}
          <Button title="Edit" onPress={handleUpdate} />
        </>
      )}
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
  imagePreview: {
    width: 100,
    height: 100,
    marginVertical: 10,
    borderRadius: 5,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
