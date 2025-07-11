import React from "react";
import {TextInput, View, StyleSheet} from 'react-native'

import {MaterialIcons} from '@expo/vector-icons'

const Input = ({placeholder,value, onType,iconName,isSecure}) => {
    return (
        <View style={styles.container}>
            <TextInput placeholder={placeholder} 
                       onChangeText={onType}
                       value={value}
                       style={styles.input}
                       secureTextEntry={isSecure}/>
            <MaterialIcons name={iconName} size={25} color="gray" />
        </View>
    )
}

export default Input

const styles= StyleSheet.create({
    container: {
        padding:5,
        margin:10,
        backgroundColor: 'white',
        borderRadius:5,
        flexDirection: 'row',
    },
    input:{
        flex:1,
    }
})