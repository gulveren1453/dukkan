import { useLocalSearchParams, useRouter } from 'expo-router';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import { db } from '../firebase/Firebase-config';

export default function Details() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, 'products', id.toString());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProduct(docSnap.data());
      } else {
        Alert.alert('Hata', 'Ürün bulunamadı');
        router.back();
      }
    };
    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    Alert.alert('Sil', 'Bu ürünü silmek istediğinizden emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            const docRef = doc(db, 'products', id.toString());
            await deleteDoc(docRef);
            Alert.alert('Başarılı', 'Ürün silindi');
            router.replace('/Products');
          } catch (err) {
            Alert.alert('Hata', err.message);
          }
        }
      }
    ]);
  };

  const handleEdit = () => {
    router.push(`/Products/edit?id=${id}`);
  };

  if (!product) return null;

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.body_container}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.desc}>{product.description}</Text>
        <Text style={styles.price}>{product.price} TL</Text>
        <View style={styles.buttonContainer}>
          <Button title="Düzenle" onPress={handleEdit} />
          <Button title="Sil" onPress={handleDelete} color="red" />
        </View>
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
  },
});