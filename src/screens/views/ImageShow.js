import {
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  TouchableOpacity
} from 'react-native';
import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';

const ImageShow = () => {
  const {vidLink} = useRoute().params;
  const navigation=useNavigation()
console.log("vidlink",vidLink)
  return (
    <>
     <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            height: '8%',
            justifyContent: 'center',
            backgroundColor: 'black',
          }}>
          <Image
            source={require('../../images/back-1.png')}
            style={{height: 50, width: 50, objectFit: 'contain'}}
          />
        </TouchableOpacity>
      <Animated.Image
        //  source={{uri:`file://${vidLink}`}}
        source={{
          uri: vidLink.startsWith('https') ? vidLink : `file://${vidLink}`,
        }}
        // style={[StyleSheet.absoluteFillObject]}
        style={{height:'92%',width:'100%'}}
      />
    </>
  );
};

export default ImageShow;
const styles = StyleSheet.create({});
