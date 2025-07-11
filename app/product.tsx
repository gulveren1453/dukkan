import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert, Button, Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { db } from '../firebase/Firebase-config';

export default function Product() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: { display: 'none' },
    });
  }, [navigation]);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct(docSnap.data());
      } else {
        Alert.alert('Error!', 'Product not found, please try again.');
        router.back();
      }
    };

    fetchProduct();

    const auth = getAuth();
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => {
      unsubscribeAuth();
    };
  }, [id]);

  const handleDelete = async () => {
    Alert.alert('Delete', 'Are you sure you want to delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const docRef = doc(db, 'products', id);
            await deleteDoc(docRef);
            Alert.alert('Successful!', 'Product deleted.');
            router.replace('/Products');
          } catch (err) {
            Alert.alert('Error!', err.message);
          }
        },
      },
    ]);
  };

  const handleEdit = () => {
    router.push(`/Products/edit?id=${id}`);
  };

  if (!product) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.body_container}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.desc}>{product.description}</Text>
        <Text style={styles.price}>{product.price} TL</Text>

        {user && (
          <View style={styles.buttonContainer}>
            <Button title="Edit" onPress={handleEdit} />
            <Button title="Delete" onPress={handleDelete} color="red" />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body_container: {
    padding: 10,
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height / 3,
    resizeMode: 'contain',
    backgroundColor: 'white',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  desc: {
    fontStyle: 'italic',
    marginVertical: 5,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 22,
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 5,
  },
});
