import React from 'react'
import {Dimensions} from 'react-native'
import LottieView from 'lottie-react-native'

const {width,height} = Dimensions.get('window')

function Error(){
    return <LottieView source={require('../../assets/error.json')} autoPlay
                       style={{width,height}} />
}

export default Error