import { useRouter } from 'expo-router';
import { collection, onSnapshot } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
} from 'react-native';

import Error from '../../components/Error/Error';
import Loading from '../../components/Loading/Loading';
import ProductCard from '../../components/ProductCard/ProductCard';
import { db } from '../../firebase/Firebase-config';

const Products = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const productList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(productList);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleProductSelect = (id) => {
    router.push(`/Products/details?id=${id}`);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setCart((prev) => ({
      ...prev,
      [productId]: newQuantity > 0 ? newQuantity : 0,
    }));
  };

  const calculateTotalPrice = () => {
    return data.reduce((total, product) => {
      const quantity = cart[product.id] || 0;
      const price = parseFloat(product.price) || 0;
      return total + quantity * price;
    }, 0);
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      router.replace('/AuthScreen'); // Giriş ekranına yönlendir
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

  const renderProduct = ({ item }) => (
    <ProductCard
      product={item}
      onSelect={() => handleProductSelect(item.id)}
      onQuantityChange={handleQuantityChange}
      initialQuantity={cart[item.id] || 0}
    />
  );

  if (loading) return <Loading />;
  if (error) return <Error />;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Üst Bar - Toplam Fiyat */}
      <View style={styles.topBar}>
        <Text style={styles.totalPriceText}>
          Total: {calculateTotalPrice().toFixed(2)} TL
        </Text>
      </View>

      <FlatList
        data={data}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        ListFooterComponent={
          <View style={styles.logoutContainer}>
            <Button title="Log out" color="red" onPress={handleLogout} />
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  totalPriceText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutContainer: {
    marginVertical: 20,
    marginHorizontal: 30,
  },
});

export default Products;
