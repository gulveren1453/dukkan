import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ProductCard = ({ product, onSelect, onQuantityChange, initialQuantity }) => {
    const [quantity, setQuantity] = useState(initialQuantity); // Prop'tan başlat
  
    const handleIncrease = () => {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onQuantityChange(product.id, newQuantity);
    };
  
    const handleDecrease = () => {
      const newQuantity = Math.max(0, quantity - 1); // 0'ın altına düşmesin
      setQuantity(newQuantity);
      onQuantityChange(product.id, newQuantity);
    };
  

    return (
        <TouchableOpacity style={styles.container} onPress={onSelect}>
            <Image style={styles.image} source={{ uri: product.image }} />
            <View style={styles.body_container}>
                <Text style={styles.title}>{product.title}</Text>
                <Text style={styles.price}>{product.price} TL</Text>
                <View style={styles.quantityContainer}>
                    <TouchableOpacity onPress={handleDecrease} style={styles.quantityButton}>
                        <Text style={styles.quantityText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{quantity}</Text>
                    <TouchableOpacity onPress={handleIncrease} style={styles.quantityButton}>
                        <Text style={styles.quantityText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ProductCard;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#e0e0e0',
        borderColor: '#bdbdbd',
        borderWidth: 1,
        margin: 10,
        flexDirection: 'row',
    },
    image: {
        width: 100,
        minHeight: 100,
        resizeMode: 'contain',
        backgroundColor: 'white',
    },
    body_container: {
        flex: 1,
        padding: 5,
        justifyContent: 'space-between'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    price: {
        textAlign: 'right',
        fontSize: 16,
        fontStyle: 'italic',
    },
    quantityContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 5,
    },
    quantityButton: {
        backgroundColor: '#bdbdbd',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    quantityText: {
        fontSize: 16,
    }
});