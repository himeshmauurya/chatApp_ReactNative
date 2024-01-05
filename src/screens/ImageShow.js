import { View, Text ,StyleSheet,Dimensions,Image,Animated} from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native'

const ImageShow = () => {
const {vidLink}=useRoute().params
  return (

    <>
      <Animated.Image
             source={{uri:`file://${vidLink}`}}
             style={[
               StyleSheet.absoluteFillObject
             ]}
             />
               
    </>
  )
}

export default ImageShow
const styles = StyleSheet.create({
    
});