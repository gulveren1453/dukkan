import React from 'react'
import LottieView from 'lottie-react-native'
import {Dimensions} from 'react-native'

const {width,height}= Dimensions.get('window')

function Loading(){
    return <LottieView source={require('../../assets/loading.json')} autoPlay
                       style={{width,
                               height}}
    />
}

export default Loading