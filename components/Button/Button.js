import React from "react";
import {TouchableOpacity, Text, StyleSheet,ActivityIndicator} from 'react-native'

const Button = ({text, onPress,loading}) => {
    return(
        <TouchableOpacity style={styles.container} onPress={onPress}>
            {loading ?
                (<ActivityIndicator color="white" />):
                (<Text style= {styles.title}>{text}</Text>)  
            }
        </TouchableOpacity>
    )
}
export default Button

const styles = StyleSheet.create({
    container: {
        padding:5,
        margin:10,
        backgroundColor: 'white',
        borderRadius:5,
        alignItems: 'center',
        borderWidth:4,
        borderColor: '#2286c3',
    },
    title: {
        fontWeight: 'bold',
        fontSize:17,
        color:'#64b5f6',
    }
})